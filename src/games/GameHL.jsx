import { useEffect, useState, useCallback } from "react";
import HLFlag from "./HLFlag";
import Modal from "./Modal";
import { getRandomInt } from "../utils";
import { useCountryData } from "../hooks/useCountryData";
import usePageMeta from "../hooks/usePageMeta";

export default function GameHL() {
  const data = useCountryData();

  const pickRandom = (pool) => pool[getRandomInt(pool.length)];
  const pickDifferent = (pool, exclude) => {
    const filtered = pool.filter((c) => c.ccn3 !== exclude.ccn3);
    return filtered[getRandomInt(filtered.length)];
  };

  const [initial] = useState(() => {
    const first = pickRandom(data);
    const second = pickDifferent(data, first);
    return { first, second };
  });
  const [country, setCountry] = useState(initial.first);
  const [countryC, setCountryC] = useState(initial.second);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [locked, setLocked] = useState(false);

  usePageMeta(
    "Where in the world? - Higher or Lower",
    "Compare country populations and guess which is higher or lower. How long can you keep your streak?"
  );

  const guess = useCallback((choice) => {
    if (locked || gameOver) return;
    setLocked(true);
    setShowResults(true);

    let correct;
    if (country.population > countryC.population) {
      correct = "lower";
    } else if (country.population === countryC.population) {
      correct = "draw";
    } else {
      correct = "higher";
    }

    if (choice === correct || correct === "draw") {
      setScore((prev) => prev + 1);
      setTimeout(() => {
        setShowResults(false);
        setLocked(false);
        advance();
      }, 1500);
    } else {
      const record = parseInt(localStorage.getItem("GameHL") ?? "0", 10);
      if (score > record) {
        localStorage.setItem("GameHL", String(score));
      }
      setTimeout(() => {
        setShowResults(false);
        setLocked(false);
        setGameOver(true);
      }, 1500);
    }
  }, [country, countryC, score, locked, gameOver]);

  const advance = () => {
    const next = pickDifferent(data, countryC);
    setCountry(countryC);
    setCountryC(next);
  };

  const resetGame = () => {
    const first = pickRandom(data);
    const second = pickDifferent(data, first);
    setCountry(first);
    setCountryC(second);
    setScore(0);
    setGameOver(false);
    setShowResults(false);
    setLocked(false);
  };

  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toLowerCase();
      if (key === "h" || key === "arrowup") guess("higher");
      else if (key === "l" || key === "arrowdown") guess("lower");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [guess]);

  return (
    <div className="h-full relative text-white">
      <div className="w-full mx-auto flex flex-col items-center justify-center h-full">
        <div className="absolute top-2 sm:top-4 z-40 flex flex-col items-center">
          <p className="text-xl sm:text-2xl font-bold">Higher or Lower</p>
          <p className="text-xs sm:text-sm opacity-60">Streak: {score}</p>
        </div>
        <div className="flex flex-col lg:flex-row items-center w-full text-center h-full relative">
          <HLFlag
            name={country.name.common}
            btn={false}
            population={country.population}
            svg={country.flags.svg}
            onGuess={guess}
            showPopulation={showResults}
          />
          <div className="font-bold text-xl sm:text-2xl absolute flex items-center justify-center w-full h-full z-30 pointer-events-none">
            <span className="bg-dark-mode-light/70 backdrop-blur-sm px-3 py-1 rounded-full">V.S</span>
          </div>
          <HLFlag
            name={countryC.name.common}
            btn={true}
            population={countryC.population}
            svg={countryC.flags.svg}
            onGuess={guess}
            showPopulation={showResults}
            locked={locked}
          />
        </div>
      </div>
      {gameOver && (
        <Modal title="Game over!" score={score} again={resetGame} />
      )}
    </div>
  );
}
