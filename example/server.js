var argo = require('argo');
var router = require('argo-url-router');
var resource = require('argo-resource');
var passport = require('passport');
var wrapper = require('../passport');
var config = require('./config');

var Products = require('./products');

var auth = wrapper(config(passport));

argo()
  .use(auth('basic', function(env, next) {
    return function(err, user, info) {
      if (err || !user) {
        env.response.writeHead(401, { 'WWW-Authenticate': info });
        env.response.end();
        return;
      }

      env.auth.user = user;
      console.log('calling next');
      next(env);
    };
  }))
  .use(router)
  .use(resource(Products))
  .listen(3000);
