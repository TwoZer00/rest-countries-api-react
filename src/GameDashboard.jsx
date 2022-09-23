import React, { useContext } from "react";
import {
  FlagIcon,
  ViewListIcon,
  TrendingUpIcon,
  GlobeIcon,
} from "@heroicons/react/outline";
import { Link, redirect } from "react-router-dom";

export default function GameDashboard() {
  return (
    <div className="flex flex-col dark:text-white items-center justify-center gap-2 pt-2 h-full">
      <div className="p-5 rounded bg-white/10 backdrop-blur border-dark-mode-ligth shadow-lg">
        <div className="h-20">
          <div className="flex flex-row items-center gap-x-2 transition-colors">
            <h1 className="text-6xl font-bold">Let's play</h1>
            <GlobeIcon className="w-12 h-12" />
          </div>
        </div>
        <div className="flex flex-col">
          <Link
            to={"/guesstheflag"}
            className="border p-2 rounded shadow hover:bg-black/20 transition-all flex flex-row items-center justify-center gap-x-2"
          >
            Guess the Flag
            <FlagIcon className="w-5 h-5" />
          </Link>
          <small>Based on the country flag choose the correct option</small>
        </div>
        <div className="flex flex-col">
          <Link
            to={"/higherlower"}
            className="border p-2 rounded shadow hover:bg-black/20 transition-all flex flex-row items-center justify-center gap-x-2"
          >
            Higher or lower
            <TrendingUpIcon className="w-5 h-5" />
          </Link>
          <small>Based on the population choose the correct option</small>
        </div>
        <div className="flex flex-col">
          <Link
            to={"/guessthecountry"}
            className="border p-2 rounded shadow hover:bg-black/20 transition-all flex flex-row items-center justify-center gap-x-2"
          >
            Guess the country
            <ViewListIcon className="w-5 h-5" />
          </Link>
          <small>Based on the description name the correct country</small>
        </div>
      </div>
    </div>
  );
}
