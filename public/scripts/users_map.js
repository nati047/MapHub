let obj = {
  lat: 0,
  lng: 0
}

function initMap() {

  //CREATES MAP OBJECT ON PAGE LOAD
  const map = new google.maps.Map(document.getElementById("map"));
  //GETS USER LOCATION AND RENDERS MAP TO THAT LOCATION
  navigator.geolocation.getCurrentPosition(function(position) {
    // Center on user's current location if geolocation prompt allowed
    let initialLocation = new google.maps.LatLng(lat, lng);
    map.setCenter(initialLocation);
    map.setZoom(10);
  });
}

exports.values = obj;

