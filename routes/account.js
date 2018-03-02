var express = require('express');
var router = express.Router();
var upload = require('../utils/upload')
  .single('profile_picture');

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
  upload(req, res, function (err) {

    if (err){
      req.flash('error', err.toString());
      return res.redirect('/account/edit');
    }

    if (req.file) {
      req.body.user.picture = req.file.filename;
    }

    // req.body.user.picture = req.file
    //   ? req.file.filename
    //   : null;

    Users.findByIdAndUpdate(req.user.id, req.body.user, function (err, updatedAccount) {
      if (err || !updatedAccount) {
        req.flash('error', 'Unable to update your account info.');
        return res.redirect('/account');
      }
      req.flash('success', 'Your account info has been successfully updated.');
      return res.redirect('/account');
    });

  });
});

module.exports = router;