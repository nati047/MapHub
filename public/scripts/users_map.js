/* eslint-disable no-undef */
/* eslint-disable func-style */
const { Pool } = require("pg");

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

//let gmarkers = [];

function initMap() {
  fetch('http://localhost:8080/initmap')
    .then(response => response.json())
    .then(data => {
      const map = new google.maps.Map(document.getElementById("map"));
      navigator.geolocation.getCurrentPosition(function(position) {
        let initialLocation = new google.maps.LatLng(data[0].latitude, data[0].longitude);
        map.setCenter(initialLocation);
        map.setZoom(10);

        data.forEach((element) => {
          let marker = new google.maps.Marker({
            position: new google.maps.LatLng(element.marker_lat, element.marker_long),
            map: map,
            id: element.id
          });
          marker.addListener('dblclick', function() {
            let infoWindow = new google.maps.InfoWindow({
              content: `
              <div class='marker_window'>
              <div>${element.id}</div>
              <div><strong>${element.title}</strong></div>
              <div>${element.content}<div>
              <button id="deleteButton" data-id="' + marker.id + '">Delete</button>
              </div>
              <form>
              <label for="title">Title:</label><br>
              <input type="text" id="title" name="title" placeholder="Input changes"><br>
              <label for="description">Description:</label><br>
              <input type="text" id="description" name="description" placeholder="Input Changes"><br><br>
              <input type="submit" id="submitButton" value="Submit">
              </form>`});
            infoWindow.open(map, marker);
            console.log(infoWindow.content);
          });
          //gmarkers.push(marker);
        });

        // google.maps.event.addListener(map, 'click', function(event) {
        //   addMarker(event.LatLng)
        // })

        // google.maps.event.addListener(infoWindow, 'domready', function() {
        //    $("#deleteButton").click(function() {
        //      deleteMarker($(this).data('id'));
        //    });
        //
        // });

        // google.maps.event.addListener(infoWindow, 'domready', function() {
        //   $("#submitButton").click(function() {
        //      editMarker($(this).data('id'));
        //    });
        //
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
//     let infoWindow =               content: `
//      <div class='marker_window'>
//      <div>${element.id}</div>
//      <div><strong>${element.title}</strong></div>
//      <div>${element.content}<div>
//      <button id="deleteButton" data-id="' + marker.id + '">Delete</button>
//      </div>
//      <form>
//      <label for="title">Title:</label><br>
//      <input type="text" id="title" name="title" placeholder="Input changes"><br>
//      <label for="description">Description:</label><br>
//      <input type="text" id="description" name="description" placeholder="Input Changes"><br><br>
//      <input type="submit" id="submitButton" value="Submit">
//      </form>`});
//   infoWindow.open(map, marker);
//   console.log(infoWindow.content);
// });
//     infoWindow.open(map, marker);
//     console.log(infoWindow.content);
//   });

//   const queryString = `INSERT INTO markers (latitude, longitude) VALUES ($1, $2) RETURNING *;`;
//   const values = [location.latitude, location.longitude];
//   return pool
//     .query(queryString, values)
//     .then((result) => {
//       marker.id = result.rows[0].id;
//       return result.rows[0];
//     })
//     .catch((err) => {
//       console.log(err.message);
//     })
// }

// function deleteMarker(id) {
//   for (let marker of gmarkers) {
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

// function editMarker(id) {
//   for (let marker of gmarkers) {
//     if (id === marker.id) {
//       let title = document.getElementById('title').value;
//       let description = document.getElementById('description').value;
//       marker.content = `${title}\n${description} \n<button id="deleteButton" data-id="' + marker.id + '">Delete</button>
//       <form action="/">
//         <label for="title">Title:</label><br>
//         <input type="text" id="title" name="title" value="Input changes"><br>
//         <label for="description">Description:</label><br>
//         <input type="text" id="description" name="description" value="Input changes"><br><br>
//         <input type="submit" id="submitButton" value="Submit">
//       </form>`;

//       const queryString = `UPDATE markers SET title = $1, description = $2 WHERE id = $3;`;
//       const values = [title, description, id];
//       return pool
//         .query(queryString, values)
//         .then((result) => {
//           return;
//         })
//         .catch((err) => {
//           console.log(err.message);
//         })
//     }
//   }
// }
