var bodyParser = require('body-parser');
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
// set the default path for views
app.set('views', require('path').join(__dirname, '/views'));
// support for EJS layouts
app.use(ejsLayouts);
// support for form submitted values
app.use(bodyParser.urlencoded({ extended: true }));
// setup a folder for the static files
app.use(express.static('assets'));
// helper function to start the app
app.start = function(port, host) {
    port = port || 8080;
    host = host || 'localhost';
    app.listen(port, host);
    console.log('Server running at: http://' + host + ':' + port + '...');
}

module.exports = app;
