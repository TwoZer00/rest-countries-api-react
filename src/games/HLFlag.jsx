import {
  ArrowDownIcon as TrendingDownIcon,
  ArrowUpIcon as TrendingUpIcon,
} from "@heroicons/react/24/outline";
import { useRef } from "react";
import {
  animated,
  useSpring,
  useTransition,
} from "@react-spring/web";

export default function HLFlag({
  name,
  population,
  btn,
  svg,
  onGuess,
  showPopulation,
  locked,
}) {
  const isFirstRender = useRef(true);

  const { number } = useSpring({
    reset: true,
    from: { number: 0 },
    number: population,
    config: { duration: 800 },
  });

  const immediate = isFirstRender.current;

  const flagTransition = useTransition(svg, {
    from: immediate ? { opacity: 1, x: "0%" } : { opacity: 0, x: "60%" },
    enter: { opacity: 1, x: "0%" },
    leave: { opacity: 0, x: "-60%" },
    config: { tension: 200, friction: 26 },
    onRest: () => { isFirstRender.current = false; },
  });

  const nameTransition = useTransition(name, {
    from: immediate ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: -30 },
    config: { tension: 220, friction: 24 },
  });

  return (
    <section className="w-full lg:w-1/2 h-full">
      <div className="relative h-full overflow-hidden">
        {flagTransition((style, item) => (
          <animated.img
            src={item}
            alt={name}
            style={{ ...style, position: "absolute" }}
            className="h-full object-cover w-full object-center"
          />
        ))}
        <div className="absolute top-0 bg-dark-mode-ligth/50 backdrop-blur-sm p-4 h-full z-20 w-full flex flex-col gap-2 items-center justify-center">
          {nameTransition((style, item) => (
            <animated.div style={{ ...style, position: "absolute" }} className="flex flex-col items-center">
              <p className="text-4xl sm:text-6xl font-bold text-center">{item}</p>
              {showPopulation && (
                <animated.p className="font-bold text-3xl sm:text-4xl mt-2">
                  {number.to((n) => Math.round(n).toLocaleString())}
                </animated.p>
              )}
              {btn && !showPopulation && (
                <div className="flex flex-row gap-2 items-center justify-center my-3">
                  <button
                    onClick={() => onGuess("higher")}
                    disabled={locked}
                    className="border rounded overflow-hidden px-3 py-1 text-xl hover:bg-white/20 transition-all flex flex-row items-center gap-1 group disabled:opacity-50"
                  >
                    Higher
                    <TrendingUpIcon className="w-5 h-5 pointer-events-none group-hover:animate-toggleup transition" />
                    <span className="text-xs opacity-40 ml-1">(H)</span>
                  </button>
                  <p>OR</p>
                  <button
                    onClick={() => onGuess("lower")}
                    disabled={locked}
                    className="border overflow-hidden rounded px-3 py-1 text-xl group hover:bg-white/20 transition-all flex flex-row items-center gap-1 disabled:opacity-50"
                  >
                    Lower
                    <TrendingDownIcon className="w-5 h-5 pointer-events-none group-hover:animate-toggledown transition" />
                    <span className="text-xs opacity-40 ml-1">(L)</span>
                  </button>
                </div>
              )}
            </animated.div>
          ))}
        </div>
      </div>
    </section>
  );
}
