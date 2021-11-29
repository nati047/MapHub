

function initMap() {
  fetch('http://localhost:8080/initmap')
    .then(response => response.json())
    .then(data => {
      const map = new google.maps.Map(document.getElementById("map"));
      //GETS USER LOCATION AND RENDERS MAP TO THAT LOCATION
      navigator.geolocation.getCurrentPosition(function(position) {
        // Center on user's current location if geolocation prompt allowed
        let initialLocation = new google.maps.LatLng(data.latitude, data.longitude);
        map.setCenter(initialLocation);
        map.setZoom(10);
      });
    }
      //CREATES MAP OBJECT ON PAGE LOAD

    );
}



