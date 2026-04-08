import { Link } from "react-router-dom";

export default function Modal({ title, desc, again, score, record, results }) {
  const total = score[0] !== undefined ? score[0] + score[1] : 0;
  const accuracy = total > 0 ? Math.round((score[0] / total) * 100) : 0;

  return (
    <div className="absolute h-full w-screen flex flex-col items-center justify-center top-0 bg-dark-mode-ligth/60 z-50 dark:text-white">
      <div className="dark:bg-dark-fe/70 bg-white/40 backdrop-blur w-full max-w-md rounded-lg shadow-lg p-5 flex flex-col gap-4 mx-4">
        <h2 className="text-xl font-semibold text-center">{title}</h2>
        <p className="text-center text-sm opacity-80">{desc}</p>

        {score[1] !== undefined ? (
          <div className="flex flex-col items-center gap-1">
            <div className="flex justify-center gap-6 font-semibold">
              <span className="text-valid">✓ {score[0]}</span>
              <span className="text-invalid">✗ {score[1]}</span>
            </div>
            <span className="text-sm opacity-60">{accuracy}% accuracy</span>
          </div>
        ) : (
          <div className="flex gap-4 justify-center font-semibold">
            <span>Score: {score}</span>
            <span>Record: {record}</span>
          </div>
        )}

        {results && results.length > 0 && (
          <div className="flex flex-col max-h-[250px] overflow-auto rounded border dark:border-dark-mode-ligth">
            {results.map((round, ri) => {
              const wasCorrect = round.selected?.ccn3 === round.correct.ccn3;
              const wasSkipped = !round.selected;
              return (
                <div
                  key={ri}
                  className={`flex items-center gap-3 px-3 py-2 border-b dark:border-dark-mode-ligth/50 last:border-b-0 ${
                    wasCorrect ? "bg-valid/10" : wasSkipped ? "bg-white/5" : "bg-invalid/10"
                  }`}
                >
                  <span className="text-xs opacity-40 w-5 shrink-0">{ri + 1}</span>
                  <img
                    src={round.correct.flags.svg}
                    alt={round.correct.name.common}
                    className="w-10 h-7 object-contain shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm truncate">{round.correct.name.common}</span>
                    {wasSkipped ? (
                      <span className="text-xs opacity-50">Skipped</span>
                    ) : !wasCorrect ? (
                      <span className="text-xs text-invalid truncate">Answered: {round.selected.name.common}</span>
                    ) : null}
                  </div>
                  <span className="ml-auto shrink-0">
                    {wasCorrect ? "✓" : wasSkipped ? "—" : "✗"}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-center gap-4 text-sm">
          <Link
            to="/games"
            className="border py-2 px-4 rounded hover:bg-white/20 transition-all"
          >
            Menu
          </Link>
          <button
            onClick={again}
            className="border py-2 px-4 rounded hover:bg-white/20 transition-all"
          >
            Play again
          </button>
        </div>
      </div>
    </div>
  );
}
