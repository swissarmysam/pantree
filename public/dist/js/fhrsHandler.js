/* eslint-disable prettier/prettier */

export default async function getEstablishmentsByLocation(searchParams) {
  const nameSting = searchParams.name === undefined
  ? '' : searchParams.name.toLowerCase().split(' ').join('+');
  const res = await fetch(
    `http://api.ratings.food.gov.uk/establishments?name=${nameSting}&address=${searchParams.postCode.toLowerCase().split(' ').join('+')}`,
    {
      headers: { 'x-api-version': '2' },
    }
  );
  const data = await res.json();
  const {establishments} = data;
  return establishments;
}
