/* eslint-disable func-style */
/* eslint-disable no-undef */

//function that gets called on favourite button click on the homepage - it has one parameter
// The parameter is then set to the text value of the class map_name on the index page
// it then fetches the endpoint in server.js passing in the map name as req.params.id since
//the end point is defined as /:id/addToFavourites
//the end point then does all of the querying - inserting the map into favourites table with the map id

$(document).ready(function() {
  function addToFavourites(element) {
    fetch(`http://localhost:8080/${element}/addToFavourites`)
      .then(response => response.json())
      .then(data => {
        console.log('data', data);
        alert(`Added ${data[0].mapname} to your favourites!`);
      });
  }
  //same as addToFavourites but removes it
  function removeFromFavourites(element) {
    fetch(`http://localhost:8080/${element}/removeFromFavourites`)
      .then(response => response.json())
      .then(data => {
        console.log('data', data);
        alert(`Removed ${data[0].mapname} from your favourites!`);
      });

  }
  //Loops through all the buttons on the page and adds a click event listener to each
  //if the button has a the class of selected - meaning it is coloured red, then that means it is in the user's favourites
  //and will call removeFromFavourites
  //If it doesn't then it calls addToFavourites
  let buttons = document.getElementsByTagName("button");
  for (button of buttons) {
    button.onclick = function(e) {
      if ($(this).find('.fas').hasClass('selected')) {
        removeFromFavourites(this.id);
        $(this).find('.fas').removeClass('selected');
      } else {
        addToFavourites(this.id);
        $(this).find('.fas').addClass('selected');
      }
    };
  }
});
