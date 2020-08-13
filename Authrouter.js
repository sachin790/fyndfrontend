var express = require('express');
var request = require('request');
var cookie = require('cookie');
var config = require("./config");
var Authrouter = express.Router();

Authrouter.use(express.static(__dirname + '/public'));

//Authentications all TABs.
Authrouter.get('/', function (req, res) {
  res.redirect("/movies");
});


Authrouter.get('/login', function (req, res) {
  if (req.query.message) {
    res.locals = { title: 'Login', message: req.query.message };
    res.render('Auth/login');
  }

  res.locals = { title: 'Login' };
  res.render('Auth/login');


});



Authrouter.post('/login', function (req, res) {

  var options = {
    method: 'POST',
    url: `${config.backend}/api/admin/login`,
    headers:
    {
      'Content-Type': 'application/json'
    },
    body: req.body
    ,
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (body.status != 200) {
      res.locals = { title: 'Login', message: body.message };
      res.render('Auth/login');
    } else {
      res.setHeader('Set-Cookie', cookie.serialize('admintoken', String(body.data), {
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7 // 1 week
      }));
      res.redirect(`/admin_movies`);
    }
  });
})

module.exports = Authrouter;