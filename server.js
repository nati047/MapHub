// load .env data into process.env
require("dotenv").config();

const location = require("./public/scripts/users_map");
// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
// const { coordsGetter } = require("./public/scripts/users_map")
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
  res.render("index");
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
  const templateVars = {id: userId}
  db.query(`
    SELECT users.name, latitude, longitude
    FROM users
    JOIN maps ON creator_id = users.id
    WHERE users.id = 1

  `)
  .then(result => {
    console.log('query successful', result.rows);
    let coords = {lat: result.rows[0].latitude, lng: result.rows[0].longitude};
    console.log("location is ---", location)
    location.values.lat = coords.lat;
    location.values.lng = coords.lng;
    templateVars.userName = result.rows[0].name;
    // console.log(templateVars)
   res.render('users', templateVars);
  })
  .catch(err => {
    console.log('querry not successfull\n', err)
})

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
