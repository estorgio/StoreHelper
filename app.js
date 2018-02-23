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
var methodOverride = require('method-override');
var User = require('./models/User');

// Importing routes
var indexRoutes = require('./routes/index');
var userRoutes = require('./routes/users');

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
app.use(methodOverride('_method'));
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

app.use(require('./middleware/navigation'));

app.use('/users', userRoutes);
app.use('/', indexRoutes);

var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('App has been started on port ' + PORT);
});