/* eslint-disable prettier/prettier */

// function queries the Food Standards Agency Api
// The async and await keywords enable asynchronous,
// promise-based behavior
export default async function getEstablishmentsByLocation(searchParams) {
  // if the name of an establishment is not given set the query param to an empty string
  const nameSting = searchParams.name === undefined
  ? '' : searchParams.name.toLowerCase().split(' ').join('+');
  // uriEncoded request to the api based on name(optional) and postcode parameters
  const res = await fetch(
    `http://api.ratings.food.gov.uk/establishments?name=${nameSting}&address=${searchParams.postCode.toLowerCase().split(' ').join('+')}`,
    {
      headers: { 'x-api-version': '2' },
    }
  );
  // await the responce from the API then convert it to json
  const data = await res.json();
  const {establishments} = data;
  return establishments;
}
