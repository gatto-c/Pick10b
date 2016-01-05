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
        ctx.status = 200;
        ctx.body = { success: true }
      }
    }).call(this, next)
  });

  routes.post('/register', function(req, res) {
    User.register(new User({ username: req.body.username }), req.body.password, function(err, account) {
      if (err) {
        return res.status(500).json({err: err});
      }
      passport.authenticate('local')(req, res, function () {
        return res.status(200).json({status: 'Registration successful!'});
      });
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

