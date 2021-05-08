/**
 * Account Controller code
 * Methods for registration and setup details
 * Any data saved from here will be in Account model
 */

/** search params obj {address - full/partial and maxDistanceLimit - in miles} */
export default async function getEstablishmentsByLocation(searchParams) {
  const addressString = `${searchParams.street} ${searchParams.postCode}`;
  const res = await fetch(
    `http://api.ratings.food.gov.uk/establishments?name=${searchParams.name
      .toLowerCase()
      .split(' ')
      .join('+')}&address=${addressString
      .toLowerCase()
      .split(' ')
      .join('+')}`,
    {
      headers: { 'x-api-version': '2' },
    }
  );
  const data = await res.json();
  const establishment = data.establishments[0];
  return establishment;
}
