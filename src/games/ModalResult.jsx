import { Link } from "react-router-dom";

export default function ModalResult({ points, reset }) {
  const record = parseInt(localStorage.getItem("GameHL") ?? "0", 10);
  const isNewRecord = points > record;

  return (
    <div className="w-full h-full bg-dark-mode-ligth/60 backdrop-blur absolute top-0 left-0 z-50 flex flex-col justify-center items-center">
      <div className="dark:bg-dark-fe/70 bg-white/40 backdrop-blur w-full max-w-sm rounded-lg shadow-lg p-6 flex flex-col gap-4 mx-4 dark:text-white">
        <h1 className="text-3xl font-bold text-center">Game over!</h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-5xl font-bold">{points}</p>
          <p className="text-sm opacity-60">streak</p>
          {isNewRecord && (
            <p className="text-valid font-semibold animate-bounce">🎉 New record!</p>
          )}
        </div>
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex flex-col items-center">
            <span className="font-bold text-lg">{Math.max(record, points)}</span>
            <span className="opacity-60">Best</span>
          </div>
        </div>
        <div className="flex justify-center gap-4 text-sm pt-2">
          <Link
            to="/games"
            className="border py-2 px-4 rounded hover:bg-white/20 transition-all"
          >
            Menu
          </Link>
          <button
            onClick={reset}
            className="border py-2 px-4 rounded hover:bg-white/20 transition-all"
          >
            Play again
          </button>
        </div>
      </div>
    </div>
  );
}
