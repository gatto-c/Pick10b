"use strict";

const
    Router = require('koa-router'),
    logger = require('../../logger');

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
        ctx.body = { success: true }
      }
    }).call(this, next)
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

