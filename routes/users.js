var express = require('express');
var route = express.Router();

var User = require('../models/User');
var middleware = require('../middleware/index');

route.use(function (req, res, next) {
  res.setNavbarPage('/users');
  next();
});

route.get('/', middleware.isLoggedIn, function (req, res) {
  User.find({deleted: false}, function (err, users) {
    if (err) return res.render('error');
    res.setTitle('User Accounts');
    res.render('users/index', {users: users});
  });
});

route.get('/new', middleware.isLoggedIn, function (req, res) {
  res.setTitle('Add User Account');
  res.render('users/new');
});

route.post('/', middleware.isLoggedIn, function (req, res) {
  var formData = req.body.user;
  var newUser = new User({ username: formData.username });

  User.register(newUser, formData.password, function (err, user) {
    if (err) return res.render('error');
    user.firstname = formData.firstname;
    user.lastname = formData.lastname;
    user.type = formData.type;
    user.save();

    req.flash('success', 'User account successfully created.');
    return res.redirect('/users');
  });
});

route.get('/:id', middleware.isLoggedIn, function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err || !foundUser) {
      req.flash('error', 'Unable to find the specified user.');
      return res.redirect('/users');
    }

    res.setTitle('User Account - ' + foundUser.username);
    res.render('users/show', {user: foundUser});
  });
});

route.post('/:id/disable', middleware.isLoggedIn, function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err || !foundUser) {
      req.flash('error', 'Unable to find the specified user.');
      return res.redirect('/users');
    }
    foundUser.enabled = false;
    foundUser
      .save()
      .then(function () {
        req.flash('success', 'Account has been disabled.');
        return res.redirect('/users');
      })
      .catch(function () {
        req.flash('success', 'An error occurred while disabling the user.');
        return res.redirect('/users');
      });
  });
});

route.post('/:id/enable', middleware.isLoggedIn, function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err || !foundUser) {
      req.flash('error', 'Unable to find the specified user.');
      return res.redirect('/users');
    }
    foundUser.enabled = true;
    foundUser
      .save()
      .then(function () {
        req.flash('success', 'Account has been successfully enabled.');
        return res.redirect('/users');
      })
      .catch(function () {
        req.flash('success', 'An error occurred while enabling the user.');
        return res.redirect('/users');
      });
  });
});

route.delete('/:id', middleware.isLoggedIn, function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err || !foundUser) {
      req.flash('error', 'Unable to find the specified user.');
      return res.redirect('/users');
    }
    foundUser.deleted = true;
    foundUser
      .save()
      .then(function () {
        req.flash('success', 'Account has been successfully deleted.');
        return res.redirect('/users');
      })
      .catch(function () {
        req.flash('success', 'An error occurred while deleting the account.');
        return res.redirect('/users');
      });
  });
});


module.exports = route;