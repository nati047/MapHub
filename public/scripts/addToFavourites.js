/* eslint-disable func-style */
/* eslint-disable no-undef */

//function that gets called on favourite button click on the homepage - it has one parameter
// The parameter is then set to the text value of the class map_name on the index page
// it then fetches the endpoint in server.js passing in the map name as req.params.id since
//the end point is defined as /:id/addToFavourites
//the end point then does all of the querying - inserting the map into favourites table with the map id
function addToFavourites(element) {
  element = document.querySelector(".map_name").textContent;
  fetch(`http://localhost:8080/${element}/addToFavourites`)
    .then(response => response.json())
    .then(data => {
      console.log('data', data);
      alert(`Added ${element} to your favourites!`);
    });
}
