/* eslint-disable camelcase */
// load .env data into process.env
require("dotenv").config();


// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
//

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

app.use("/styles",sassMiddleware({
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
    // console.log('query successful');
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
    SELECT users.username, maps.mapname as mapname
    FROM users
    JOIN maps ON creator_id = users.id
    WHERE users.id = 1;
  `)
    .then(result => {
      console.log('query successful', result.rows);
      templateVars.userName = result.rows[0].username;
      templateVars.mapName = result.rows[0].mapname;
      db.query(`    SELECT maps.mapname as favourite_maps
      FROM maps
      JOIN favourites ON maps.id = saved_from_map_id
      WHERE saved_to_user_id = 1;`)
        .then(result => {
          console.log('second query', result.rows);
          templateVars.favouriteMaps = result.rows;
          console.log('templateVars after second query',templateVars);
          db.query(` SELECT maps.mapname as collaborated_maps
      FROM maps
      JOIN collaborated ON maps.id = map_id
      WHERE user_id = 1;`)
            .then(result => {
              templateVars.collaboratedMaps = result.rows;
              console.log('templatevars after third', templateVars);
              res.render('users', templateVars);
            });
        });
    })
    .catch(err => {
      console.log('querry not successfull\n', err);
    });
});



app.get('/initmap', (req, res)=> {
  db.query(`SELECT maps.id as map_id, maps.latitude, maps.longitude, markers.id as marker_id, markers.latitude as marker_lat, markers.longitude as marker_long, markers.markername as title, markers.description as content, markers.id as id
  FROM maps
  JOIN markers ON map_id = maps.id
  WHERE creator_id = 1 `
  )
    .then(result => {
      console.log("query result", result.rows);
      res.json(result.rows);
    });
});

app.get('/initmap/:id', (req, res)=> {
  const userId = req.params.id;
  db.query(`SELECT maps.id as map_id, maps.latitude, maps.longitude, markers.latitude as marker_lat, markers.longitude as marker_long, markers.markername as title, markers.id as marker_id
  FROM maps
  JOIN markers ON map_id = maps.id
  WHERE creator_id = 1 `
  )
    .then(result => {
      // console.log("query result", result.rows);
      res.json(result.rows);
    });
});

// END POINT TO GET THE ID OF THE MAP USING IT'S NAME AND THEN INSERTS IT INTO THE USER'S FAVOURITES
app.get('/:id/addToFavourites', (req,res) => {
  let element = req.params.id;
  console.log(element);
  db.query(`SELECT id, mapname FROM maps
  WHERE id = $1`, [element])
    .then(result => {
      console.log("query result", result.rows[0].id);
      let map_id = result.rows[0].id;
      db.query(`
      DELETE FROM favourites
      WHERE saved_to_user_id = 1 AND saved_from_map_id = $1;
      `, [map_id])
        .then(result => {
          db.query(`INSERT INTO favourites (saved_to_user_id, saved_from_map_id)
        VALUES (1, $1);`,[map_id]);
          console.log('map_id:',map_id);
        });
      res.json(result.rows);
    })
    .catch(err =>{
      console.log('query failed - you already have this map in your favourites',err);
    });
});
// END POINT TO REMOVE MAP FROM USER'S FAVOURITES
app.get('/:id/removeFromFavourites', (req,res) => {
  let element = req.params.id;
  console.log(element);
  db.query(`SELECT id, mapname FROM maps
  WHERE id = $1`, [element])
    .then(result => {
      console.log("query result", result.rows[0].id);
      let map_id = result.rows[0].id;
      db.query(`
      DELETE FROM favourites
      WHERE saved_to_user_id = 1 AND saved_from_map_id = $1;
      `, [map_id]);
      res.json(result.rows);
    })
    .catch(err =>{
      console.log('query failed',err);
    });
});

app.get('/login/:id', (req, res) => {
  const userId = req.params.id;
  res.redirect(`/${userId}/users`);
});

app.get('/:id/create', (req, res) => { // render a map create page
  res.render('create_map');
});

app.post('/:id/create', (req, res) => { // takes user inputs and adds a new map to the maps database
  console.log('request body ****************\n', req.body);
  db.query(`
  INSERT INTO maps (creator_id, mapname, description, image_url, latitude, longitude)
  VALUES (1, $1 , $2 , $3 , $4, $5)
  `, [req.body.name, req.body.description, req.body.image_url, req.body.latitude, req.body.longitude])
    .then(result =>{
      console.log('done');
      res.redirect('/');
    })
    .catch(err =>{
      console.log('query failed',err);
    });


});

let mapId = 0;  // since the api callback can't take a parameter we need to grab mapid from request's url
// store it in a global variable and pass the variable to another route
app.get('/selected_map/:id', (req, res) => {
  const templateVars = {map_id: req.params.id};
  mapId = req.params.id;
  db.query(`SELECT *
  FROM maps
  WHERE maps.id = $1`, [ mapId ]
  )
    .then(result => {
      templateVars.mapName = result.rows[0].mapname;
      templateVars.mapDescription = result.rows[0].description;
      templateVars.imageUrl = result.rows[0].image_url;
      console.log("templateVars", result.rows);
      res.render('selected_map', templateVars);
    })
    .catch(err =>{
      console.log('query failed\n', err);
    });

});

app.get('/getMapId', (req, res) => {
  console.log(mapId, 'map id is ******\n');
  res.json(mapId);
});

app.get('/initmap2/:id', (req, res)=> {  // queries the databse for map information based on it's map id
  const map_id = req.params.id;
  console.log("map id sent through fetch ", map_id);
  db.query(`SELECT maps.latitude, maps.longitude, markers.latitude as marker_lat, markers.longitude as marker_long, markers.markername as title, markers.description as description
  FROM maps
  LEFT JOIN markers ON map_id = maps.id
  WHERE maps.id = $1`, [map_id]
  )
    .then(result => {
      console.log("query result", result.rows);
      res.json(result.rows);
    })
    .catch(err => {
      console.log('query failed', err);
    });
});

app.get('/:id/:map_id/addMarker', (req,res) => {
  const positionOfMarker = req.params.id;
  let markername = 'New Marker';
  let removeParantheses = positionOfMarker.slice(1,-1);  //removes parantheses since the location gets passed in as a string with parantheses surrounding the lat and long
  let latitude = removeParantheses.substring(0, removeParantheses.indexOf(',')); //grabs the latitude from the string
  let longitude = removeParantheses.substring(removeParantheses.indexOf(',') + 2); //grabs the longitude from the string without the whitespace after the comma
  const map_id = req.params.map_id;
  db.query(`INSERT INTO markers (map_id, markername, latitude, longitude)
            VALUES ($1, $2, $3, $4)`, [map_id, markername, latitude, longitude])
    .then(result => {
      console.log(`added marker to map with id of ${map_id} at latitude: ${latitude} and longitude: ${longitude}`);
      res.json(result.rows);
    });
});

app.get('/:id/deleteMarker', (req,res) => {
  const marker_id = req.params.id;
  console.log("map id sent through fetch", marker_id);
  db.query(`DELETE FROM markers WHERE markers.id = $1`, [marker_id])
    .then(result => {
      console.log(`removed marker ${marker_id} from database`);
      res.json(result.rows);
    });
});

app.get('/:id/:title/:description/editMarker', (req,res) => {
  const marker_id = req.params.id;
  const marker_title = req.params.title;
  const marker_description = req.params.description;
  db.query(`UPDATE markers SET markername = $1, description = $2 WHERE id = $3 `, [marker_title, marker_description, marker_id])
    .then(result => {
      console.log(`edited marker ${marker_id}`);
      res.json(result.rows);
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
