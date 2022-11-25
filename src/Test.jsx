import React, { useEffect, useState } from 'react';
import { Timer } from './components/Timer';
import { intervalFunc } from './utils';

const Test = () => {
    const [time, setTime] = useState(10);
    let interval;
    
    // const [time, setTime] = useState(10);
    // // let interval;
    // // time<=0 && clearInterval(interval);
    // // useEffect(() => {
    // //     let tempTime;
    // //     interval = setInterval(() => {
    // //         console.log(time);
    // //         tempTime= time;
    // //         if (tempTime > 0) {
    // //             setTime(value => {
    // //                 return value -1;
    // //             });
    // //         }
    // //         else {
    // //             clearInterval(interval)
    // //         }
    // //     },1000)
    // // }, []);
    // let interval;
    // useEffect(() => {
    //     if (!interval) {
    //         interval = setInterval(() => {
    //             setTime(value => {
    //                 if (value <= 0) { 
    //                     clearInterval(interval)
    //                     return 0;
    //                 }
    //                 else {
    //                     return value - 1;
    //                 }
                    
    //             });
    //         },1000);
    //         // console.log('a');
    //     }
    // },[]);
    
    // useEffect(() => {
    //     if (!interval) {
    //         interval = setInterval(intervalFunc(setTime,closeM), 1000);
    //     }
    // },[]);
    
    
    
    // let timeout;
    // useEffect(() => {
    //     if (!timeout) {
    //         console.log(time);
    //         if (time > 0) {
    //             timeout = setTimeout(() => {
    //                 setTime(value => {
    //                     return value - 1;
    //                 })
    //             },1000)
    //         }
    //         else {
    //             clearTimeout(timeout);
    //         }
            
    //     }
    // },[time]);
    
    return (
        <div>
            {/* <Timer reducer={1} max={10} />
            {time}
            <div onClick={() => { setTime(10) }}>
                click
            </div> */}
            <Timer time={time} setTime={setTime}/>
        </div>
    );
}

export default Test;

