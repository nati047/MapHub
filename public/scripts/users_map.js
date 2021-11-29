
   let lat = 0;
   let lng= 0;
  function initMap() {

    fetch('http://localhost:8080/initmap')
    .then(response => response.json())
    .then(data => {
      lat = data.latitude;
      lng = data.longitude;
    });


    //CREATES MAP OBJECT ON PAGE LOAD
    const map = new google.maps.Map(document.getElementById("map"));
    //GETS USER LOCATION AND RENDERS MAP TO THAT LOCATION
    navigator.geolocation.getCurrentPosition(function(position) {
      // Center on user's current location if geolocation prompt allowed
      let initialLocation = new google.maps.LatLng(lat, lng);
      map.setCenter(initialLocation);
      map.setZoom(10);
    });

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

  }
