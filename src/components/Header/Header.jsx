import {
  MoonIcon,
  PuzzlePieceIcon as PuzzleIcon,
} from "@heroicons/react/24/outline";
import {
  MoonIcon as MoonIconSolid,
  PuzzlePieceIcon as PuzzleIconSolid,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export const Header = ({ dark, setDark }) => {
  const handleDark = () => {
    setDark(!dark);
    localStorage.setItem("dark", !dark);
  };

  return (
    <header className="fixed w-full z-50 text-sm lg:text-base transition-colors flex flex-row h-16 sm:h-20 items-center bg-white/10 backdrop-blur-sm dark:border-0 shadow-lg px-4 sm:px-5 lg:px-10 dark:text-white dark:bg-dark-mode-ligth/20">
      <div className="flex-1 min-w-0">
        <Link to="/" className="font-bold flex flex-row items-center gap-2">
          <img
            src={dark ? "/wiw1.svg" : "/wiw.svg"}
            alt="Where in the world logo"
            className={`w-auto h-7 sm:h-8 lg:h-10 ${dark ? "bg-white" : "bg-black"} rounded-full p-1 shrink-0`}
          />
          <span className="hidden sm:inline truncate">Where in the world?</span>
        </Link>
      </div>
      <nav className="flex flex-row gap-x-3 sm:gap-x-4 items-center shrink-0">
        <button
          className="font-semibold flex flex-row gap-x-1 items-center"
          onClick={handleDark}
          aria-label="Toggle dark mode"
        >
          {dark ? <MoonIconSolid className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          <span className="hidden sm:inline">Dark mode</span>
        </button>
        <Link
          to="/games"
          className="font-semibold flex flex-row gap-x-1 items-center"
        >
          {dark ? <PuzzleIconSolid className="w-5 h-5" /> : <PuzzleIcon className="w-5 h-5" />}
          <span className="hidden sm:inline">Play</span>
        </Link>
        <a
          className="font-bold hidden md:inline"
          href="https://twozer00.dev"
          target="_blank"
          rel="noreferrer"
        >
          twozer00.dev
        </a>
      </nav>
    </header>
  );
};
