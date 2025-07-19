const apiURL = "https://restcountries.com/v3.1";

export async function getAll(){
    let data = await (await fetch(`${apiURL}/all`)
                            .catch(error=>{
                            throw `${error.message}`
                })).json();
    return data;
}

export async function getOverview(){
    let data = await (await fetch(`${apiURL}/all?fields=name,flags,capital,population,region,ccn3,cca3,unMember`)
                            .catch(error=>{
                            throw `${error.message}`
                })).json();
    return data;
}
export async function getCountryDetails(id){
    let data = await (await fetch(`${apiURL}/alpha/${id}`)
                            .catch(error=>{
                            throw `${error.message}`
                })).json();
    
                // console.log(data[0]);
                
                return data[0];
    
                // return data;
}