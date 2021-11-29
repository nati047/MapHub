// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

//renders css from public folder
app.use('/public', express.static('public'));
// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  let templateVars = {};
  db.query(`
    SELECT maps.*, users.username FROM maps
    JOIN users ON users.id = maps.creator_id;
  `).then(result => {
    console.log('query successful');
    templateVars.maps = result.rows;
    console.log(templateVars);
    res.render('index', templateVars);
  })
    .catch(err => {
      console.log('querry not successfull\n', err);
    });
});

app.get("/mapPage", (req, res) => {
  res.render("mapPage");
});

app.get("/sasquatchsightings", (req,res) => {
  res.render("sasquatch_map");
});
app.get("/login", (req,res) => {
  res.render("login");
});
app.post("/login", (req,res) => { // redirects to home page for now
  res.render("index");
});

app.get("/:id/users", (req,res) => {
  const userId = req.params.id;
  const templateVars = {id: userId};
  db.query(`
    SELECT name FROM users WHERE id = ${userId}
  `).then(result => {
    console.log('query successful');
    //   let val;
    //  for(let obj of result.rows) {
    //    console.log('obj is', obj)
    //    if(obj.id === Number(userId)) {
    //      val = obj;
    //    }
    //  }
    templateVars.userName = result.rows[0].name;
    console.log(templateVars);
    res.render('users', templateVars);
  })
    .catch(err => {
      console.log('querry not successfull\n', err);
    });

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
