import { useContext, useMemo, useState, useCallback } from "react";
import { DataContext } from "../App";
import GameLayout from "./GameLayout";
import Button from "../components/Button";
import usePageMeta from "../hooks/usePageMeta";
import { getRandomInt } from "../utils";

const GRID_SIZE = 3;

let lastHub = null;

function generateBoard(countries) {
  const byCode = Object.fromEntries(countries.map((c) => [c.cca3, c]));
  const withBorders = countries.filter((c) => c.borders && c.borders.length >= 3);

  // Build neighbor sets
  const neighbors = {};
  for (const c of withBorders) {
    neighbors[c.cca3] = new Set(c.borders);
  }

  // Get all valid hubs, shuffled, avoiding the last used one
  const hubs = withBorders
    .filter((c) => c.borders.length >= GRID_SIZE * 2 && c.cca3 !== lastHub)
    .sort(() => Math.random() - 0.5);

  for (const seed of hubs) {
    // Get valid neighbors and shuffle them
    const seedNeighbors = seed.borders
      .map((code) => byCode[code])
      .filter((c) => c && c.borders && c.borders.length >= 2)
      .sort(() => Math.random() - 0.5);

    if (seedNeighbors.length < GRID_SIZE * 2) continue;

    // Try multiple row/col splits from this hub's neighbors
    for (let split = 0; split < 10; split++) {
      const reshuffled = [...seedNeighbors].sort(() => Math.random() - 0.5);
      const rows = reshuffled.slice(0, GRID_SIZE);
      const cols = reshuffled.slice(GRID_SIZE, GRID_SIZE * 2);

      if (rows.some((r) => cols.find((c) => c.cca3 === r.cca3))) continue;

      // Validate: for each cell, find countries that border both
      const solutions = [];
      let valid = true;
      for (let r = 0; r < GRID_SIZE; r++) {
        solutions[r] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
          const rowBorders = neighbors[rows[r].cca3] || new Set();
          const colBorders = neighbors[cols[c].cca3] || new Set();
          const shared = [...rowBorders].filter((code) => colBorders.has(code));
          if (shared.length === 0) {
            valid = false;
            break;
          }
          solutions[r][c] = shared;
        }
        if (!valid) break;
      }
      if (valid) {
        lastHub = seed.cca3;
        return { rows, cols, solutions, byCode };
      }
    }
  }
  return null;
}

export default function GameBingo() {
  const data = useContext(DataContext);

  usePageMeta(
    "Where in the world? - Border Bingo",
    "Select countries that share borders with both the row and column countries."
  );

  const [board, setBoard] = useState(() => generateBoard(data));
  const [selected, setSelected] = useState(
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null))
  );
  const [revealed, setRevealed] = useState(
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false))
  );
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Pool of selectable countries (all with borders, excluding row/col headers)
  const pool = useMemo(() => {
    if (!board) return [];
    const excluded = new Set([
      ...board.rows.map((c) => c.cca3),
      ...board.cols.map((c) => c.cca3),
    ]);
    return data
      .filter((c) => c.borders && c.borders.length > 0 && !excluded.has(c.cca3))
      .sort((a, b) => a.name.common.localeCompare(b.name.common));
  }, [board, data]);

  const [activeCell, setActiveCell] = useState(null);
  const [search, setSearch] = useState("");

  const filteredPool = useMemo(() => {
    if (!search) return pool.slice(0, 20);
    const q = search.toLowerCase();
    return pool.filter((c) => c.name.common.toLowerCase().includes(q)).slice(0, 20);
  }, [pool, search]);

  const handleCellClick = (r, c) => {
    if (revealed[r][c] || gameOver) return;
    setActiveCell({ r, c });
    setSearch("");
  };

  const handleSelect = (country) => {
    if (!activeCell || gameOver) return;
    const { r, c } = activeCell;
    const isCorrect = board.solutions[r][c].includes(country.cca3);

    const newSelected = selected.map((row) => [...row]);
    newSelected[r][c] = { country, correct: isCorrect };
    setSelected(newSelected);

    const newRevealed = revealed.map((row) => [...row]);
    newRevealed[r][c] = true;
    setRevealed(newRevealed);

    if (isCorrect) setScore((s) => s + 1);
    setActiveCell(null);
    setSearch("");

    // Check if game is over
    const totalRevealed = newRevealed.flat().filter(Boolean).length;
    if (totalRevealed === GRID_SIZE * GRID_SIZE) setGameOver(true);
  };

  const restart = () => {
    const newBoard = generateBoard(data);
    setBoard(newBoard);
    setSelected(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)));
    setRevealed(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false)));
    setGameOver(false);
    setScore(0);
    setActiveCell(null);
  };

  if (!board) {
    return (
      <GameLayout>
        <p className="text-center">Could not generate a valid board. Try again.</p>
        <Button onClick={restart}>Retry</Button>
      </GameLayout>
    );
  }

  return (
    <GameLayout className="!max-w-xl">
      <h1 className="font-bold text-2xl sm:text-3xl text-center">Border Bingo</h1>
      <p className="text-xs sm:text-sm text-center opacity-60">
        Pick a country that borders both the row and column country
      </p>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `60px repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `50px repeat(${GRID_SIZE}, 70px)`,
            minWidth: "300px",
          }}
        >
          {/* Empty top-left corner */}
          <div />

          {/* Column headers */}
          {board.cols.map((country) => (
            <div
              key={country.cca3}
              className="flex flex-col items-center justify-center text-center p-1"
            >
              <img
                src={country.flags.svg}
                alt={country.name.common}
                className="w-8 h-5 object-contain"
              />
              <span className="text-xs font-medium leading-tight mt-1">
                {country.name.common}
              </span>
            </div>
          ))}

          {/* Rows */}
          {board.rows.map((rowCountry, r) => (
            <>
              {/* Row header */}
              <div
                key={`rh-${rowCountry.cca3}`}
                className="flex flex-col items-center justify-center text-center p-1"
              >
                <img
                  src={rowCountry.flags.svg}
                  alt={rowCountry.name.common}
                  className="w-8 h-5 object-contain"
                />
                <span className="text-xs font-medium leading-tight mt-1">
                  {rowCountry.name.common}
                </span>
              </div>

              {/* Cells */}
              {board.cols.map((_, c) => {
                const cell = selected[r][c];
                const isActive =
                  activeCell && activeCell.r === r && activeCell.c === c;
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    disabled={revealed[r][c]}
                    className={`border rounded flex items-center justify-center text-xs p-1 transition-all cursor-pointer
                      ${isActive ? "ring-2 ring-black/30 dark:ring-white/30 bg-black/5 dark:bg-white/10" : ""}
                      ${cell?.correct ? "bg-valid/20 border-valid" : ""}
                      ${cell && !cell.correct ? "bg-invalid/20 border-invalid" : ""}
                      ${!cell && !isActive ? "bg-white/5 hover:bg-white/10 dark:hover:bg-white/10" : ""}
                    `}
                  >
                    {cell && (
                      <div className="flex flex-col items-center">
                        <img
                          src={cell.country.flags.svg}
                          className="w-6 h-4 object-contain"
                          alt=""
                        />
                        <span className="leading-tight mt-0.5 truncate max-w-[70px]">
                          {cell.country.name.common}
                        </span>
                      </div>
                    )}
                    {!cell && "?"}
                  </button>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Country picker */}
      {activeCell && !gameOver && (
        <div className="flex flex-col gap-2 border-t pt-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country..."
            autoFocus
            className="shadow rounded-lg p-2 bg-white dark:bg-dark-mode-light border outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          />
          <div className="max-h-40 overflow-y-auto flex flex-col gap-1">
            {filteredPool.map((country) => (
              <button
                key={country.cca3}
                onClick={() => handleSelect(country)}
                className="text-left px-3 py-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-sm flex items-center gap-2"
              >
                <img
                  src={country.flags.svg}
                  className="w-5 h-3 object-contain"
                  alt=""
                />
                {country.name.common}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Score / Game Over */}
      {gameOver && (
        <div className="flex flex-col items-center gap-2 border-t pt-3">
          <p className="text-lg font-bold">
            {score}/{GRID_SIZE * GRID_SIZE} correct!
          </p>
          <div className="flex gap-3">
            <Button to="/games">Menu</Button>
            <Button onClick={restart}>Play again</Button>
          </div>
        </div>
      )}

      {!gameOver && !activeCell && (
        <p className="text-xs text-center opacity-50">
          Tap a cell to pick a country • {score}/{GRID_SIZE * GRID_SIZE}
        </p>
      )}
    </GameLayout>
  );
}
