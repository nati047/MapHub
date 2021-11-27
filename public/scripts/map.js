// Initialize and add the map
// eslint-disable-next-line func-style
function initMap() {

  // The location of Uluru
  const uluru = { lat: -25.344, lng: 131.036 };

  //variable to hold the options that we pass in to the .map function
  let options = {
    zoom: 8,
    center: uluru
  };
  //new map
  const map = new google.maps.Map(document.getElementById("map"), options);

  // Add marker, positioned at Uluru - takes in an object with a position (lat -long) and what map we want it on
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });

  let infoWindow = new google.maps.InfoWindow({
    content: '<h1>ULURU</h1>'
  });
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });
}



//so initMap() is a function where we set a variable called map
//and set it to a new google map object
//to get the map we just do new google.maps.Map

//and the .Map function takes two parameters, the map element and then our options
//which can be zoom, center, lat and long of where we want it to render
//
