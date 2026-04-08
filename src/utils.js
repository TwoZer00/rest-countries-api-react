export function randomCountryPosition(size) {
  return Math.floor(Math.random() * size);
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function unMemberFilter(array) {
  return array.filter(value => value.unMember || value.ccn3 === "275" || value.ccn3 === '336');
}
