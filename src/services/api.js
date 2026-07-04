import countries from "../data/countries.json";

export async function getOverview() {
  return countries;
}

export function getCountryByCode(id) {
  return countries.find((c) => c.ccn3 === id) ?? null;
}
