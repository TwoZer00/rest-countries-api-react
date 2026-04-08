import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Navigate, Link, useSearchParams } from "react-router-dom";
import { getRandomInt } from "../utils";
import { useGameDataset } from "../hooks/useGameDataset";

const MAX_ATTEMPTS = 6;

const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const getLetterStates = (guess, answer) => {
  const gNorm = normalize(guess);
  const aNorm = normalize(answer);
  const result = Array(aNorm.length).fill("absent");
  const used = Array(aNorm.length).fill(false);

  [...gNorm].forEach((ch, i) => {
    if (i < aNorm.length && ch === aNorm[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  });

  [...gNorm].forEach((ch, i) => {
    if (result[i] === "correct") return;
    const idx = [...aNorm].findIndex((a, j) => a === ch && !used[j]);
    if (idx !== -1) {
      result[i] = "present";
      used[idx] = true;
    }
  });

  return result;
};

const BG = {
  correct: "bg-valid text-white border-valid",
  present: "bg-yellow-500 text-white border-yellow-500",
  absent: "bg-black/30 dark:bg-white/20 text-white border-black/30 dark:border-white/20",
};

const RevealCell = ({ ch, state, delay, size }) => {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), delay + 250);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`flex items-center justify-center font-bold uppercase border-2 rounded ${
        revealed ? BG[state] : "border-black/20 dark:border-white/20"
      }`}
      style={{ width: size, height: size, fontSize: size * 0.4, animation: `flip 0.5s ease ${delay}ms both` }}
    >
      {ch}
    </div>
  );
};

const KEYBOARD_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["enter", "z", "x", "c", "v", "b", "n", "m", "back"],
];

const KEY_BG = {
  correct: "bg-valid text-white",
  present: "bg-yellow-500 text-white",
  absent: "bg-black/20 dark:bg-white/10 opacity-40",
  unused: "bg-black/5 dark:bg-white/5",
};

const LetterTracker = ({ guesses, answerName, onKey }) => {
  const letterMap = useMemo(() => {
    const map = {};
    guesses.forEach((guess) => {
      const states = getLetterStates(guess, answerName);
      [...normalize(guess)].forEach((ch, i) => {
        if (!ch || ch === " ") return;
        const state = states[i];
        const priority = { correct: 3, present: 2, absent: 1 };
        if (!map[ch] || priority[state] > priority[map[ch]]) {
          map[ch] = state;
        }
      });
    });
    return map;
  }, [guesses, answerName]);

  return (
    <div className="flex flex-col gap-1 items-center select-none">
      {KEYBOARD_ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-0.5 sm:gap-1">
          {row.map((key) => {
            if (key === "enter") {
              return (
                <button
                  key={key}
                  onClick={() => onKey("Enter")}
                  className="h-10 sm:h-11 px-2 sm:px-3 flex items-center justify-center rounded text-xs font-bold bg-valid/80 text-white active:scale-95 transition-transform"
                >
                  ↵
                </button>
              );
            }
            if (key === "back") {
              return (
                <button
                  key={key}
                  onClick={() => onKey("Backspace")}
                  className="h-10 sm:h-11 px-2 sm:px-3 flex items-center justify-center rounded text-xs font-bold bg-invalid/80 text-white active:scale-95 transition-transform"
                >
                  ⌫
                </button>
              );
            }
            return (
              <button
                key={key}
                onClick={() => onKey(key)}
                className={`w-7 h-10 sm:w-9 sm:h-11 flex items-center justify-center rounded text-xs sm:text-sm font-bold uppercase active:scale-95 transition-all ${KEY_BG[letterMap[key] || "unused"]}`}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const buildTemplate = (name) =>
  [...name].map((ch) => (/[a-zA-Z\u00C0-\u024F]/.test(ch) ? null : ch));

function OptionsScreen({ dataset, onStart }) {
  const [maxWords, setMaxWords] = useState(1);
  const [maxLength, setMaxLength] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [hintAfter, setHintAfter] = useState(0);

  const filtered = useMemo(() => {
    let result = dataset;
    result = result.filter((c) => c.name.common.split(" ").length <= maxWords);
    if (maxLength > 0) result = result.filter((c) => c.name.common.length <= maxLength);
    return result;
  }, [dataset, maxWords, maxLength]);

  const wordLabels = { 1: "Single word only", 2: "Up to 2 words", 3: "Up to 3+ words" };

  const finalDataset = useMemo(() => {
    if (rounds <= 0 || rounds >= filtered.length) return filtered;
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, rounds);
  }, [filtered, rounds]);

  return (
    <div className="dark:text-white flex flex-col h-full w-11/12 max-w-md justify-center items-center mx-auto">
      <div className="flex flex-col bg-white/10 backdrop-blur-sm p-6 rounded-lg gap-5 w-full">
        <div className="text-center">
          <h1 className="font-bold text-3xl sm:text-4xl">Worldle</h1>
          <p className="text-sm opacity-60 mt-1">Guess the country name letter by letter</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="p-3 rounded border border-white/10">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">Word count</p>
              <span className="text-xs opacity-60">{wordLabels[maxWords]}</span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              value={maxWords}
              onChange={(e) => setMaxWords(parseInt(e.target.value))}
              className="w-full mt-2 accent-valid"
            />
            <div className="flex justify-between text-xs opacity-40 mt-1">
              <span>1</span>
              <span>2</span>
              <span>3+</span>
            </div>
          </div>

          <div className="p-3 rounded border border-white/10">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">Max letters</p>
              <span className="text-sm opacity-60">{maxLength === 0 ? "Any" : maxLength}</span>
            </div>
            <select
              value={maxLength}
              onChange={(e) => setMaxLength(parseInt(e.target.value))}
              className="w-full mt-1 px-2 py-1.5 rounded dark:bg-dark-mode-ligth dark:border text-sm"
            >
              <option value={0}>No limit</option>
              <option value={6}>6 letters (easy)</option>
              <option value={8}>8 letters</option>
              <option value={10}>10 letters</option>
              <option value={12}>12 letters</option>
            </select>
          </div>

          <div className="p-3 rounded border border-white/10">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">Rounds</p>
              <span className="text-sm opacity-60">{rounds === 0 ? "All" : rounds}</span>
            </div>
            <select
              value={rounds}
              onChange={(e) => setRounds(parseInt(e.target.value))}
              className="w-full mt-1 px-2 py-1.5 rounded dark:bg-dark-mode-ligth dark:border text-sm"
            >
              <option value={0}>All ({filtered.length})</option>
              <option value={5}>5 rounds</option>
              <option value={10}>10 rounds</option>
              <option value={20}>20 rounds</option>
            </select>
          </div>

          <div className="p-3 rounded border border-white/10">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-sm">Region hint</p>
              <span className="text-sm opacity-60">{hintAfter === 0 ? "Off" : `After ${hintAfter} tries`}</span>
            </div>
            <select
              value={hintAfter}
              onChange={(e) => setHintAfter(parseInt(e.target.value))}
              className="w-full mt-1 px-2 py-1.5 rounded dark:bg-dark-mode-ligth dark:border text-sm"
            >
              <option value={0}>No hints</option>
              <option value={2}>After 2 wrong guesses</option>
              <option value={3}>After 3 wrong guesses</option>
              <option value={4}>After 4 wrong guesses</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-center opacity-60">{finalDataset.length} countries to play</p>

        <button
          onClick={() => onStart(finalDataset, hintAfter)}
          disabled={finalDataset.length === 0}
          className="w-full py-3 rounded-lg border font-bold text-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-30"
        >
          Play
        </button>

        <Link to="/games" className="text-center text-sm opacity-50 hover:opacity-100 transition-opacity">
          ← Back to games
        </Link>
      </div>
    </div>
  );
}

export default function Worldle() {
  const rawDataset = useGameDataset();
  const [started, setStarted] = useState(false);
  const [dataset, setDataset] = useState([]);
  const [hintAfter, setHintAfter] = useState(0);

  const [countries, setCountries] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [letterInput, setLetterInput] = useState([]);
  const [gameState, setGameState] = useState("playing");
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [justTyped, setJustTyped] = useState(-1);
  const containerRef = useRef();

  useEffect(() => {
    document.title = "Where in the world? - Worldle";
  }, []);

  const handleStart = (filtered, hintConfig) => {
    setDataset(filtered);
    setCountries(filtered);
    setHintAfter(hintConfig);
    const first = filtered[getRandomInt(filtered.length)];
    setAnswer(first);
    setStarted(true);
  };

  useEffect(() => {
    if (started) containerRef.current?.focus();
  }, [started, guesses, gameState]);

  if (rawDataset.length <= 0) {
    return <Navigate replace to="/games" />;
  }

  if (!started || !answer) {
    return (
      <OptionsScreen
        dataset={rawDataset}
        onStart={handleStart}
      />
    );
  }

  const answerName = answer.name.common;
  const template = buildTemplate(answerName);
  const letterSlots = template.reduce((count, ch) => count + (ch === null ? 1 : 0), 0);

  // Dynamic cell size: fit within container, min 28px, max 48px
  const totalChars = answerName.length;
  const cellSize = Math.max(28, Math.min(48, Math.floor(320 / totalChars)));
  const spaceSize = Math.max(8, cellSize * 0.35);
  const fontSize = cellSize * 0.4;

  const buildGuess = (letters) => {
    let li = 0;
    return template.map((ch) => (ch !== null ? ch : letters[li++] || "")).join("");
  };

  const isFilled = letterInput.length === letterSlots;

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 1500);
  };

  const submitGuess = () => {
    if (gameState !== "playing") return;
    if (!isFilled) {
      setShake(true);
      showMessage(`Fill all ${letterSlots} letters`);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const full = buildGuess(letterInput);
    const newGuesses = [...guesses, full];
    setGuesses(newGuesses);
    setLetterInput([]);
    setJustTyped(-1);

    if (normalize(full) === normalize(answerName)) {
      setGameState("won");
      setStats((prev) => ({ correct: prev.correct + 1, wrong: prev.wrong }));
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setGameState("lost");
      setStats((prev) => ({ correct: prev.correct, wrong: prev.wrong + 1 }));
    }
  };

  const processKey = useCallback((key) => {
    if (gameState !== "playing") return;
    if (key === "Enter") {
      submitGuess();
    } else if (key === "Backspace") {
      setLetterInput((prev) => prev.slice(0, -1));
      setJustTyped(-1);
    } else if (key.length === 1 && /[a-zA-Z]/.test(key) && letterInput.length < letterSlots) {
      setLetterInput((prev) => {
        setJustTyped(prev.length);
        return [...prev, key];
      });
      setTimeout(() => setJustTyped(-1), 150);
    }
  }, [letterInput, letterSlots, gameState, submitGuess]);

  const handleKeyDown = (e) => {
    if (gameState !== "playing") return;
    if (e.key === "Enter") e.preventDefault();
    processKey(e.key);
  };

  const nextRound = () => {
    const remaining = countries.filter((c) => c.ccn3 !== answer.ccn3);
    if (remaining.length === 0) return;
    setCountries(remaining);
    setAnswer(remaining[getRandomInt(remaining.length)]);
    setGuesses([]);
    setLetterInput([]);
    setGameState("playing");
    setJustTyped(-1);
    containerRef.current?.focus();
  };

  const backToOptions = () => {
    setStarted(false);
    setGuesses([]);
    setLetterInput([]);
    setGameState("playing");
    setStats({ correct: 0, wrong: 0 });
    setJustTyped(-1);
    setHintAfter(0);
  };

  const isFinished = countries.length <= 1 && gameState !== "playing";

  const cellStyle = { width: cellSize, height: cellSize, fontSize };
  const spaceStyle = { width: spaceSize };

  const FixedCell = ({ ch, opacity = 0.5 }) => (
    <div
      className={`flex items-center justify-center font-bold border-2 rounded border-black/10 dark:border-white/10`}
      style={{ ...cellStyle, opacity }}
    >
      {ch}
    </div>
  );

  const EmptyCell = () => (
    <div className="border-2 rounded border-black/10 dark:border-white/10" style={cellStyle} />
  );

  const renderRow = (rowIndex) => {
    const isSubmitted = rowIndex < guesses.length;
    const isCurrent = rowIndex === guesses.length && gameState === "playing";

    if (isSubmitted) {
      const guess = guesses[rowIndex];
      const states = getLetterStates(guess, answerName);
      let cellIndex = 0;
      return (
        <div key={rowIndex} className="flex gap-0.5 justify-center flex-wrap">
          {template.map((fixed, i) => {
            if (fixed !== null) {
              if (fixed === " ") return <div key={i} style={spaceStyle} />;
              return <FixedCell key={i} ch={fixed} />;
            }
            const ci = cellIndex++;
            return <RevealCell key={`${rowIndex}-${i}`} ch={guess[i] || ""} state={states[i]} delay={ci * 120} size={cellSize} />;
          })}
        </div>
      );
    }

    if (isCurrent) {
      let letterIdx = 0;
      return (
        <div key={rowIndex} className={`flex gap-0.5 justify-center flex-wrap ${shake ? "animate-bounce" : ""}`}>
          {template.map((fixed, i) => {
            if (fixed !== null) {
              if (fixed === " ") return <div key={i} style={spaceStyle} />;
              return <FixedCell key={i} ch={fixed} />;
            }
            const li = letterIdx++;
            const ch = letterInput[li] || "";
            const isPop = li === justTyped;
            return (
              <div
                key={i}
                className={`flex items-center justify-center font-bold uppercase border-2 rounded transition-all duration-150 ${
                  ch ? "border-black/50 dark:border-white/50" : "border-black/20 dark:border-white/20"
                } ${isPop ? "scale-110" : ""}`}
                style={cellStyle}
              >
                {ch}
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div key={rowIndex} className="flex gap-0.5 justify-center flex-wrap">
        {template.map((fixed, i) => {
          if (fixed !== null) {
            if (fixed === " ") return <div key={i} style={spaceStyle} />;
            return <FixedCell key={i} ch={fixed} opacity={0.3} />;
          }
          return <EmptyCell key={i} />;
        })}
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="dark:text-white flex flex-col h-full w-11/12 max-w-2xl justify-center items-center mx-auto relative outline-none"
    >
      <div className="flex flex-col bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg gap-4 w-full">
        <div className="text-center">
          <h1 className="font-bold text-2xl sm:text-3xl">Worldle</h1>
          <p className="text-xs sm:text-sm opacity-60">
            Guess the country in {MAX_ATTEMPTS} tries · {letterSlots} letters
          </p>
        </div>

        {message && (
          <div className="text-center text-sm font-semibold bg-black/20 dark:bg-white/20 rounded py-1 px-3">
            {message}
          </div>
        )}

        {hintAfter > 0 && guesses.length >= hintAfter && gameState === "playing" && (
          <div className="text-center text-sm bg-valid/20 rounded py-1.5 px-3">
            <span className="opacity-60">Hint:</span> This country is in <span className="font-semibold">{answer.region}</span>
          </div>
        )}

        <div className="flex flex-col gap-1.5 items-center py-2">
          {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => renderRow(i))}
        </div>

        {gameState === "playing" && (
          <LetterTracker guesses={guesses} answerName={answerName} onKey={processKey} />
        )}

        {gameState !== "playing" && (
          <div className="flex flex-col items-center gap-3 py-2">
            <p className={`text-xl font-bold ${gameState === "won" ? "text-valid" : "text-invalid"}`}>
              {gameState === "won" ? "🎉 Correct!" : "😔 The answer was:"}
            </p>
            {gameState === "lost" && <p className="text-lg font-semibold">{answerName}</p>}
            <div className="flex gap-3">
              {!isFinished ? (
                <button onClick={nextRound} className="border py-2 px-4 rounded font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                  Next country
                </button>
              ) : (
                <button onClick={backToOptions} className="border py-2 px-4 rounded font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                  Play again
                </button>
              )}
              <Link to="/games" className="border py-2 px-4 rounded font-semibold hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                Menu
              </Link>
            </div>
            <div className="text-sm opacity-60">
              <span className="text-valid">✓ {stats.correct}</span>
              {" · "}
              <span className="text-invalid">✗ {stats.wrong}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
