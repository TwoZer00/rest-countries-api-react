import React, { useContext, useEffect } from "react";
import {
  FlagIcon,
  ListBulletIcon as ViewListIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  GlobeAmericasIcon as GlobeIcon,
} from "@heroicons/react/24/outline";
import {
  FlagIcon as FlagIconSolid,
  ListBulletIcon as ViewListIconSolid,
  ArrowTrendingUpIcon as TrendingUpIconSolid,
  GlobeAmericasIcon as GlobeIconSolid,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export default function GameDashboard({ dark }) {
  useEffect(() => {
    document.title = `Where in the world? - Games`;
  }, []);
  return (
    <div className="flex flex-col dark:text-white items-center justify-center gap-2 pt-2 h-full">
      <div className="p-5 rounded bg-white/10 backdrop-blur border-dark-mode-ligth shadow-lg">
        <div className="h-20">
          <div className="flex flex-row items-center gap-x-2 transition-colors">
            <h1 className="text-6xl font-bold">Let's play</h1>
            {dark ? (
              <GlobeIconSolid className="w-12 h-12" />
            ) : (
              <GlobeIcon className="w-12 h-12" />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <Link
            to={"/guesstheflag"}
            className="border p-2 rounded shadow hover:bg-black/20 transition-all flex flex-row items-center justify-center gap-x-2"
          >
            Guess the Flag
            {dark ? (
              <FlagIconSolid className="w-5 h-5" />
            ) : (
              <FlagIcon className="w-5 h-5" />
            )}
          </Link>
          <small className="text-center">
            Based on the country flag choose the correct option
          </small>
        </div>
        <div className="flex flex-col">
          <Link
            to={"/higherlower"}
            className="border p-2 rounded shadow hover:bg-black/20 transition-all flex flex-row items-center justify-center gap-x-2"
          >
            Higher or lower
            {dark ? (
              <TrendingUpIconSolid className="w-5 h-5" />
            ) : (
              <TrendingUpIcon className="w-5 h-5" />
            )}
          </Link>
          <small className="text-center">
            Based on the population choose the correct option
          </small>
        </div>
        <div className="flex flex-col">
          <Link
            to={"/guessthecountry"}
            className="border p-2 rounded shadow hover:bg-black/20 transition-all flex flex-row items-center justify-center gap-x-2"
          >
            Guess the country
            {dark ? (
              <ViewListIconSolid className="w-5 h-5" />
            ) : (
              <ViewListIcon className="w-5 h-5" />
            )}
          </Link>
          <small className="text-center">
            Based on the description name the correct country
          </small>
        </div>
      </div>
    </div>
  );
}
