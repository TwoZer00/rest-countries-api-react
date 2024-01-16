import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate()
    return (
        <>
            <div className="h-screen w-screen flex items-center justify-center">
                <div className="rounded shadow h-fit p-4 flex flex-col gap-2">
                    <div className="flex flex-row flex-wrap gap-2 justify-center">
                        Region
                        <select name="region">
                            <option value="0">world</option>
                            <option value="1">americas</option>
                            <option value="2">europe</option>
                            <option value="3">africa</option>
                            <option value="4">asia-oceania</option>
                        </select>
                        Duration
                        <select name="duration">
                            <option value="3">complete</option>
                            <option value="1">small</option>
                            <option value="2">medium</option>
                        </select>
                    </div>
                    <div className="h-full flex flex-col">
                        <button type="button" className="text-xl px-2 w-full h-full border border-b-0 rounded-t-lg font-semibold" onClick={() => { navigate('/guesstheflag') }} >Guess the flag</button>
                        <button type="button" className="text-xl px-2 w-full h-full border font-semibold">Worldle</button>
                        <button type="button" className="text-xl px-2 w-full h-full border border-t-0 rounded-b-lg font-semibold">Capital city</button>
                    </div>
                </div>
            </div>
        </>
    )
}
