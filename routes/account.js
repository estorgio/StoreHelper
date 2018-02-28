var express = require('express');
var router = express.Router();

var Users = require('../models/User');
var auth = require('../middleware/auth');

router.use(auth.isLoggedIn);

router.get('/', function (req, res) {
  res.render('account/index', {user: req.user});
});

router.get('/edit', function (req, res) {
  res.render('account/edit', {user: req.user});
});

router.put('/', function (req, res) {
  Users.findByIdAndUpdate(req.user.id, req.body.user, function (err, updatedAccount) {
    if (err || !updatedAccount) {
      req.flash('error', 'Unable to update your account info.');
      return res.redirect('/account');
    }
    req.flash('success', 'Your account info has been successfully updated.');
    return res.redirect('/account');
  });
});

module.exports = router;