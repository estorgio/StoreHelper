var express = require('express');
var app = express();
var path = require('path');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var User = require('./models/User');

mongoose.connect('mongodb://localhost/storehelper', function (err) {
  if (err) {
    console.log('Unable to connect to the database.');
    console.log(err);
    process.exit(1);
  } else {
    console.log('Successfully connected to the database.');
  }
});

app.set('view engine', 'ejs');
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

// Setup authentication
app.use(session({
  secret: 'H59TG5xkicoQRr4gv9BijYz26KOKFViv7iio4OAZMlc15PHtuFj7reeYyXtVMvS8',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setup global template variables
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.flashError = req.flash('error');
  res.locals.flashSuccess = req.flash('success');
  next();
});

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: "Invalid username or password!"
}), function (req, res) {
});

app.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have successfully logged out.');
  res.redirect('/login');
});

app.get('/signup', function (req, res) {
  res.render('signup');
});

app.post('/signup', function (req, res) {
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

app.all('*', function (req, res) {
  res.status(404);
  res.render('error');
});

app.listen(3000, function () {
  console.log('App has been started on port 3000');
});