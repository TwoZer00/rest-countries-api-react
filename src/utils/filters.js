export function getRealCountries(data) {
    return data.filter(country => country.unMember || country.ccn3 === "275" || country.ccn3 === "624")
}

export function getByRegion(data, region) {
    return data.filter(country => (country.region).toLowerCase() === region)
}

export function getCountryByName(data, name) {
    return data.filter(country => (country.name.common).toLowerCase().includes((name).toLowerCase()))
}

export function getByCcn3(data, code) {
    return data.find(country => country.ccn3 === code)
}