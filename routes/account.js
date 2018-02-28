var express = require('express');
var router = express.Router();

var Users = require('../models/User');
var auth = require('../middleware/auth');

router.use(auth.isLoggedIn);

router.get('/', function (req, res) {
  res.render('account/index', {user: req.user});
});

router.get('/edit', function (req, res) {
  res.render('account/edit');
});

module.exports = router;