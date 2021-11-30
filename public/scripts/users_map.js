/* eslint-disable no-undef */
/* eslint-disable func-style */

const { Pool } = require('pg');

const pool = new Pool({
  user: 'tobias',
  password: 'password',
  host: 'localhost',
  database: 'midterm'
});

// This function makes a fetch request to our route that makes a query
// to the database which returns the selected maps coordinates and passes taht in to create the map
// then it makes a fetch requets to initmarkers which returns all the markers associated with that map
// and for each item in the returned array of objects we place the marker with the
// unique coordinates and the title of each marker inside of the marker's info window

function initMap() {
  fetch('http://localhost:8080/initmap')
    .then(response => response.json())
    .then(data => {
      const map = new google.maps.Map(document.getElementById("map"));
      navigator.geolocation.getCurrentPosition(function(position) {
        let initialLocation = new google.maps.LatLng(data[0].latitude, data[0].longitude);
        map.setCenter(initialLocation);
        map.setZoom(10);
        //let gmarkers = [];
        data.forEach((element) => {
          let marker = new google.maps.Marker({
            position: new google.maps.LatLng(element.marker_lat, element.marker_long),
            map:map
          });
          marker.addListener('dblclick', function() {
            let infoWindow = new google.maps.InfoWindow({
              content: element.title
            });
            infoWindow.open(map, marker);
            console.log(infoWindow.content);
          });
          //gmarkers.push(marker);

        });

        // function deleteMarker(id, markers) {
        //   for (let marker of markers) {
        //     if (id === marker.id) {
        //       marker.setMap(null);
        //       const queryString = `DELETE FROM markers WHERE markers.id = $1;`;
        //       const values = [id];
        //       return pool
        //         .query(queryString, values)
        //         .then(res => {
        //           return;
        //         })
        //         .catch(err => {
        //           console.log(err.message);
        //         });
        //     }
        //   }
        // }
      });
    });
}



