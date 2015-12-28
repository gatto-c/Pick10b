"use strict";

// Enable requiring modules relative to server directory
require('app-module-path').addPath(__dirname + '/server');

const getIdentity = function(){
    let os = require('os');
    return {
        serverIdentity: os.hostname(),
        processIdentity: process.env['processIdentity']
    }
};

module.exports.startServer = function(config) {

    // lib
    const
        koa = require('koa'),
        koaRender = require('koa-render'),
        bodyParser = require('koa-bodyparser'),
        session = require('koa-generic-session'),
        mongo = require('koa-mongo'),
        passport = require('koa-passport');

    // integration
    const
        serveStaticContent = require('middleware/my-koa-static-folder'),
        routes = require('routes/routes');

    // init
    const
        app = koa(),
        id = getIdentity(),
        FIFTEEN_MINUTES = 15 * 60 * 1000;

    console.log('Starting:', id);

    app.keys = ['6AD7BC9C-F6B5-4384-A892-43D3BE57D89F'];
    app.use(session({
        //store: new MysqlStore(config.db),
        rolling: true,
        cookie: {maxage: FIFTEEN_MINUTES}
    }));

    app.use(function*(next){
        yield next;
        if(this.status == 404) {
            console.log('no route handler', this.path);
        }
    });

    /////////////////////////////////////////////////////////
    // establish the server-side templates
    /////////////////////////////////////////////////////////
    app.use(koaRender('./server/server-side-views', {
        map: { html: 'swig' },
        cache: false
    }));

    // todo: use mongo
//    app.use(mongo({
//        uri: config.mongoUri,
//        max: 100,
//        min: 1,
//        timeout: 30000,
//        log: false
//    }));

    /////////////////////////////////////////////////////////
    // body parser
    /////////////////////////////////////////////////////////
    app.use(bodyParser());

    /////////////////////////////////////////////////////////
    // Anonymous routes
    /////////////////////////////////////////////////////////
    // static files
    app.use(serveStaticContent(__dirname, './client'));

    // anonymous API calls
    app.use(routes.anonymousRouteMiddleware(passport));

    // secure microservice access
    app.use(routes.microserviceRouteMiddleware());

    /////////////////////////////////////////////////////////
    // It's go time
    /////////////////////////////////////////////////////////
    app.listen(config.port);
    console.log('LISTENING ON: ' + config.port)
};
