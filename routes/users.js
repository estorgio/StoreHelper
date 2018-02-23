var express = require('express');
var router = express.Router();

var User = require('../models/User');
var auth = require('../middleware/auth');

router.use(auth.isLoggedIn);

router.use(function (req, res, next) {
  res.setNavbarPage('/users');
  next();
});

router.get('/', function (req, res) {
  User.find({deleted: false}, function (err, users) {
    if (err) return res.render('error');
    res.setTitle('User Accounts');
    res.render('users/index', {users: users});
  });
});

router.get('/new', function (req, res) {
  res.setTitle('Add User Account');
  res.render('users/new');
});

router.post('/', function (req, res) {
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

router.get('/:id', function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err || !foundUser) {
      req.flash('error', 'Unable to find the specified user.');
      return res.redirect('/users');
    }

    res.setTitle('User Account - ' + foundUser.username);
    res.render('users/show', {user: foundUser});
  });
});

router.get('/:id/edit', function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err || !foundUser) {
      req.flash('error', 'Unable to find the specified user.');
      return res.redirect('/users');
    }

    res.setTitle('Edit User Account - ' + foundUser.username);
    res.render('users/edit', {user: foundUser});
  });
});

router.put('/:id', function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err || !foundUser) {
      req.flash('error', 'Unable to find the specified user.');
      return res.redirect('/users');
    }
    User.findByIdAndUpdate(req.params.id, req.body.user, function (err, updatedUser) {
      if (err || !updatedUser) {
        req.flash('error', 'An error occured while updating account information.');
        return res.redirect('/users/' + req.params.id);
      }

      req.flash('success', 'Account information successfully updated.');
      return res.redirect('/users/' + req.params.id);
    });
  });
});


router.post('/:id/disable', function (req, res) {
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

router.post('/:id/enable', function (req, res) {
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

router.delete('/:id', function (req, res) {
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


module.exports = router;