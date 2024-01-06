import {
  MoonIcon,
  PuzzlePieceIcon as PuzzleIcon,
} from "@heroicons/react/24/outline";
import {
  MoonIcon as MoonIconSolid,
  PuzzlePieceIcon as PuzzleIconSolid,
} from "@heroicons/react/24/solid";
import React from "react";
import { Link } from "react-router-dom";

export const Header = ({ dark, setDark }) => {
  const handleDark = () => {
    if (dark) {
      setDark(false);
      localStorage.setItem("dark", false);
    } else {
      setDark(true);
      localStorage.setItem("dark", true);
    }
  };
  return (
    <header className="fixed w-full text-sm lg:text-base transition-colors flex flex-row h-20 items-center bg-white/10 backdrop-blur-sm dark:border-0 shadow-lg px-5 lg:px-10 dark:text-white dark:bg-dark-mode-ligth/20">
      <div className="w-full">
        <Link to={"/"} className="font-bold flex flex-row items-center gap-2">
          <img
            src={dark ? "/wiw1.svg" : "wiw.svg"}
            alt="Where in the world logo"
            className={`w-auto h-8 lg:h-10 ${dark ? "bg-white" : "bg-black"} rounded-full p-1 background`}
          />
          Where in the world?
        </Link>
      </div>
      <nav className="w-auto flex flex-row gap-x-2">
        <button
          className="whitespace-nowrap font-semibold flex flex-row gap-x-2 items-center"
          onClick={handleDark}
        >
          {dark ? (
            <MoonIconSolid className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
          Dark mode
        </button>
        <Link
          to={"/games"}
          className="font-semibold flex flex-row gap-x-2 items-center"
        >
          {dark ? (
            <PuzzleIconSolid className="w-5 h-5"></PuzzleIconSolid>
          ) : (
            <PuzzleIcon className="w-5 h-5"></PuzzleIcon>
          )}
          Play
        </Link>
        <a
          className="font-bold"
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
