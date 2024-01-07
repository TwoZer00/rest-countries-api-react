const apiURL = "https://restcountries.com/v3.1";

export async function getAll() {
  let data = await (await fetch(`${apiURL}/all`)).json();
  return data;
}
export function randomCountryPosition(size) {
  return Math.floor(Math.random() * size);
}

export function intervalFunc(setTime, skip) {
  setTime(value => {
    if (value <= 0) {
      clearInterval(this)
      skip();
      return 0;
    }
    else {
      return value - 1;
    }

  });
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function unMemberFilter(array) {
  return array.filter(value => value.unMember || value.ccn3 === "275" || value.ccn3 === '336')
}