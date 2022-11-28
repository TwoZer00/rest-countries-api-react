import React, { useContext, useEffect, useState } from 'react';
import { useTransition,animated,config } from 'react-spring';
import { DataContext } from './App';
import { Timer } from './components/Timer';
import FlagTransition from './FlagTransition';
import { getRandomInt, intervalFunc, unMemberFilter } from './utils';

const Test = () => {
    let data = unMemberFilter(useContext(DataContext));
    const [toggle, setToggle] = useState(true);
    const [flag, setFlag] = useState(data[getRandomInt(data.length)])
    const [flag1, setFlag1] = useState(data[getRandomInt(data.length)])
    const [flags,setFlags] = useState([data[getRandomInt(data.length)],data[getRandomInt(data.length)]]) 
    const handleClick = () => {
        setFlag(flag1);
        setToggle(!toggle)
        setFlag1(data[getRandomInt(data.length)]);
    }
    return <>
        <div className='flex flex-col h-[300px] w-[200px]'>
            <FlagTransition flag={flag}/>
            <button onClick={handleClick}>Click me</button>
        </div>
    </>
}

export default Test;

