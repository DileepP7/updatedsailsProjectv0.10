/**
 * AuthController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport');

module.exports = {

  index: function(req, res) {
    res.view();
  },

  logout: function(req, res) {
   // req.session.destroy();
    req.logout();
    res.redirect('/');
  },

  // https://developers.facebook.com/docs/
  // https://developers.facebook.com/docs/reference/login/
 facebook: function(req, res) {
    passport.authenticate('facebook', { failureRedirect: '/', scope: ['email'] }, function(err, user) {
      

      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }
        req.session.authenticated = true;
        req.session.User = user;
        res.redirect('/user/dashboard');
        return;
      });
    })(req, res);
  },


  // https://developers.google.com/
  // https://developers.google.com/accounts/docs/OAuth2Login#scope-param
  google: function(req, res) {
    passport.authenticate('google', { failureRedirect: '/login', scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

        req.session.authenticated = true;
        req.session.User = user;
        res.redirect('/user/dashboard');
        return;
      });
    })(req, res);
  },

  // https://apps.twitter.com/
  // https://apps.twitter.com/app/new
  twitter: function(req, res) {
    passport.authenticate('twitter', { failureRedirect: '/login' }, function(err, user) {
      req.logIn(user, function(err) {
        if (err) {
          console.log(err);
          res.view('500');
          return;
        }

         req.session.authenticated = true;
        req.session.User = user;
        res.redirect('/user/dashboard');
        return;
      });
    })(req, res);
  }
};
