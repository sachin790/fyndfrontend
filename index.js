var app = require('express')();
var express = require('express');
var path = require('path');
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var router = require('./router.js');
var Authrouter = require('./Authrouter.js');
const fileUpload = require('express-fileupload');

// Access public folder from root
app.use(fileUpload());
app.use('/public', express.static('public'));
app.get('/layouts/', function (req, res) {
  res.render('view');
});
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
// Add Authentication Route file with app
app.use('/', Authrouter);
//For set layouts of html view
var expressLayouts = require('express-ejs-layouts');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// Add Route file with app
app.use('/', router);
var port = process.env.PORT || 8000

http.listen(port, function () {
  console.log('listening on *:' + port);
});
