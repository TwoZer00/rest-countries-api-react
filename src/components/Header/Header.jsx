import React from "react";
import { MoonIcon } from "@heroicons/react/outline";
import { MoonIcon as MoonIconSolid } from "@heroicons/react/solid";
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
    <header className="text-sm lg:text-base flex flex-row h-20 items-center bg-white dark:border-0 shadow-lg px-5 lg:px-10 dark:text-white dark:bg-dark-mode-ligth">
      <Link to={"/"} className="w-full font-bold">
        Where in the world?
      </Link>
      <nav className="w-auto">
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
      </nav>
    </header>
  );
};
