var express = require('express');
var route = express.Router();

var Users = require('../models/User');

route.get('/', function (req, res) {
  Users.find({}, function (err, users) {
    if (err) return res.render('error');
    res.render('users/index', {users: users});
  });
});

route.get('/new', function (req, res) {
  res.render('users/new');
});


module.exports = route;