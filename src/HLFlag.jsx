import React, { useEffect } from "react";
import {
  ArrowUpIcon as TrendingUpIcon,
  ArrowDownIcon as TrendingDownIcon,
} from "@heroicons/react/24/outline";
import {
  useSpring,
  animated,
  easings,
  config,
  useTransition,
} from "react-spring";
export default function HLFlag({
  name,
  population,
  btn,
  svg,
  val,
  showPopulation,
  animate,
}) {
  let x = easings.easeInOutQuart;
  //   if (animate) x = easings.easeOutQuart;
  const [styles, api] = useSpring(() => ({
    to: { opacity: 1 },
    from: { opacity: 0 },
    reset: true,
  }));
  //   const transitions = useTransition(svg, {
  //     from: { opacity: 0 },
  //     enter: { opacity: 1 },
  //     leave: { opacity: 0 },
  //     reverse: true,
  //     delay: 200,
  //     config: config.molasses,
  //   });
  const { number } = useSpring({
    reset: true,
    from: { number: 0 },
    number: population,
    config: { duration: 800 },
  });
  useEffect(() => {
    api.start({
      to: { x: 0 },
      from: { x: 300 },
      delay: 0,
    });
  }, [svg]);

  return (
    <section className="w-full lg:w-1/2 h-full">
      <div className="relative h-full overflow-hidden">
        <animated.img
          src={svg}
          alt={name}
          style={styles}
          className="h-full object-cover w-full object-center"
        />
        <div className="absolute top-0 bg-dark-mode-ligth/50 backdrop-blur-sm h-full z-20 w-full flex flex-col gap-2 items-center justify-center">
          <div className="">
            <p className="text-6xl font-bold">{name}</p>
          </div>
          {showPopulation && (
            <animated.p className="font-bold text-4xl">
              {number.to((n) => Math.round(n).toLocaleString())}
            </animated.p>
          )}
          {btn && (
            <div className="">
              <button
                onClick={val}
                className="border rounded px-2 text-xl hover:bg-white/20 transition-all flex flex-row items-center"
              >
                Higher
                <TrendingUpIcon className="w-5 h-5 pointer-events-none" />
              </button>
              <p>OR</p>
              <button
                onClick={val}
                className="border rounded px-2 text-xl hover:bg-white/20 transition-all flex flex-row items-center"
              >
                Lower
                <TrendingDownIcon className="w-5 h-5 pointer-events-none" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
