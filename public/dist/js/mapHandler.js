/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
import {
  businessInfoModal,
  getDonationsByBusiness,
} from './businessInfoModal.js';

const modal = document.querySelector('.modal');
// findBusinesses function
async function findBusinesses(map) {
  // fetch request frabs all businesses
  const res = await fetch('/api/business/all');
  if (!res.ok) {
    const errorMessage = res.text();
    throw new Error(errorMessage);
  }

  const businesses = await res.json();
  if (businesses.length === 0) {
    console.log('Sorry. No businesses found.');
    return;
  }

  // if response containes businesses, map them
  const markers = businesses.map((business) => {
    // create a coordinates array for each business
    const [businessLat, businessLng] = business.location.coordinates;
    const position = { lat: businessLat, lng: businessLng };
    // add marker to map
    const marker = new google.maps.Marker({
      map,
      position,
      icon: icons.business,
    });
    // assign the donations to marker
    getDonationsByBusiness(business.account).then((donations) => {
      console.log(donations);
      if (donations.length !== 0) marker.setIcon(icons.businessDonation);
      marker.donations = donations;
    });
    // assign the business to marker.business
    marker.business = business;
    return marker;
  });

  // when someone clicks on a marker, get the details of that place
  markers.forEach((marker) =>
    marker.addListener('click', function () {
      // call business preview, which renders a model view of the business
      businessInfoModal(this.business, this.donations, modal);
    })
  );
}

// handler function that closes modal
function handleModalClose(e) {
  modal.style.display = 'none';
  modal.querySelector('.working-hours').remove();
  modal.querySelectorAll('.donation').forEach((element) => element.remove());
  document.documentElement.classList.remove('is-clipped');
  // remove all children of modal body
}

// map markers
const iconBase =
  'https://developers.google.com/maps/documentation/javascript/examples/full/images/';
const icons = {
  fridge: `${iconBase}parking_lot_maps.png`,
  business: `${iconBase}info-i_maps.png`,
  businessDonation: `${iconBase}library_maps.png`,
};

// google maps intialisation
function makeMap(mapContainer) {
  if (!mapContainer) return;
  const fridgeLocation = {
    lat: parseFloat(mapContainer.dataset.lat),
    lng: parseFloat(mapContainer.dataset.lng),
  };
  const map = new google.maps.Map(mapContainer, {
    center: fridgeLocation,
    zoom: 13,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_TOP,
    },
  });
  // create fridge marker
  const fridgeMarker = new google.maps.Marker({
    map,
    position: fridgeLocation,
    icon: icons.fridge,
  });
  findBusinesses(map);
}

makeMap(document.querySelector('#donations-map'));
document
  .querySelectorAll('.closeBtn')
  .forEach((btn) => btn.addEventListener('click', handleModalClose));
