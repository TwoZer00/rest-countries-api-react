const apiURL = "https://restcountries.com/v3.1";

export async function getAll() {
    let data = localStorage.getItem("countries");
    if (data) {
        return JSON.parse(data);
    }
    data = await (await fetch(`${apiURL}/all`)
        .catch(error => {
            throw `${error.message}`
        }
        )).json();
    localStorage.setItem("countries", JSON.stringify(data));
    return data;
}