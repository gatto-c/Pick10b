"use strict";

const
    Router = require('koa-router');

module.exports.anonymousRouteMiddleware = function(passport) {
  const
    routes = new Router(),
    pages = require('route-handlers/anonymous/pages');

  routes.get('/', pages.applicationPage);
  //routes.get('/', pages.loginPage);

  //routes.post('/login',
  //  passport.authenticate('local', {
  //    successRedirect: '/application#/home-stuff',
  //    failureRedirect: '/fail'
  //  })
  //);
  //
  //routes.get('/logout', pages.loginPage);

  //routes.get('/appMainPage', function*() {
  //  this.redirect('/application#/home');
  //});

  routes.get('/application', pages.applicationPage);

  return routes.middleware();
};

module.exports.microserviceRouteMiddleware = function() {
    const securedRest = new Router();
    const restProxy = require("../route-handlers/anonymous/rest-proxy");

    securedRest.get("/rest/:action/:id", restProxy.resolveRequest);

    return securedRest.middleware();
};

