import { useEffect, useCallback, useState, useRef } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import FlagTransition from "./FlagTransition";
import Modal from "./Modal";
import Timer from "../components/Timer";
import ProgressBar from "./ProgressBar";
import GameLayout from "./GameLayout";
import { getRandomInt } from "../utils";
import { useGameDataset } from "../hooks/useGameDataset";
import { useCountryData } from "../hooks/useCountryData";
import usePageMeta from "../hooks/usePageMeta";

const MODE_CONFIG = {
  classic: { time: 10, options: 5, skip: true, endless: false, globalTimer: false },
  endless: { time: 10, options: 5, skip: true, endless: true, globalTimer: false },
  speed: { time: 60, options: 5, skip: true, endless: true, globalTimer: true },
  zen: { time: null, options: 5, skip: true, endless: false, globalTimer: false },
  hardcore: { time: 5, options: 6, skip: false, endless: false, globalTimer: false },
};

const sortByName = (a, b) => a.name.common.localeCompare(b.name.common);

export default function Game() {
  const { mode = "classic" } = useParams();
  const [searchParams] = useSearchParams();
  const config = MODE_CONFIG[mode] || MODE_CONFIG.classic;
  const typed = searchParams.get("typed") === "true";
  const showSuggestions = typed && searchParams.get("noSuggestions") !== "true";

  const dataset = useGameDataset();
  const data = useCountryData();

  const generateOptions = (correct, pool, count) => {
    const others = pool.filter((c) => c.ccn3 !== correct.ccn3);
    const needed = Math.min(count, others.length);
    const picked = [];
    while (picked.length < needed) {
      const rand = others[getRandomInt(others.length)];
      if (!picked.includes(rand)) picked.push(rand);
    }
    return [...picked, correct].sort(sortByName);
  };

  const [countries, setCountries] = useState(dataset);
  const [randomFlag, setRandomFlag] = useState(dataset[getRandomInt(dataset.length)]);
  const [options, setOptions] = useState(() => generateOptions(randomFlag, data, config.options - 1));
  const [score, setScore] = useState([0, 0]);
  const [results, setResults] = useState([]);
  const [time, setTime] = useState(config.time);
  const [skipFlag, setSkipFlag] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highlighted, setHighlighted] = useState(null);
  const [typedInput, setTypedInput] = useState("");
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);
  const globalTimerRef = useRef(null);

  const total = dataset.length;
  const answered = total - countries.length;

  usePageMeta(
    `Where in the world? - Guess the Flag (${mode})`,
    "See a country flag and pick the correct name."
  );

  // Global timer for speed mode
  useEffect(() => {
    if (!config.globalTimer) return;
    if (gameOver) return;
    globalTimerRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          clearInterval(globalTimerRef.current);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(globalTimerRef.current);
  }, [config.globalTimer, gameOver]);

  const endGame = useCallback(() => {
    setGameOver(true);
    if (globalTimerRef.current) clearInterval(globalTimerRef.current);
  }, []);

  const pick = useCallback((choice) => {
    if (gameOver) return;

    setResults((prev) => [...prev, { options, selected: choice, correct: randomFlag }]);

    const isCorrect = choice && choice.ccn3 === randomFlag.ccn3;

    if (isCorrect) {
      setScore((prev) => [prev[0] + 1, prev[1]]);
    } else {
      setScore((prev) => [prev[0], prev[1] + 1]);
      // Endless mode: one wrong = game over
      if (config.endless && !config.globalTimer) {
        setResults((prev) => [...prev]);
        endGame();
        return;
      }
    }

    setSkipFlag(true);

    // Advance
    const remaining = countries.filter((c) => c.ccn3 !== randomFlag.ccn3);
    setCountries(remaining);

    if (remaining.length === 0 && !config.endless) {
      endGame();
      return;
    }

    // For endless, recycle from full dataset
    const pool = config.endless ? data : remaining;
    if (pool.length === 0) { endGame(); return; }

    const next = pool[getRandomInt(pool.length)];
    setRandomFlag(next);
    setOptions(generateOptions(next, data, config.options - 1));
    if (!config.globalTimer) setTime(config.time);
  }, [options, randomFlag, countries, data, config, gameOver, endGame]);

  const handleClick = (country) => pick(country);

  const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

  const handleTypedSubmit = (e) => {
    e.preventDefault();
    const input = normalize(typedInput);
    const correct = randomFlag.name.common;
    const altNames = [
      correct,
      ...(randomFlag.altSpellings || []),
      randomFlag.name?.official || "",
    ];
    const isMatch = altNames.some((name) => normalize(name) === input);
    if (isMatch) {
      pick(randomFlag);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      pick(null);
    }
    setTypedInput("");
  };

  const skip = useCallback(() => {
    if (config.skip) {
      pick(null);
      setTypedInput("");
    }
  }, [pick, config.skip]);

  const loss = () => pick(null);

  useEffect(() => {
    if (typed) return; // keyboard shortcuts disabled in typed mode
    const handleKeyDown = (e) => {
      if (gameOver) return;
      const num = parseInt(e.key);
      if (num >= 1 && num <= options.length) {
        setHighlighted(num - 1);
        setTimeout(() => {
          pick(options[num - 1]);
          setHighlighted(null);
        }, 150);
      } else if (e.key.toLowerCase() === "s" && config.skip) {
        skip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, pick, skip, gameOver, config.skip, typed]);

  // Auto-focus input in typed mode
  useEffect(() => {
    if (typed && inputRef.current) inputRef.current.focus();
  }, [randomFlag, typed]);

  const startAgain = () => {
    const first = dataset[getRandomInt(dataset.length)];
    setCountries(dataset);
    setRandomFlag(first);
    setOptions(generateOptions(first, data, config.options - 1));
    setTime(config.time);
    setScore([0, 0]);
    setResults([]);
    setSkipFlag(false);
    setGameOver(false);
  };

  if (dataset.length <= 0) {
    return <Navigate replace to="/games" />;
  }

  if (gameOver || (countries.length === 0 && !config.endless)) {
    const isEndless = config.endless && !config.globalTimer;
    return (
      <Modal
        title={isEndless ? "Game Over 💀" : "You finished the game 😁👍🏻"}
        desc={isEndless
          ? `Your streak: ${score[0]}`
          : "See your score, play again or go back to play more puzzles"}
        again={startAgain}
        score={isEndless ? score[0] : score}
        results={results}
        menuPath="/guesstheflag"
      />
    );
  }

  return (
    <GameLayout>
      {answered === 0 && (
        <h1 className="font-semibold text-2xl text-center">
          {mode === "endless" && "Keep going until you miss!"}
          {mode === "speed" && "Answer as many as you can!"}
          {mode === "zen" && "Take your time, no pressure"}
          {mode === "hardcore" && "No mercy. Good luck."}
          {mode === "classic" && "Choose the name of the country based on the flag"}
        </h1>
      )}

      {!config.endless && <ProgressBar current={answered} total={total} />}
      {config.endless && !config.globalTimer && (
        <p className="text-center font-semibold">Streak: {score[0]}</p>
      )}

      <div className="w-full h-[250px]">
        <FlagTransition flag={randomFlag} />
      </div>

      {typed ? (
        <form onSubmit={handleTypedSubmit} className="flex flex-col w-full gap-2 relative">
          <input
            ref={inputRef}
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder="Type country name..."
            autoComplete="off"
            className={`shadow rounded p-3 bg-white dark:bg-dark-mode-light border text-center text-lg outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
              shake ? "animate-shake" : ""
            }`}
          />
          {showSuggestions && typedInput.length >= 2 && (
            <ul className="absolute top-full mt-1 w-full bg-white dark:bg-dark-mode-light border rounded shadow-lg max-h-40 overflow-y-auto z-10">
              {data
                .filter((c) => normalize(c.name.common).includes(normalize(typedInput)))
                .slice(0, 5)
                .map((c) => (
                  <li
                    key={c.ccn3}
                    onClick={() => { setTypedInput(c.name.common); inputRef.current?.focus(); }}
                    className="px-3 py-2 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 text-sm"
                  >
                    {c.name.common}
                  </li>
                ))}
            </ul>
          )}
          <button
            type="submit"
            className="shadow rounded p-2 bg-black/5 dark:bg-white/10 border hover:bg-black/10 dark:hover:bg-white/20 transition-colors font-semibold"
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="flex flex-col w-full gap-2">
          {options.map((element, index) => (
            <button
              key={index}
              onClick={() => handleClick(element)}
              className={`shadow rounded p-2 border transition-colors hover:cursor-pointer select-none text-left ${
                highlighted === index
                  ? "bg-black/20 dark:bg-white/20 scale-[0.98]"
                  : "bg-white dark:bg-dark-mode-light hover:bg-black/10 dark:hover:bg-white/10"
              }`}
            >
              <span className="opacity-40 text-xs mr-2">{index + 1}</span>
              {element.name.common}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        {config.skip ? (
          <button
            onClick={skip}
            className="text-sm opacity-60 hover:opacity-100 transition-opacity select-none"
          >
            Skip <span className="text-xs opacity-50">(S)</span>
          </button>
        ) : <span />}

        {config.globalTimer && (
          <div className="font-bold h-8 w-8 text-xl dark:bg-white bg-black text-white dark:text-black flex flex-col justify-center items-center rounded-full">
            {time}
          </div>
        )}

        {!config.globalTimer && config.time && (
          <Timer
            reducer={1}
            time={time}
            skip={skipFlag}
            skipf={setSkipFlag}
            loss={loss}
            setTime={setTime}
            className="self-end"
          />
        )}
      </div>
    </GameLayout>
  );
}
