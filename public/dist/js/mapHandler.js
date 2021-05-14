/* eslint-disable no-undef */

// findBusinesses function
function findBusinesses(map) {
  //fetch request based on lat and lng
  fetch('/api/business/all')
  .then(res => {
    let businesses;
    if (!res.ok) {
      const errorMessage = res.text();
      throw new Error(errorMessage);
    } else if (res.ok) {
      businesses = res.json();
      console.log(businesses);
      // if response has something convert it to JSON
      // else notify user that there are no businesses in their area
    }
  })

  // if response containes businesses, map them
  // create a coordinates array for each business
  // add marker to map
  //assign the business to marker.place
  // return marker

  // when someone clicks on a marker, get the details of that place
  //call business preview, which renders a model view of the business
  //fetch the donations associated with the business id
};



// google maps intialisation
function makeMap(mapContainer) {
  if (!mapContainer) return;

  const map = new google.maps.Map(mapContainer, {
    center: {
      lat: parseFloat(mapContainer.dataset.lat),
      lng: parseFloat(mapContainer.dataset.lng),
    },
    zoom: 10,
    mapTypeControl: false,
    streetViewControl: false,
  });
  findBusinesses(map);
}

makeMap(document.querySelector('#donations-map'));
