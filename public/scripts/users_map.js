/* eslint-disable camelcase */
/* eslint-disable no-undef */
/* eslint-disable func-style */
// const { Pool } = require("pg");

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

let gmarkers = [];

function initMap() {
  fetch('http://localhost:8080/initmap')
    .then(response => response.json())
    .then(data => {
      const map = new google.maps.Map(document.getElementById("map"));
      navigator.geolocation.getCurrentPosition(function(position) {
        let initialLocation = new google.maps.LatLng(data[0].latitude, data[0].longitude);
        map.setCenter(initialLocation);
        map.setZoom(10);
        console.log(map.map_id);
        data.forEach((element) => {
          let counter = 0;
          let marker = new google.maps.Marker({
            position: new google.maps.LatLng(element.marker_lat, element.marker_long),
            map: map,
            id: element.id
          });
          marker.addListener('dblclick', function() {
            let infoWindow = new google.maps.InfoWindow({
              id: marker.id,
              content: `
              <div class='marker_window'>
              <div>${marker.id}</div>
              <div><strong>${element.title}</strong></div>
              <div>${element.content}<div>
              <button id="deleteButton" data-id="' + marker.id + '">Delete Marker</button>
              <button id="editButton" data-id="' + marker.id + '">EDIT</button>

              </div>
              <form>
              <label for="title">Title:</label><br>
              <input type="text" id="title" name="title" placeholder="Input changes"><br>
              <label for="description">Description:</label><br>
              <input type="text" id="description" name="description" placeholder="Input Changes"><br><br>
              </form>`});
            infoWindow.open(map, marker);
            google.maps.event.addListener(infoWindow, 'domready', function() {
              const someButton = document.getElementById('deleteButton');
              someButton.addEventListener('click', function() {
                deleteMarker(infoWindow.id);
              });
            });
            google.maps.event.addListener(infoWindow, 'domready', function() {
              const someButton = document.getElementById('editButton');
              someButton.addEventListener('click', function() {
                editMarker(infoWindow);
              });
            });

          });
          gmarkers.push(marker);
        });
        map.addListener('click', function(e) {
          addMarker(e.latLng, map);
        });


        // });

        // google.maps.event.addListener(infoWindow, 'domready', function() {
        //   $("#submitButton").click(function() {
        //     editMarker($(this).data('id'));
        //   });

        // });

      });
    });
}


function addMarker(position, map) {
  fetch('http://localhost:8080/initmap')
    .then(response => response.json())
    .then(data => {
      let marker = new google.maps.Marker({
        id: gmarkers.length + 1,
        position: position,
        map: map
      });
      map.panTo(position);
      marker.addListener('dblclick', function() {
        let infoWindow = new google.maps.InfoWindow({
          id: gmarkers.length + 1,
          content: `
      <div class='marker_window'>
      <div>${gmarkers.length + 1}</div>
      <div><strong></strong></div>
      <div></div>
      <button id="deleteButton" data-id="' + marker.id + '">Delete Marker</button>
      <button id="editButton" data-id="' + marker.id + '">EDIT</button>

      </div>
      <form>
      <label for="title">Title:</label><br>
      <input type="text" id="title" name="title" placeholder="Input changes"><br>
      <label for="description">Description:</label><br>
      <input type="text" id="description" name="description" placeholder="Input Changes"><br><br>
      </form>`,
        });
        infoWindow.open(map, marker);
        gmarkers.push(marker);
        console.log('gmarkers', gmarkers);
        google.maps.event.addListener(infoWindow, 'domready', function() {
          const someButton = document.getElementById('deleteButton');
          someButton.addEventListener('click', function() {
            deleteMarker(infoWindow.id);
          });
        });
        google.maps.event.addListener(infoWindow, 'domready', function() {
          const someButton = document.getElementById('editButton');
          someButton.addEventListener('click', function() {
            editMarker(infoWindow);
          });
        });
      });
      fetch(`http://localhost:8080/${marker.position}/${data[0].map_id}/addMarker`)
        .then(response => response.json())
        .then(data => {
          console.log('data', data);
        });
    });
}
function deleteMarker(id) {
  for (let marker of gmarkers) {
    if (marker.id === id) {
      console.log("found it at", marker.id);
      marker.setMap(null);
      fetch(`http://localhost:8080/${marker.id}/deleteMarker`)
        .then(response => response.json())
        .then(data => {
          console.log('data', data);
        });
    }
  }
}

function editMarker(window) {
  console.log("window id", window.id);
  let title = document.getElementById('title').value;
  let description = document.getElementById('description').value;
  window.setContent(`
  <div class='marker_window'>
  <div>${window.id}</div>
  <div><strong>${title}</strong></div>
  <div>${description}<div>
  <button id="deleteButton" data-id="' + marker.id + '">Delete Marker</button>
  <button id="editButton" data-id="' + marker.id + '">EDIT</button>

  </div>
  <form>
  <label for="title">Title:</label><br>
  <input type="text" id="title" name="title" placeholder="Input changes"><br>
  <label for="description">Description:</label><br>
  <input type="text" id="description" name="description" placeholder="Input Changes"><br><br>
  </form>`);
}
//     // const queryString = `UPDATE markers SET title = $1, description = $2 WHERE id = $3;`;
//     // const values = [title, description, id];
//     // return pool
//     //   .query(queryString, values)
//     //   .then((result) => {
//     //     return;
//     //   })
//     //   .catch((err) => {
//     //     console.log(err.message);
//     //   });
//   }
// }
// }
