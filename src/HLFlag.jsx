import {
  ArrowDownIcon as TrendingDownIcon,
  ArrowUpIcon as TrendingUpIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import {
  animated,
  config,
  easings,
  useSpring,
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
  const { number } = useSpring({
    reset: true,
    from: { number: 0 },
    number: population,
    config: { duration: 800 },
  });
  // useEffect(() => {
  //   api.start({
  //     to: { x: 0 },
  //     from: { x: 300 },
  //     delay: 0,
  //   });
  // }, [svg]);

  const transitions = useTransition(svg, {
    from: { x: "100%" },
    enter: { x: "0" },
    leave: { x: "-100%" },
    config: config.slow,
  })
  const transitionp = useTransition(name, {
    from: { x: "200%" },
    enter: { x: "0" },
    leave: { x: "-200%" },
    config: config.slow,
  })

  return (
    <section className="w-full lg:w-1/2 h-full">
      <div className="relative h-full overflow-hidden">
        {transitions((style, item) =>
          <animated.img
            src={item}
            alt={name}
            style={{
              ...style,
              position: "absolute"
            }}
            className="h-full object-cover w-full object-center"
          />
        )}
        <div className="absolute top-0 bg-dark-mode-ligth/50 backdrop-blur-sm p-4 h-full z-20 w-full flex flex-col gap-2 items-center justify-center">
          {transitionp((style, item) =>
            <animated.div style={{
              ...style,
              position: "absolute"
            }}>
              <div className="inline-block">
                <p className="text-6xl font-bold">{name}</p>
              </div>
              {showPopulation && (
                <animated.p className="font-bold text-4xl">
                  {number.to((n) => Math.round(n).toLocaleString())}
                </animated.p>
              )}
              {btn && !showPopulation && (
                <div className="flex flex-row gap-2 items-center justify-center my-2">
                  <button
                    onClick={val}
                    className="border rounded overflow-hidden px-2 text-xl hover:bg-white/20 transition-all flex flex-row items-center group"
                  >
                    Higher
                    <TrendingUpIcon className="w-5 h-5 pointer-events-none group-hover:animate-toggleup transition" />
                  </button>
                  <p>OR</p>
                  <button
                    onClick={val}
                    className="border overflow-hidden rounded px-2 text-xl group hover:bg-white/20 transition-all flex flex-row items-center"
                  >
                    Lower
                    <TrendingDownIcon className="w-5 h-5 pointer-events-none group-hover:animate-toggledown transition" />
                  </button>
                </div>
              )}
            </animated.div>
          )}
        </div>
      </div>
    </section>
  );
}
