export function getRealCountries(data) {
    return data.filter(country => country.unMember || country.ccn3 === "275" || country.ccn3 === "624")
}

export function getByRegion(data, region) {
    if (region && region != "world") {
        return data.filter(country => (country.region).toLowerCase() === region)
    }
    else {
        return data
    }
}

export function getCountryByName(data, name) {
    return data.filter(country => (country.name.common).toLowerCase().includes((name).toLowerCase()))
}

export function getByCcn3(data, code) {
    return data.find(country => country.ccn3 === code)
}

export function rumble(data) {
    return data.sort(() => Math.random() - 0.5)
}

export function getDuration(duration) {
    switch (duration) {
        case "small":
            return 3
        case "medium":
            return 2
        default:
            return 1
    }
}

export function getRandomOptions(data, coption) {
    let options = []
    options.push(coption)
    let randomCountries = rumble(data)
    while (options.length < 4) {
        let random = randomCountries[Math.floor(Math.random() * randomCountries.length)]
        if (!options.includes(random)) {
            options.push(random)
        }
    }
    return options.sort(() => Math.random() - 0.5);
}