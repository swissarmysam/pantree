/* eslint-disable no-undef */
// google maps intialisation
function makeMap(mapContainer) {
  if (!mapContainer) return;

  const map = new google.maps.Map(mapContainer, {
    center: {
      lat: parseFloat(mapContainer.dataset.lat),
      lng: parseFloat(mapContainer.dataset.lng),
    },
    zoom: 10,
  });
  // get donations function
}

makeMap(document.querySelector('#donations-map'));
