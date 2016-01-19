"use strict";

const
    Router = require('koa-router'),
    logger = require('../../logger'),
    Player = require('../models/player');

module.exports.anonymousRouteMiddleware = function(passport) {
  const
    routes = new Router(),
    pages = require('route-handlers/anonymous/pages');

  routes.get('/', pages.applicationPage);
  routes.get('/application', pages.applicationPage);

  /**
   * handle login post
   */
  routes.post('/login', function*(next) {
    var ctx = this;
    yield passport.authenticate('local', function*(err, user, info) {
      if (err) throw err;
      if (user === false) {
        ctx.status = 401;
        ctx.body = { success: false }
      } else {
        yield ctx.login(user);
        ctx.status = 200;
        ctx.body = { success: true }
      }
    }).call(this, next)
  });

  /**
   * handle registration post
   */
  routes.post('/register', function*(next) {
    //http://tastenjesus.de/koajs-first-application-using-kamn-stack-part-12/
    //https://github.com/dozoisch/koa-react-full-example/blob/master/

    var ctx = this;

    //create a new player mongoose model
    var player = new Player({username: ctx.request.body.username, password: ctx.request.body.password, email: ctx.request.body.username});

    //attempt to save new player
    try {
      yield player.save();
      ctx.status = 200;
      ctx.body = { success: true };
    } catch (err) {
      //if this is an error condition return relevant error to caller
      ctx.status = (err.message == 'duplicate' ? 409 : 401); //409 represents a duplicate player, 401 a general error
      ctx.body = { success: false };
    }
  });

  /**
   * handle logout get
   */
  routes.get('/logout', function*(next) {
    this.logout();
    this.redirect('/');
  });

  return routes.middleware();
};



module.exports.microserviceRouteMiddleware = function() {
    const securedRest = new Router();
    const restProxy = require("../route-handlers/anonymous/rest-proxy");

    securedRest.get("/rest/:action/:id", restProxy.resolveRequest);

    return securedRest.middleware();
};

