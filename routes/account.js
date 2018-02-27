var express = require('express');
var router = express.Router();

var Users = require('../models/User');
var auth = require('../middleware/auth');

//router.use(auth.isLoggedIn);

router.get('/', function (req, res) {
  res.render('account/index');
});

module.exports = router;