import { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { getByRegion, getDuration, getRandomOptions, getRealCountries, rumble } from "../utils/filters";

export default function GuessTheFlag() {
    const data = useOutletContext();
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState();
    const [options, setOptions] = useState([]);
    let [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        if (searchParams.get("region") === null) {
            setSearchParams({ region: "world", duration: "complete" })
        }
        let temp = [];
        temp = getByRegion(getRealCountries(data), searchParams.get("region"));
        temp.length = Math.round(temp.length / getDuration(searchParams.get("duration")))
        temp = rumble(temp);
        setCountries(temp);
        setCountry(temp[0]);
        setOptions([...getRandomOptions(temp, temp[0])]);
    }, []);
    const handleClick = (e) => {
        let temp = [...countries];
        if (e === country.ccn3) {
            alert("Correct!");
        }
        else {
            alert("wrong!");
        }
        if (countries.length > 1) {
            temp = temp.filter(element => element.ccn3 !== country.ccn3)
            setCountries(temp);
            setOptions([...getRandomOptions(data, temp[0])]);
            setCountry(temp[0]);
            console.log(temp);
            console.log(country);
            console.log(options);
        }
    }
    return (
        <>
            <h1>Guess the Flag</h1>
            <p>This is a game where you guess the flag of a country.</p>
            <p>The flags are from the <a href="XXXXXXXXXXXXXXXXXXXX" target="_blank" rel="noreferrer">FlagCdn</a> website.</p>
            <p>The countries are from the <a href="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" target="_blank" rel="noreferrer">WorldAtlas</a> website.</p>
            <p>The game is simple. You have to guess the flag of a country.</p>
            <div className="flex flex-col">
                <div className="flex flex-col items-center pointer-events-none bg-slate-50 p-1">
                    <img src={country?.flags.svg} alt={country?.ccn3} className="h-[300px] w-[500px] object-contain" />
                </div>
                <div className="grid grid-cols-2 gap-2 m-2">
                    {
                        options.map((option, index) => {
                            return (
                                <button type="button" className="border p-1 hover:bg-slate-50 rounded hover:shadow" key={option.ccn3} onClick={() => { handleClick(option.ccn3) }}>
                                    {/* <img src={option.flags.svg} alt={option.name.common} className="h-20 w-20" /> */}
                                    <p className="break-words font-semibold">{option.name.common}</p>
                                </button>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}
