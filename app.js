var express = require('express');
var app = express();
var path = require('path');
var helmet = require('helmet');

app.set('view engine', 'ejs');
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(helmet());

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.get('/signup', function (req, res) {
  res.render('signup');
});

app.all('*', function (req, res) {
  res.status(404);
  res.render('error');
});

app.listen(3000, function () {
  console.log('App has been started on port 3000');
});