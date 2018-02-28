var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,

  gender: {type: String, default: null},
  birthdate: {type: Date, default: null},
  civil_status: {type: String, default: null},
  address: {type: String, default: null},
  phone: {type: String, default: null},

  type: {type: String, default: 'cashier'},
  branch: {type: String, default: null},

  created: {type: Date, default: Date.now},
  last_login: {type: Date, default: Date.now},
  enabled: {type: Boolean, default: true},
  deleted: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);