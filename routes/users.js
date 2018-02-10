var express = require('express');
var route = express.Router();

var Users = require('../models/User');

route.get('/', function (req, res) {
  res.render('users/index');
});


module.exports = route;