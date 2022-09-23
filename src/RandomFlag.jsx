import React, { useEffect } from "react";
import { useRef } from "react";
import { useSpring, animated } from "react-spring";

export default function RandomFlag({ flag }) {
  // const [styles, api] = useSpring(() => ({
  //   from: { x: -100, opacity: 0 },
  // }));
  const [styles, api] = useSpring(() => ({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: true,
  }));
  useEffect(() => {
    api.start({
      from: { x: 200 },
      to: { x: 0 },
    });
  }, [flag]);
  const flagElement = (
    <animated.img
      key={flag.ccn3}
      src={flag.flags.svg}
      alt={flag.name.common}
      className={`w-full max-h-[300px] object-fill`}
      style={styles}
    />
  );
  return (
    <div
      className={`w-[500px] h-[300px] flex flex-col items-center justify-center overflow-hidden`}
    >
      {flagElement}
    </div>
  );
}
