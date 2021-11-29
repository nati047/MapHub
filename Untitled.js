/* eslint-disable no-undef */
/* eslint-disable func-style */
// Initialize and add the map
// eslint-disable-next-line func-style
const { Pool } = require('pg');
const { query } = require('express');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'midterm'
});


function initMap() {

  //CREATES MAP OBJECT ON PAGE LOAD
  const map = new google.maps.Map(document.getElementById("map"));
  //GETS USER LOCATION AND RENDERS MAP TO THAT LOCATION
  navigator.geolocation.getCurrentPosition(function (position) {
    // Center on user's current location if geolocation prompt allowed
    let initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map.setCenter(initialLocation);
    map.setZoom(8);
  }, function (positionError) {
    // User denied geolocation prompt - default to overview of world
    map.setCenter(new google.maps.LatLng(0, 0));
    map.setZoom(2);
  });

  for (let i = 0; i < locations.length; i++) {


    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][1], locations[i][2]),
      map: map
    });

    google.maps.event.addListener(marker, 'click', (function (marker, i) {
      return function () {
        infowindow.setContent(`${locations[i][0]}: `);
        infowindow.open(map, marker);
      }
    })(marker, i));
  }

  //ON CLICK CALLS PLACEMARKER WITH CLICK LOCATION ON MAP
  map.addListener('click', function (e) {
    placeMarker(e.latLng, map);
  });

  //PLACE MARKER FUNCTION
  function placeMarker(position, map) {
    let marker = new google.maps.Marker({
      position: position,
      map: map
    });
    marker.setMap(map);
    map.panTo(position);
    //when a marker is placed adds a listener for a doubleclick which will then bring up the button's infowindow with an add content button inside
    marker.addListener('dblclick', function () {
      let infoWindow = new google.maps.InfoWindow({
        content: `<button>Add Content</button> `
      });
      infoWindow.open(map, marker);
      console.log(infoWindow.content);
    });
  }

  function fetchMarkers(mapID) {
    let queryString = `SELECT * FROM points_of_interest JOIN maps ON points_of_interest.map_id = maps.id WHERE points_of_interest.map_id = $1;`;
    return pool
      .query(queryString, [mapID])
      .then((result) => {
        if (result.rows) {
          return result.rows;
        } else {
          return null;
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
}

//pull res.rows, set each row (loop through res.rows) to an object in a markers array with properties name, description, latitude, longitude

//so initMap() is a function where we set a variable called map
//and set it to a new google map object
//to get the map we just do new google.maps.Map

//and the .Map function takes two parameters, the map element and then our options
//which can be zoom, center, lat and long of where we want it to render
//
