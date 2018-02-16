var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  type: {type: String, default: 'cashier'},
  created: {type: Date, default: Date.now},
  last_login: {type: Date, default: Date.now},
  enabled: {type: Boolean, default: true},
  deleted: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);