import React, { useContext, useEffect, useState } from 'react';
import { config, useTransition,animated } from 'react-spring';
import { DataContext } from './App';
import { getRandomInt, unMemberFilter } from './utils';

const FlagTransition = ({flag,styles,...props}) => {
    const transitions = useTransition(flag, {
        from: { x: "100%" },
        enter: { x: "0" },
        leave: { x: "-100%" },
        config: config.slow,
    })
    return (
        <div className={`${props.className} relative h-full w-full overflow-hidden`} style={styles}>
            {transitions((style, item) =>
            // item ? (
            //     <animated.img
            //         className="w-[200px]"
            //         style={{...style,
            //             position: "absolute",
            //         }}
            //         src={oldFlag.flags.svg}
            //     >
            //     </animated.img>
            // ) : (
            //         <animated.img
            //             className="w-[200px]"
            //             style={{...style,
            //                 position:"absolute",
            //             }}
            //             src={newFlag.flags.svg}
            //         >
            //     </animated.img>
            // )
            <animated.img
                    className="w-full h-full object-contain"
                    style={{
                    ...style,
                        position:"absolute"
                    }}
                    src={item.flags.svg}
                    alt={item.name.common}
                />
            // item?<animated.img className="w-[200px]" src={item.flags.svg} style={style}></animated.img>:<animated.img className="w-[200px]" src={item.flags.svg} style={style}></animated.img>
            // <animated.img style={style} src={item.flag.svg}/>
        )}
        </div>
    )
}

export default FlagTransition;

// const FlagTransition = () => {
//     return (
//         <div>
//             Hello world
//         </div>
//     );
// }

// export default FlagTransition;
