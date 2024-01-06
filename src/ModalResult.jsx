import React from 'react'
import { Link } from 'react-router-dom'

export default function ModalResult({ result, points, reset }) {
    return (
        <div className='w-full h-full bg-white/10 backdrop-blur absolute top-0 left-0 z-50 flex flex-col justify-center items-center' >
            <div className='border rounded-lg w-11/12 sm:w-1/2 h-[400px] bg-white shadow-lg'>
                <div className='flex flex-col justify-center items-center text-black h-full p-4'>
                    <h1 className='text-4xl font-bold text-center'>{result ? "Good game!" : "Congratulations!"}</h1>
                    {result ?
                        <p className='text-md text-center'>You lost the game!</p>
                        :
                        <p className='text-md text-center'>You have completed the quiz!</p>
                    }
                    <p>Your points {points}</p>
                    <div className='flex flex-row gap-3'>
                        <Link to={"/games"} className='border rounded px-2 bg-white hover:invert transition'>Menu</Link>
                        <button onClick={reset} className='border rounded px-2 bg-white hover:invert transition'>Reset</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
