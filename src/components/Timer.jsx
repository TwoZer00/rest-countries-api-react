
import React, { useEffect, useState } from 'react';

export const Timer = ({ time, setTime, reducer, className, skip, skipf, loss }) => {
    let timeout;
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
                }, reducer * 1000);
            }
        }
    }, [time]);


    useEffect(() => {
        if (skip) {
            // console.log('a')
            clearTimeout(timeout);
            skipf(false);
        }
    }, [skip])
    return (
        <div className={`${className} font-bold h-8 w-8 text-xl dark:bg-white bg-black text-white dark:text-black flex flex-col justify-center items-center rounded-full`}>
            {time}
        </div>
    );
}
