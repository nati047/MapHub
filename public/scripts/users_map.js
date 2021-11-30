/* eslint-disable no-undef */
/* eslint-disable func-style */

const { Pool } = require('pg');

// const pool = new Pool({
//   user: 'tobias',
//   password: 'password',
//   host: 'localhost',
//   database: 'midterm'
// });

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
            //should add the id of the marker from the database as a property for referencing, such as the delete button in the next comment
          });
          marker.addListener('dblclick', function() {
            let infoWindow = new google.maps.InfoWindow({
              content: element.title // + '\n<button id="deleteButton" data-id="' + marker.id + '">Delete</button>'     //maybe change this to `${element.title}\n${element.description}`
            });
            infoWindow.open(map, marker);
            console.log(infoWindow.content);
          });
          //gmarkers.push(marker);

        });

        // google.maps.event.addListener(map, 'click', function(event) {
        //   addMarker(event.LatLng)
        // })

        // google.maps.event.addListener(infoWindow, 'domready', function() {
        //   deleteMarker($(this).data('id'));
        // });


      });
    });
}

// function addMarker(location) {
//   let marker = new google.maps.Marker({
//       position: location,
//       map: map
//   });
//   marker.addListener('dblclick', function() {
//     let infoWindow = new google.maps.InfoWindow({
//       content: element.title //maybe change this to `${element.title}\n${element.description}`
//     });
//     infoWindow.open(map, marker);
//     console.log(infoWindow.content);
//   });

//   const queryString = `INSERT INTO markers (latitude, longitude) VALUES ($1, $2) RETURNING *;`;
//   const values = [location.latitude, location.longitude];
//   return pool
//     .query(queryString, values)
//     .then((result) => {
//       return result.rows[0];
//     })
//     .catch((err) => {
//       console.log(err.message);
//     })
// }

// function deleteMarker(id) {
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



