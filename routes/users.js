var express = require('express');
var route = express.Router();

var User = require('../models/User');

route.get('/', function (req, res) {
  User.find({}, function (err, users) {
    if (err) return res.render('error');
    res.render('users/index', {users: users});
  });
});

route.get('/new', function (req, res) {
  res.render('users/new');
});

route.post('/', function (req, res) {
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

route.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err || !foundUser) {
      req.flash('error', 'Unable to find the specified user.');
      return res.redirect('/users');
    }

    res.render('users/show', {user: foundUser});
  })
})


module.exports = route;