var AuthWrapper = function(passport) {
  this.passport = passport;
};

AuthWrapper.prototype.initialize = function(handle) {
  var passport = this.passport;
  handle('request', function(env, next) {
    env.auth = env.auth || {};
    var authenticator = passport.initialize();
    authenticator(env.request, env.response, function() { next(env); });
  });
};

AuthWrapper.prototype.authenticate = function() {
  var passport = this.passport;
  var args = Array.prototype.slice.call(arguments);
  console.log(args);
  var cb = args.slice(-1)[0];
  console.log(cb);
  var params = args.slice(0, -1);
  console.log(params);

  return function(handle) {
    handle('request', function(env, next) {
      var handler = cb(env, next);
      params.push(handler);
      console.log(params);
      var fn = passport.authenticate.apply(passport, params);
      fn(env.request, env.response);
    });
  }
};

var package = function(passport) {
  var wrapper = new AuthWrapper(passport);
  return function(strategy, cb) {
    return {
      package: function(argo) {
        return {
          name: 'argo-passport-wrapper',
          install: function() {
            argo
              .use(wrapper.initialize.bind(wrapper))
              .use(wrapper.authenticate.call(wrapper, strategy, cb));
          }
        };
      }
    };
  };
};

module.exports = function(passport) {
  return package(passport);
};
