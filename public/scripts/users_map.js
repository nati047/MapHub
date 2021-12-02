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
        data.forEach((element) => {
          let marker = new google.maps.Marker({
            position: new google.maps.LatLng(element.marker_lat, element.marker_long),
            map: map,
            id: element.id
          });
          gmarkers.push(marker);
          marker.addListener('dblclick', function() {
            let infoWindow = new google.maps.InfoWindow({
              id: marker.id,
              content: `
              <div class='marker_window'>
              <div><strong>${element.title}</strong></div>
              <div>${element.content}<div>
              <div><p></p></div>
              <button id="deleteButton" data-id="' + marker.id + '">Delete Marker</button>
              </div>
              <form>
              <div>
              <p></p>
              </div>
              <label for="title">Title:</label><br>
              <input type="text" id="title" name="title" placeholder="Input changes"><br>
              <label for="description">Description:</label><br>
              <input type="text" id="description" name="description" placeholder="Input Changes"><br><br>
              </form>
              <button id="editButton" data-id="' + marker.id + '">EDIT</button>
              `});
            infoWindow.open(map, marker);
            google.maps.event.addListener(infoWindow, 'domready', function() {
              const someButton = document.getElementById('deleteButton');
              someButton.addEventListener('click', function() {
                deleteMarker(marker.id);
              });
            });
            google.maps.event.addListener(infoWindow, 'domready', function() {
              const someButton = document.getElementById('editButton');
              someButton.addEventListener('click', function() {
                editMarker(infoWindow);
              });
            });

          });
        });
        map.addListener('click', function(e) {
          addMarker(e.latLng, map);
        });
      });
    });
}


function addMarker(position, map) {
  fetch('http://localhost:8080/initmap')
    .then(response => response.json())
    .then(data => {
      let finalMarkerInTable = data.slice(-1)[0];
      let finalMarkerId = finalMarkerInTable.id;
      let newMarkerId = finalMarkerId + 1;
      let marker = new google.maps.Marker({
        id: newMarkerId,
        position: position,
        map: map
      });
      gmarkers.push(marker);
      map.panTo(position);
      marker.addListener('dblclick', function() {
        let infoWindow = new google.maps.InfoWindow({
          id: newMarkerId,
          content: `
      <div class='marker_window'>
      <div><strong>New Marker</strong></div>
      <div></div>
      <div><p></p></div>
      <button id="deleteButton" data-id="' + marker.id + '">Delete Marker</button>
      </div>
      <form>
      <div><p></p></div>
      <label for="title">Title:</label><br>
      <input type="text" id="title" name="title" placeholder="Input changes"><br>
      <label for="description">Description:</label><br>
      <input type="text" id="description" name="description" placeholder="Input Changes"><br><br>
      </form>
      <button id="editButton" data-id="' + marker.id + '">EDIT</button>
      `,
        });
        infoWindow.open(map, marker);
        google.maps.event.addListener(infoWindow, 'domready', function() {
          const someButton = document.getElementById('deleteButton');
          someButton.addEventListener('click', function() {
            deleteMarker(newMarkerId);
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
      marker.setMap(null);
      fetch(`http://localhost:8080/${marker.id}/deleteMarker`)
        .then(response => response.json())
        .then(data => {
          console.log('data', data);
        });
      gmarkers.splice(gmarkers.indexOf(marker), 1);
    }
  }
}

function editMarker(window) {
  let marker_id = window.id;
  let title = document.getElementById('title').value;
  let description = document.getElementById('description').value;
  window.setContent(`
  <div class='marker_window'>
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
  fetch(`http://localhost:8080/${marker_id}/${title}/${description}/editMarker`)
    .then(response => response.json())
    .then(data => {
      console.log('data', data);
    });
}
