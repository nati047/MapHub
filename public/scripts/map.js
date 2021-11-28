// Initialize and add the map
// eslint-disable-next-line func-style
function initMap() {

  const map = new google.maps.Map(document.getElementById("map"));

  navigator.geolocation.getCurrentPosition(function(position) {
    // Center on user's current location if geolocation prompt allowed
    let initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    map.setCenter(initialLocation);
    map.setZoom(13);
  }, function(positionError) {
    // User denied geolocation prompt - default to Chicago
    map.setCenter(new google.maps.LatLng(39.8097343, -98.5556199));
    map.setZoom(5);
  });



  // Add marker, positioned at Uluru - takes in an object with a position (lat -long) and what map we want it on
  // const marker = new google.maps.Marker({
  //   position: uluru,
  //   map: map,
  // });



  let infoWindow = new google.maps.InfoWindow({
    content: '<h1>ULURU</h1>'
  });



  map.addListener('click', function(e) {
    placeMarker(e.latLng, map);
  });

  function placeMarker(position, map) {
    let marker = new google.maps.Marker({
      position: position,
      map: map
    });
    map.panTo(position);

    marker.addListener('dblclick', function() {
      infoWindow.open(map, marker);
    });
  }

}



//so initMap() is a function where we set a variable called map
//and set it to a new google map object
//to get the map we just do new google.maps.Map

//and the .Map function takes two parameters, the map element and then our options
//which can be zoom, center, lat and long of where we want it to render
//
