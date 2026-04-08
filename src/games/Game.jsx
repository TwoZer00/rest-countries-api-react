import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { DataContext } from "../App";
import FlagTransition from "./FlagTransition";
import Modal from "./Modal";
import { Timer } from "../components/Timer";
import { getRandomInt, unMemberFilter } from "../utils";
import { useGameDataset } from "../hooks/useGameDataset";

const sortByName = (a, b) => a.name.common.localeCompare(b.name.common);

export default function Game() {
  const dataset = useGameDataset();
  const data = unMemberFilter(useContext(DataContext));

  const generateOptions = (correct, pool) => {
    const others = pool.filter((c) => c.ccn3 !== correct.ccn3);
    const picked = [];
    while (picked.length < 4) {
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
  const [rmClick, setRmClick] = useState(false);
  const [skipFlag, setSkipFlag] = useState(false);

  useEffect(() => {
    document.title = "Where in the world? - Guess the flag";
  }, []);

  const handleClick = (event) => {
    setRmClick(true);
    const target = event.target.innerHTML;
    const selected = data.find((v) => v.name.common === target);

    setResults((prev) => [...prev, { options, selected, correct: randomFlag }]);

    if (target === randomFlag.name.common) {
      win();
    } else {
      loss();
    }

    setTimeout(() => setRmClick(false), 120);
  };

  const win = () => {
    setScore((prev) => [prev[0] + 1, prev[1]]);
    setSkipFlag(true);
    advance();
  };

  const loss = () => {
    setScore((prev) => [prev[0], prev[1] + 1]);
    setSkipFlag(true);
    advance();
  };

  const advance = () => {
    const remaining = countries.filter((c) => c.ccn3 !== randomFlag.ccn3);
    setCountries(remaining);
    if (remaining.length === 0) return;
    const next = remaining[getRandomInt(remaining.length)];
    setRandomFlag(next);
    setOptions(generateOptions(next, data));
    setTime(10);
  };

  const startAgain = () => {
    const first = dataset[getRandomInt(dataset.length)];
    setCountries(dataset);
    setRandomFlag(first);
    setOptions(generateOptions(first, data));
    setTime(10);
    setRmClick(false);
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
        desc="Congrats! See your score, play again or go back to play more puzzles"
        again={startAgain}
        score={score}
        results={results}
      />
    );
  }

  return (
    <div className="dark:text-white flex flex-col h-full w-11/12 justify-center items-center mx-auto relative">
      <div className="flex flex-col bg-white/10 backdrop-blur-sm p-10 rounded gap-5 px-5 w-full sm:w-[500px]">
        {countries.length >= dataset.length && (
          <h1 className="font-semibold text-2xl">
            Choose the name of the country based on the flag
          </h1>
        )}
        <div className="w-full h-[250px] flex-auto">
          <FlagTransition flag={randomFlag} />
        </div>
        <div className={`flex flex-col justify-center w-full gap-2 ${rmClick ? "pointer-events-none" : ""}`}>
          {options.map((element, index) => (
            <button
              key={index}
              onClick={handleClick}
              className="shadow rounded p-2 bg-white dark:bg-dark-fe border hover:bg-dark-mode-ligth/10 transition-colors dark:hover:bg-dark-mode-ligth/10 hover:cursor-pointer select-none"
            >
              {element.name.common}
            </button>
          ))}
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="font-bold">{countries.length}</div>
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
      </div>
    </div>
  );
}
