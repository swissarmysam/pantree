// search params obj {address - full/partial and maxDistanceLimit - in miles}
export default async function getEstablishmentsByLocation(searchParams) {
  const nameSting = searchParams.name === undefined
  ? '' : searchParams.name.toLowerCase().split(' ').join('+');
  console.log('name', nameSting);
  const addressString = `${searchParams.street = searchParams.street === undefined ? '' : `${searchParams.street} `}${searchParams.postCode}`;
  console.log('post Code', addressString);
  const res = await fetch(
    `http://api.ratings.food.gov.uk/establishments?name=${nameSting}&address=${addressString.toLowerCase().split(' ').join('+')}`,
    {
      headers: { 'x-api-version': '2' },
    }
  );
  const data = await res.json();
  const establishments = data.establishments;
  return establishments;
}
