/* eslint-disable no-undef */
/* eslint-disable func-style */
function initMap2() {
  fetch('/getMapId') // makes a get request to get map id
    .then(response => response.json())
    .then(data => {
      let mapid = data;

      // sends map id through the url inorder to get map data corresponding to the map id
      fetch(`/initmap2/${mapid}`)
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
                map: map
              });
              console.log("image url",element.image);
              marker.addListener('dblclick', function() {
                if (element.image === null) {
                  let infoWindow = new google.maps.InfoWindow({
                    content: `<h1>${element.title}</h1>  <h6>${element.description}</h6>`
                  });
                  infoWindow.open(map, marker);
                } else {
                  let infoWindow = new google.maps.InfoWindow({
                    content: `<h1>${element.title}</h1>  <h6>${element.description}</h6> <img src="${element.image}" width="110" height="110">`
                  });
                  infoWindow.open(map, marker);
                }
              });

            });

          });
        });

    });
}


