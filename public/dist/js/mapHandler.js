/* eslint-disable no-undef */

// findBusinesses function
async function findBusinesses(map) {
  //fetch request based on lat and lng
  const res = await fetch('/api/business/all')
  if (!res.ok) {
    const errorMessage = res.text();
    throw new Error(errorMessage);
  }

  const businesses = await res.json();
  if (businesses.length === 0) {
    console.log('Sorry. No businesses found.')
    return;
  }

  function businessPreview(business) {
    // grab modal
    console.log(business);
    // const html = ``;
    // const businessInfo = document.createRange().createContextualFragment(html);
    // append businessInfo to modal
    //fetch the donations associated with the business id
  }

  // if response containes businesses, map them
  const markers = businesses.map(business => {
    // create a coordinates array for each business
    const [businessLat, businessLng] = business.location.coordinates;
    const position = { lat: businessLat, lng: businessLng };
    // add marker to map
    const marker = new google.maps.Marker({ map, position });
    //assign the business to marker.place
    marker.business = business;
    return marker;
  });

  // when someone clicks on a marker, get the details of that place
  markers.forEach(marker => marker.addListener('click', function() {
    businessPreview(this.business);
  }));
  //call business preview, which renders a model view of the business
};



// google maps intialisation
function makeMap(mapContainer) {
  if (!mapContainer) return;

  const map = new google.maps.Map(mapContainer, {
    center: {
      lat: parseFloat(mapContainer.dataset.lat),
      lng: parseFloat(mapContainer.dataset.lng),
    },
    zoom: 14,
    mapTypeControl: false,
    streetViewControl: false,
  });
  // create fridge marker
  findBusinesses(map);
}

makeMap(document.querySelector('#donations-map'));
