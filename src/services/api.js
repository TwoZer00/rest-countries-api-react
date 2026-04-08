const apiURL = "https://restcountries.com/v3.1";

export async function getOverview() {
  const res = await fetch(`${apiURL}/all?fields=name,flags,capital,population,region,ccn3,cca3,unMember`);
  if (!res.ok) throw new Error(`Failed to fetch overview: ${res.status}`);
  return res.json();
}

export async function getCountryDetails(id) {
  const res = await fetch(`${apiURL}/alpha/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch country ${id}: ${res.status}`);
  const data = await res.json();
  return data[0];
}
