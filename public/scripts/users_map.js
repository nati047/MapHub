/* eslint-disable no-undef */
/* eslint-disable func-style */

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
        let initialLocation = new google.maps.LatLng(data.latitude, data.longitude);
        map.setCenter(initialLocation);
        map.setZoom(10);
        fetch('http://localhost:8080/initmarkers')
          .then(response => response.json())
          .then(data => {
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

            });

          });
      });
    });

}

    let infowindow = new google.maps.InfoWindow();
    let marker, i;

    for (i = 0; i < response.rows.length; i++) {  // Loop through pool.query response, should be rows containing columns from markers/POIs table
      marker = new google.maps.Marker({ //Create a new marker object each time
        position: new google.maps.LatLng(response.rows[i].latitude, response.rows[i].longitude), //Create at the current markers lat and lng
        map: map
      });
      google.maps.event.addListener(marker, 'click', (function(marker, i) { //On click, marker brings up an info window
        return function() {
          infowindow.setContent(response.rows[i].title); //Content of the info window should contain the name of the marker at the current row
          infowindow.open(map, marker);
        }
      })(marker, i));
    }


