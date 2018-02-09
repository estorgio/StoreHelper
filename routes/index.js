var express = require('express');
var router = express.Router();

var passport = require('passport');
var User = require('../models/User');

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: "Invalid username or password!"
}), function (req, res) {
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have successfully logged out.');
  res.redirect('/login');
});

router.get('/signup', function (req, res) {
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
    req.flash('success', 'Your account has successfully been registered.');
    return res.redirect('/signup');
  });

});

router.all('*', function (req, res) {
  res.status(404);
  res.render('error');
});

module.exports = router;