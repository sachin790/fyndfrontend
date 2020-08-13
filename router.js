var express = require("express");
var router = express.Router();
var cookie = require("cookie");
const jwt = require("jsonwebtoken");
var config = require("./config");
var request = require("request");




/**
 * Get All Movies - Without Auth  .
 */
router.get("/movies", function (req, res) {
  var options = {
    method: "GET",
    url: `${config.backend}/api/movies`,
    headers: {
      Authorization: "Bearer " + req.token,
      "Content-Type": "application/json"
    },
    json: true
  };


  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    res.locals = {
      title: "Movies",
      data: body.data,
    };
    res.render("Tables/tables_movies");

  });
});

/**
 * Get All Movies - With Filters  .
 */
router.post("/movies", function (req, res) {
  if (req.body.genre == "") {
    req.body.genre = [];
  } else {
    req.body.genre = req.body.genre.split(',');
  }
  let qs = {};
  if (req.body.name && req.body.name != "")
    qs.name = req.body.name;
  if (req.body.director && req.body.director != "")
    qs.director = req.body.director;
  if (req.body.genre && req.body.genre != "")
    qs.genre = req.body.genre;
  var options = {
    method: "GET",
    url: `${config.backend}/api/movies`,
    headers: {
      Authorization: "Bearer " + req.token,
      "Content-Type": "application/json"
    },
    qs: qs,
    json: true
  };


  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    res.locals = {
      title: "Movies",
      data: body.data,
    };
    res.render("Tables/tables_movies");

  });
});

/**
 * Get All Movies For Admin .
 */
router.get("/admin_movies", isLoggedIn, function (req, res) {
  var options = {
    method: "GET",
    url: `${config.backend}/api/admin/movies`,
    headers: {
      Authorization: "Bearer " + req.token,
      "Content-Type": "application/json"
    },
    json: true
  };


  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (body.status != 200) {
      res.redirect("/login");
    } else {
      res.locals = {
        title: "Movies",
        data: body.data,
      };
      res.render("Tables/tables_movies_admin");
    }


  });
});

/**
 * Render Add Movie Page .
 */
router.get("/add_movie", isLoggedIn, function (req, res) {
  res.locals = { title: "Add Movie" };
  res.render("Forms/add_movie.ejs");
});

/**
 * Get Movie Detail And Render Edit Page .
 */
router.get("/edit", isLoggedIn, function (req, res) {
  var options = {
    method: "GET",
    url: `${config.backend}/api/movie`,
    headers: {
      Authorization: "Bearer " + req.token,
      "Content-Type": "application/json"
    },
    qs: {
      id: req.query.id
    },
    json: true
  };


  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (body.status != 200) {
      res.redirect("/login");
    } else {
      res.locals = {
        title: "Edit Movie",
        data: body.data,
      };
      res.render("Forms/edit_movie.ejs");
    }


  });
});

/**
 * Add A Movie .
 */
router.post("/add_movie", isLoggedIn, function (req, res) {
  let genre = [];
  if (req.body.genre == "") {
    req.body.genre = [];
  } else {
    let arr = req.body.genre.split(',');
    for (let i = 0; i < arr.length; i++) {
      genre.push({
        id: i,
        name: arr[i]
      })
    }
  }
  req.body.imdb_score = parseFloat(req.body.imdb_score);
  req.body.popularity = parseFloat(req.body.popularity);
  req.body.genre = genre;
  var options = {
    method: "POST",
    url: `${config.backend}/api/movie/add`,
    headers: {
      Authorization: "Bearer " + req.token,
      "Content-Type": "application/json"
    },
    body: req.body,
    json: true
  };


  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (body.status != 200) {
      res.redirect("/login");
    } else
      res.redirect("/admin_movies");

  });
});

/**
 * Edit A Movie .
 */
router.post("/edit_movie", isLoggedIn, function (req, res) {
  let genre = [];
  if (req.body.genre == "") {
    req.body.genre = [];
  } else {
    let arr = req.body.genre.split(',');
    for (let i = 0; i < arr.length; i++) {
      genre.push({
        id: i,
        name: arr[i]
      })
    }
  }
  req.body.imdb_score = parseFloat(req.body.imdb_score);
  req.body.popularity = parseFloat(req.body.popularity);
  req.body.genre = genre;
  var options = {
    method: "POST",
    url: `${config.backend}/api/movie/edit`,
    headers: {
      Authorization: "Bearer " + req.token,
      "Content-Type": "application/json"
    },
    body: req.body,
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (body.status != 200) {
      res.redirect("/login");
    } else
      res.redirect("/admin_movies");

  });
});

/**
 * Delete A Movie  .
 */
router.get("/delete", isLoggedIn, function (req, res) {
  if (!req.query.id) {
    res.redirect("/admin_movies");
  }
  var options = {
    method: "GET",
    url: `${config.backend}/api/movie/delete`,
    headers: {
      Authorization: "Bearer " + req.token,
      "Content-Type": "application/json"
    },
    qs: {
      id: req.query.id
    },
    json: true
  };
  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    if (body.status != 200) {
      res.redirect("/login");
    } else
      res.redirect("/admin_movies");

  });
});

/**
 * Route for Logout .
 */
router.get("/logout", isLoggedIn, function (req, res) {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("admintoken", "", {
      httpOnly: false,
      maxAge: 0 // 1 week
    })
  );
  res.redirect("/login");
});

/**
 * Function To Check WHether User is login or not .
 */
function isLoggedIn(req, res, next) {
  var cookies = cookie.parse(req.headers.cookie || "");
  if (cookies.admintoken) {
    if (cookies.admintoken.length > 0) {
      jwt.verify(cookies.admintoken, "secret", function (err, decoded) {
        if (decoded) {
          req.token = cookies.admintoken;
          next();
        } else {
          res.redirect(`/login`);
        }
      });
    } else res.redirect(`/login`);
  } else res.redirect(`/login`);
}

module.exports = router;
