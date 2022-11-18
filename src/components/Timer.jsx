
import React, { useEffect, useState } from 'react';

export const Timer = ({max,reducer,func,timer}) => {
    const [timeL,setTimeL] = useState(10);
    let temp = 10;
    let interval;
    useEffect(()=>{
        interval = setInterval(()=>{
            console.log(temp)
            setTimeL(temp)
            if(temp<=0){
                clearInterval(interval)
                func();
                reset();
                // setTimeL(10)
                // temp=10;
            }
            else{
                temp-=reducer;
            }
        },max);
    },[])

    const reset = ()=>{
        temp = 10;
        setTimeL(10);
        // interval();
    }
    return (
        <div className='font-bold'>
            {timeL}
        </div>
    );
}
