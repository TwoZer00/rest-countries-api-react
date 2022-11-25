
import React, { useEffect, useState } from 'react';

export const Timer = ({ time,setTime,reducer,className,skip,skipf,loss}) => {
    // let interval;
    // useEffect(() => {
    //     if (!interval) {
    //         interval = setInterval(() => {
    //             console.log(time);
    //             setTime(value => {
    //                 if (value <= 0) {
    //                     console.log('a');
    //                     // loss();
    //                     return 10;
    //                 }
    //                 else {
    //                     return value - 1;
    //                 }
                    
    //             });
    //         },reducer*1000);
    //     }
    // },[]);


    let timeout;

    // if (!timeout) {
    //     console.log(time)
    //     timeout = setTimeout(() => {
    //         if (time > 0) {
    //             setTime(value => {
    //                 return value - 1;
    //             })
    //         }
    //     },reducer*1000);  
    // }



    useEffect(() => {
        if (!timeout) {
            if (!skip) {
                timeout = setTimeout(() => {
                    if (time > 0) {
                        setTime(value => {
                            return value - 1;
                        })
                    }
                    else if (time === 0) {
                        loss();
                    }
                },reducer*1000);    
            }
        }
    }, [time]);


    useEffect(() => {
        if (skip) {
            // console.log('a')
            clearTimeout(timeout);
            skipf(false);
        }
    },[skip])
    return (
        <div className={`${className} font-bold h-8 w-8 text-xl dark:bg-white bg-black text-white dark:text-black flex flex-col justify-center items-center rounded-full`}>
            {time}
        </div>
    );
}
