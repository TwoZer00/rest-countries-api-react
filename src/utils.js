const apiURL = "https://restcountries.com/v3.1";

export async function getAll() {
  let data = await (await fetch(`${apiURL}/all`)).json();
  //   console.table(data);
  return data;
}
