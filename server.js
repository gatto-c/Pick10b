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
        logger = require('./logger'),
        session = require('koa-generic-session'),
        mongoStore = require('koa-generic-session-mongo'),
        mongo = require('koa-mongo'),
        mongoose = require('mongoose'),
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
        key: 'Pick10',
        store: new mongoStore({url: config.mongoUri}),
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
    mongoose.connect(config.mongoUri);
    //app.use(mongo({
    //    uri: config.mongoUri,
    //    max: 100,
    //    min: 1,
    //    timeout: 30000,
    //    log: false
    //}));

    /////////////////////////////////////////////////////////
    // body parser
    /////////////////////////////////////////////////////////
    app.use(bodyParser());

  logger.log('debug', 'Hello distributed log files!');
  logger.log('info', 'Hello distributed log files!');
  logger.log('warn', 'Hello distributed log files!');
  logger.log('error', 'Hello distributed log files!');
  //
  //logger.level = 'debug';
  //logger.log('debug', 'Now my debug messages are written to console!');

  //logger.log('warn', 'WARNING - some stuff is happening');
  //logger.log('error', 'ERROR - some bad stuff is happening');


  /////////////////////////////////////////////////////////
    // authentication
    /////////////////////////////////////////////////////////
    require('./auth');
    app.use(passport.initialize());
    app.use(passport.session());

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
