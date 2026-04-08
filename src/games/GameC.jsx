import { useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import { DataContext } from "../App";
import Hint from "./Hint";
import Modal from "./Modal";
import { useOutsideAlerter } from "../hooks/useOutsideAlerter";
import lossSound from "../resources/loss_sound.wav";
import winSound from "../resources/win_sound.wav";
import { randomCountryPosition, unMemberFilter } from "../utils";
import { getCountryDetails } from "../services/api";
import { useGameDataset } from "../hooks/useGameDataset";

const HINTS = [
  { key: "region", title: "Region", cost: 1, getData: (c) => c?.region },
  { key: "population", title: "Population", cost: 1, getData: (c) => c?.population?.toLocaleString() },
  { key: "area", title: "Area", cost: 1, getData: (c) => c?.area ? c.area + " km" : undefined },
  { key: "language", title: "Language", cost: 2, getData: (c) => Object.values(c?.languages ?? {})[0] },
  { key: "domain", title: "Domain", cost: 3, getData: (c) => c?.tld?.[0] },
  { key: "capital", title: "Capital", cost: 4, getData: (c) => c?.capital?.[0] },
];

export default function GameC() {
  const dataset = useGameDataset();
  const data = unMemberFilter(useContext(DataContext));
  const [countries, setCountries] = useState(dataset);
  const [randomCountry, setRandomCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(10);
  const [revealedHints, setRevealedHints] = useState(new Set());
  const [optionsSearch, setOptionsSearch] = useState([]);
  const [visible, setVisible] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [valid, setValid] = useState(undefined);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [results, setResults] = useState([]);

  const dropdownRef = useRef();
  const winAudioRef = useRef();
  const lossAudioRef = useRef();
  const formRef = useRef();
  const inputRef = useRef();
  useOutsideAlerter(dropdownRef, setVisible);

  const total = dataset.length;
  const answered = total - countries.length;
  const progress = total > 0 ? (answered / total) * 100 : 0;

  const suggestedHint = useMemo(() => {
    const unrevealed = HINTS.filter((h) => !revealedHints.has(h.key));
    if (unrevealed.length === 0) return null;
    return unrevealed.reduce((min, h) => h.cost < min.cost ? h : min).key;
  }, [revealedHints]);

  useEffect(() => {
    document.title = "Where in the world? - Guess the country";
  }, []);

  useEffect(() => {
    if (!randomCountry) fetchNextCountry(dataset);
  }, []);

  const fetchNextCountry = async (pool) => {
    if (pool.length === 0) return;
    setLoading(true);
    const temp = pool[randomCountryPosition(pool.length)];
    const details = await getCountryDetails(temp.ccn3);
    setRandomCountry(details);
    setLoading(false);
  };

  const handleHintReveal = (hintKey) => {
    setRevealedHints((prev) => new Set([...prev, hintKey]));
  };

  const submitAnswer = useCallback((value) => {
    if (!value || !randomCountry) return;
    setVisible(false);
    setShowResult(true);

    const isCorrect = value.toLowerCase() === randomCountry.name.common.toLowerCase();
    if (isCorrect) {
      setScore((prev) => prev + totalScore);
      setValid(true);
      winAudioRef.current.currentTime = 0;
      winAudioRef.current.play();
    } else {
      setValid(false);
      lossAudioRef.current.currentTime = 0;
      lossAudioRef.current.play();
    }

    setResults((prev) => [...prev, {
      correct: randomCountry,
      selected: { name: { common: value } },
      wasCorrect: isCorrect,
      pointsEarned: isCorrect ? totalScore : 0,
      hintsUsed: revealedHints.size,
    }]);

    const remaining = countries.filter(
      (c) => c.name.common !== randomCountry.name.common
    );

    setTimeout(() => {
      setCountries(remaining);
      formRef.current?.reset();
      setShowResult(false);
      setValid(undefined);
      setOptionsSearch([]);
      setTotalScore(10);
      setHighlightIndex(-1);
      setRevealedHints(new Set());
      fetchNextCountry(remaining);
    }, 2000);
  }, [randomCountry, countries, totalScore, data, revealedHints]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let name;
    if (highlightIndex >= 0 && highlightIndex < optionsSearch.length) {
      name = optionsSearch[highlightIndex].name.common;
    } else if (optionsSearch.length > 0) {
      name = optionsSearch[0].name.common;
    }
    if (name) {
      inputRef.current.value = name;
      submitAnswer(name);
    }
  };

  const selectOption = (name) => {
    inputRef.current.value = name;
    submitAnswer(name);
  };

  const skip = useCallback(() => {
    if (showResult || loading) return;
    setVisible(false);

    setResults((prev) => [...prev, {
      correct: randomCountry,
      selected: null,
      wasCorrect: false,
      pointsEarned: 0,
      hintsUsed: revealedHints.size,
    }]);

    const remaining = countries.filter(
      (c) => c.name.common !== randomCountry.name.common
    );
    formRef.current?.reset();
    setCountries(remaining);
    setOptionsSearch(data);
    setTotalScore(10);
    setHighlightIndex(-1);
    setRevealedHints(new Set());
    fetchNextCountry(remaining);
  }, [showResult, loading, countries, randomCountry, data, revealedHints]);

  const handleSearch = (e) => {
    setHighlightIndex(-1);
    const value = e.target.value;
    if (value.length >= 2) {
      setVisible(true);
      dropdownRef.current?.scroll(0, 0);
      const filtered = data
        .filter((c) => c.name.common.toLowerCase().includes(value.toLowerCase()))
        .sort((a, b) => a.name.common.localeCompare(b.name.common))
        .slice(0, 5);
      setOptionsSearch(filtered);
    } else {
      setVisible(false);
      setOptionsSearch([]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setVisible(false);
      setHighlightIndex(-1);
      return;
    }
    if (!visible || optionsSearch.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => {
        const next = prev < optionsSearch.length - 1 ? prev + 1 : 0;
        scrollToItem(next);
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => {
        const next = prev > 0 ? prev - 1 : optionsSearch.length - 1;
        scrollToItem(next);
        return next;
      });
    }
  };

  const scrollToItem = (index) => {
    const item = dropdownRef.current?.children[index];
    if (item) item.scrollIntoView({ block: "nearest" });
  };

  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (e.key.toLowerCase() === "s" && document.activeElement !== inputRef.current) {
        skip();
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [skip]);

  const startAgain = () => {
    setCountries(dataset);
    setScore(0);
    setTotalScore(10);
    setValid(undefined);
    setShowResult(false);
    setOptionsSearch(data);
    setHighlightIndex(-1);
    setRevealedHints(new Set());
    setResults([]);
    formRef.current?.reset();
    fetchNextCountry(dataset);
  };

  if (loading && !randomCountry) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl font-semibold dark:text-white animate-pulse">Loading...</p>
      </div>
    );
  }

  if (countries.length === 0) {
    const correctCount = results.filter((r) => r.wasCorrect).length;
    const wrongCount = results.length - correctCount;
    return (
      <Modal
        title="Game over!"
        desc={`You scored ${score} points`}
        again={startAgain}
        score={[correctCount, wrongCount]}
        results={results.map((r) => ({
          correct: r.correct,
          selected: r.selected,
          options: [],
        }))}
      />
    );
  }

  return (
    <div className="dark:text-white h-full flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto">
      <div className="flex w-full flex-col bg-white/10 backdrop-blur-sm lg:w-fit p-4 rounded-lg gap-4">
        <div className="text-center">
          <h1 className="font-bold text-2xl sm:text-4xl">What's the country?</h1>
          <small className="hidden sm:block">
            Click boxes for more details, every box has a cost that reduces your score.
          </small>
        </div>

        <div className="flex items-center justify-between text-sm px-1 sm:px-4">
          <span className="font-semibold">{answered} / {total}</span>
          <span className="font-semibold text-xs sm:text-sm">Score: {score} <span className="text-xs opacity-50">({totalScore} pts)</span></span>
        </div>
        <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-valid rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-x-8 items-center p-2 sm:p-4">
          <div className="flex flex-col gap-4 items-center justify-center w-full">
            <div className="flex flex-row items-stretch w-full">
              <form onSubmit={handleSubmit} ref={formRef} className="w-full">
                <div
                  className={`relative group shadow ${
                    valid === true ? "bg-valid" : valid === false ? "bg-invalid" : "bg-white dark:bg-dark-mode-ligth"
                  } w-full rounded`}
                >
                  <input
                    ref={inputRef}
                    id="country"
                    name="country"
                    className={`${valid !== undefined ? "text-white" : ""} text-xl py-2 bg-white/0 w-full ${visible ? "rounded-b-none" : ""} border-none px-2 outline-none`}
                    placeholder="Type 2+ letters..."
                    disabled={showResult || loading}
                    autoComplete="off"
                    onInput={handleSearch}
                    onKeyDown={handleKeyDown}
                  />
                  <div
                    ref={dropdownRef}
                    className={`absolute z-10 top-full w-full max-h-[150px] bg-white text-black dark:text-white dark:bg-dark-mode-ligth shadow rounded-b-md overflow-auto flex-col ${visible ? "flex" : "hidden"}`}
                  >
                    {optionsSearch.map((element, index) => (
                      <button
                        type="button"
                        key={element.ccn3}
                        className={`flex gap-x-2 text-lg items-center w-full hover:bg-black/10 dark:hover:bg-white/10 px-3 py-1 text-left ${index === highlightIndex ? "bg-black/10 dark:bg-white/10" : ""}`}
                        onClick={() => selectOption(element.name.common)}
                        onMouseEnter={() => setHighlightIndex(index)}
                      >
                        <span>{element.flag}</span>
                        <span>{element.name.common}</span>
                      </button>
                    ))}
                    {optionsSearch.length === 0 && (
                      <p className="px-3 py-2 text-sm opacity-50">No results</p>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full justify-items-center">
              {HINTS.map((hint) => (
                <Hint
                  key={hint.key}
                  id={randomCountry?.ccn3}
                  title={hint.title}
                  data={hint.getData(randomCountry)}
                  ts={setTotalScore}
                  cost={hint.cost}
                  suggested={suggestedHint === hint.key}
                  onReveal={() => handleHintReveal(hint.key)}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-2 select-none w-full lg:w-2/3 py-2">
            <div className="h-44 sm:h-52 w-full max-w-[350px] mx-auto bg-white/90 dark:bg-dark-mode-ligth/90 py-4 rounded shadow">
              {showResult && randomCountry && (
                <img src={randomCountry.flags.svg} alt={randomCountry.name.common} className="w-full h-full object-contain" />
              )}
            </div>
            <p className="text-xl max-w-full min-w-[200px] min-h-[32px] shadow bg-white dark:bg-dark-mode-ligth rounded text-center flex flex-col items-center justify-center">
              {showResult && randomCountry?.name.common}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center px-1 sm:px-4">
          <button
            onClick={skip}
            disabled={showResult || loading}
            className="text-sm opacity-60 hover:opacity-100 transition-opacity select-none disabled:opacity-20"
          >
            Skip <span className="text-xs opacity-50">(S)</span>
          </button>
          <p className="text-xs opacity-40 hidden sm:block">↑↓ navigate · Enter submit · Esc close</p>
        </div>
      </div>
      <audio ref={winAudioRef} src={winSound} preload="auto" />
      <audio ref={lossAudioRef} src={lossSound} preload="auto" />
    </div>
  );
}
