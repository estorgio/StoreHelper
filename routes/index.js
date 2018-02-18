var express = require('express');
var router = express.Router();

var passport = require('passport');
var User = require('../models/User');

router.get('/', function (req, res) {
  res.setNavbarPage('/');
  res.setTitle('Welcome');
  res.render('index');
});

router.get('/login', function (req, res) {
  res.setNavbarPage('/login');
  res.setTitle('Login');
  res.render('login');
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'Invalid username or password!');
      return res.redirect('/login');
    }
    if (!user.enabled) {
      req.flash('error', 'Unable to login. This account has been disabled.');
      return res.redirect('/login');
    }
    if (user.deleted) {
      req.flash('error', 'Unable to login. This account has been already deleted.');
      return res.redirect('/login');
    }
    req.logIn(user, function (err) {
      if (err) return next(err);
      user.last_login = Date.now();
      user.save();
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have successfully logged out.');
  res.redirect('/login');
});

router.get('/signup', function (req, res) {
  res.setNavbarPage('/signup');
  res.setTitle('Sign Up');
  res.render('signup');
});

router.post('/signup', function (req, res) {
  var username = req.body.username || '';
  var password1 = req.body.password || '';
  var password2 = req.body.passwordconf || '';

  if (!username || username.length <= 0) {
    req.flash('error', 'Please enter a username.');
    return res.redirect('/signup');
  }

  if (password1 !== password2) {
    req.flash('error', 'Passwords do not match.');
    return res.redirect('/signup');
  }

  if (!password1 || password1.length <= 0) {
    req.flash('error', 'Please enter a password.');
    return res.redirect('/signup');
  }

  if (username.length < 5) {
    req.flash('error', 'Username should be at least 5 characters.');
    return res.redirect('/signup');
  }

  if (password1.length < 8) {
    req.flash('error', 'Password should be at least 8 characters.');
    return res.redirect('/signup');
  }

  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('/signup');
    }
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.save();

    req.flash('success', 'Your account has successfully been registered.');
    return res.redirect('/login');
  });

});

router.all('*', function (req, res) {
  res.setTitle('Error');
  res.status(404);
  res.render('error');
});

module.exports = router;