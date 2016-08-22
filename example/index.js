// create a config object that tells koop where to write data and what db to use
var config = {
  // "data_dir": "/usr/local/koop/",
  // "db": {
  //   "conn": "postgres://localhost/koopdev"
  // }
};

// pass the config to koop
var koop = require('koop')(config);

// require and register the provider to bind its routes and handlers
var povcal = require('../');
koop.register(povcal);

// create an express app
var app = require('express')();

// add koop middleware to the express app
app.use(koop);

// start the express server
app.listen(process.env.PORT || 1337, function () {
  console.log('Listening at http://localhost:%d/', this.address().port);
});
