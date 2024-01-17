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
        console.log(e);
    }
    return (
        <>
            <h1>Guess the Flag</h1>
            <p>This is a game where you guess the flag of a country.</p>
            <p>The flags are from the <a href="XXXXXXXXXXXXXXXXXXXX" target="_blank" rel="noreferrer">FlagCdn</a> website.</p>
            <p>The countries are from the <a href="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" target="_blank" rel="noreferrer">WorldAtlas</a> website.</p>
            <p>The game is simple. You have to guess the flag of a country.</p>
            <div className="flex flex-col">
                <div>
                    <img src={country?.flags.svg} alt={country?.ccn3} />
                </div>
                {
                    options.map((option, index) => {
                        return (
                            <button type="button" className="flex flex-row flex-wrap gap-2 justify-center border" key={option.ccn3} onClick={() => { handleClick(option.ccn3) }}>
                                {/* <img src={option.flags.svg} alt={option.name.common} className="h-20 w-20" /> */}
                                <p>{option.name.common}</p>
                            </button>
                        )
                    })
                }
            </div>
        </>
    )
}
