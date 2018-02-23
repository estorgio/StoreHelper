// Please fill in the appropriate settings
// and save this file as 'config.php'

module.exports = {

  // DATABASE_URI - database URI that points to a MongoDB database
  DATABASE_URI: "mongodb://localhost/storehelper",

  // APP_PORT - the port where app listens for HTTP requests
  APP_PORT: process.env.PORT || 3000,

  // SESSION_SECRET - random string of characters used to initialize sessions
  // (WARNING! DO NOT FORGET TO GENERATE YOUR OWN ID, AT LEAST 64 CHARACTERS)
  SESSION_SECRET: ""

};