const axios = require('axios');

const fhrs = axios.create({
  baseURL: 'https://api.ratings.food.gov.uk/',
  headers: { 'x-api-version': '2' }
});

// search params obj {address - full/partial and maxDistanceLimit - in miles}
function getEstablishmentsByLocation(searchParams) {
  return fhrs.get('/Establishments', {
    params: searchParams
  })
  .then( res => {
    return res.data;
  })
  .catch( err => {
    return err;
  });
}

