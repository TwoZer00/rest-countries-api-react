import { useContext, useEffect, useCallback, useState } from "react";
import { Navigate } from "react-router-dom";
import { DataContext } from "../App";
import FlagTransition from "./FlagTransition";
import Modal from "./Modal";
import Timer from "../components/Timer";
import ProgressBar from "./ProgressBar";
import GameLayout from "./GameLayout";
import { getRandomInt, unMemberFilter } from "../utils";
import { useGameDataset } from "../hooks/useGameDataset";
import usePageMeta from "../hooks/usePageMeta";

const sortByName = (a, b) => a.name.common.localeCompare(b.name.common);

export default function Game() {
  const dataset = useGameDataset();
  const data = unMemberFilter(useContext(DataContext));

  const generateOptions = (correct, pool) => {
    const others = pool.filter((c) => c.ccn3 !== correct.ccn3);
    const needed = Math.min(4, others.length);
    const picked = [];
    while (picked.length < needed) {
      const rand = others[getRandomInt(others.length)];
      if (!picked.includes(rand)) picked.push(rand);
    }
    return [...picked, correct].sort(sortByName);
  };

  const [countries, setCountries] = useState(dataset);
  const [randomFlag, setRandomFlag] = useState(
    dataset[getRandomInt(dataset.length)]
  );
  const [options, setOptions] = useState(() =>
    generateOptions(randomFlag, data)
  );
  const [score, setScore] = useState([0, 0]);
  const [results, setResults] = useState([]);
  const [time, setTime] = useState(10);
  const [skipFlag, setSkipFlag] = useState(false);

  const total = dataset.length;
  const answered = total - countries.length;

  usePageMeta(
    "Where in the world? - Guess the Flag",
    "See a country flag and pick the correct name. Test your flag knowledge with this geography quiz!"
  );

  const pick = useCallback((choice) => {
    setResults((prev) => [...prev, { options, selected: choice, correct: randomFlag }]);

    if (choice && choice.ccn3 === randomFlag.ccn3) {
      setScore((prev) => [prev[0] + 1, prev[1]]);
    } else {
      setScore((prev) => [prev[0], prev[1] + 1]);
    }

    setSkipFlag(true);

    // Inline advance to avoid stale closure
    const remaining = countries.filter((c) => c.ccn3 !== randomFlag.ccn3);
    setCountries(remaining);
    if (remaining.length === 0) return;
    const next = remaining[getRandomInt(remaining.length)];
    setRandomFlag(next);
    setOptions(generateOptions(next, data));
    setTime(10);
  }, [options, randomFlag, countries, data]);

  const handleClick = (country) => {
    pick(country);
  };

  const skip = useCallback(() => {
    pick(null);
  }, [pick]);

  const loss = () => {
    pick(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      const num = parseInt(e.key);
      if (num >= 1 && num <= options.length) {
        pick(options[num - 1]);
      } else if (e.key.toLowerCase() === "s") {
        skip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, pick, skip]);

  const startAgain = () => {
    const first = dataset[getRandomInt(dataset.length)];
    setCountries(dataset);
    setRandomFlag(first);
    setOptions(generateOptions(first, data));
    setTime(10);
    setScore([0, 0]);
    setResults([]);
    setSkipFlag(false);
  };

  if (dataset.length <= 0) {
    return <Navigate replace to="/games" />;
  }

  if (countries.length === 0) {
    return (
      <Modal
        title="You finished the game 😁👍🏻"
        desc="See your score, play again or go back to play more puzzles"
        again={startAgain}
        score={score}
        results={results}
      />
    );
  }

  return (
    <GameLayout>
        {answered === 0 && (
          <h1 className="font-semibold text-2xl text-center">
            Choose the name of the country based on the flag
          </h1>
        )}

        <ProgressBar current={answered} total={total} />

        <div className="w-full h-[250px]">
          <FlagTransition flag={randomFlag} />
        </div>

        <div className="flex flex-col w-full gap-2">
          {options.map((element, index) => (
            <button
              key={index}
              onClick={() => handleClick(element)}
              className="shadow rounded p-2 bg-white dark:bg-dark-mode-light border hover:bg-black/10 dark:hover:bg-white/10 transition-colors hover:cursor-pointer select-none text-left"
            >
              <span className="opacity-40 text-xs mr-2">{index + 1}</span>
              {element.name.common}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={skip}
            className="text-sm opacity-60 hover:opacity-100 transition-opacity select-none"
          >
            Skip <span className="text-xs opacity-50">(S)</span>
          </button>
          <Timer
            reducer={1}
            time={time}
            skip={skipFlag}
            skipf={setSkipFlag}
            loss={loss}
            setTime={setTime}
            className="self-end"
          />
        </div>
    </GameLayout>
  );
}
