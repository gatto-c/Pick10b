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
  //routes.get('/', pages.loginPage);

  //routes.post('/login',
  //  passport.authenticate('local', {
  //    successRedirect: '/',
  //    failureRedirect: '/login?error=local'
  //  })
  //);
  //
  //routes.get('/logout', pages.loginPage);

  //routes.get('/appMainPage', function*() {
  //  this.redirect('/application#/home');
  //});

  routes.get('/application', pages.applicationPage);

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

  routes.post('/register', function*(next) {
    //http://tastenjesus.de/koajs-first-application-using-kamn-stack-part-12/

    var ctx = this;

    //logger.debug('/register: ctx.body: ', ctx.request.body);
    var player = new Player({username: ctx.request.body.username, password: ctx.request.body.password, email: ctx.request.body.username});
    player.password = player.generateHash(player.password);
    yield player.save(function (err) {
      if (err) {
        ctx.status = 401;
        ctx.body = { success: false }
      }
      else {
        logger.debug('info', 'Player saved: ', player.username);
        ctx.status = 200;
        ctx.body = { success: true }
      }
    });
  });

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

