import React from 'react';
import { useParams } from 'react-router-dom';

const GameMenu = () => {
    const { gametype } = useParams();
    let gameConfig;


    switch (gametype) {
        case 'gameflag':
            gameConfig = <div className='bg-white/20 backdrop-blur p-2'>
                <h2 className='font-bold text-2xl'>Game config</h2>
                <div className='flex items-center gap-5'>
                    <select name="region" className='p-2 rounded'>
                        <option disabled selected>Choose region</option>
                        <option value="1">America</option>
                        <option value="2">Europe</option>
                        <option value="3">Asia and oceania</option>
                        <option value="4">Africa</option>
                        <option value="0">All</option>
                    </select>
                </div>
            </div>
            break;
    
        default:
            break;
    }
    return (
        <div className='h-full w-full flex flex-col justify-center items-center'>
            {gameConfig}
        </div>
    );
    
}

export default GameMenu;
