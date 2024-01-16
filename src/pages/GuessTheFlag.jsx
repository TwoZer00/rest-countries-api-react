import { useEffect } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";

export default function GuessTheFlag() {
    const data = useOutletContext();
    const countries = [];
    let [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        if (searchParams.get("country") === null) {
            setSearchParams({ region: "world", duration: "complete" })
        }
        else {
            countries = [..., 1, 2]
            data.setRegion(searchParams.get("region"))
            data.setDuration(searchParams.get("duration"))
        }
    }, [searchParams])
    return (
        <>
            <h1>Guess the Flag</h1>
            <p>This is a game where you guess the flag of a country.</p>
            <p>The flags are from the <a href="XXXXXXXXXXXXXXXXXXXX" target="_blank" rel="noreferrer">FlagCdn</a> website.</p>
            <p>The countries are from the <a href="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" target="_blank" rel="noreferrer">WorldAtlas</a> website.</p>
            <p>The game is simple. You have to guess the flag of a country.</p>
        </>
    )
}
