var BasicStrategy = require('passport-http').BasicStrategy;

module.exports = function(passport) {
  var users = { 'kevin': 'swiber' };

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new BasicStrategy(function(username, password, done) {
    if (users[username] && users[username] === password) {
      done(null, { username: username });
    } else {
      done(null, false, { message: 'Unknown user: ' + username });
    }
  }));

  return passport;
};

