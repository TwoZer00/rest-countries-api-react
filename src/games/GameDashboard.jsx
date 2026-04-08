import {
  FlagIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ListBulletIcon as ViewListIcon,
  LanguageIcon,
} from "@heroicons/react/24/outline";
import {
  FlagIcon as FlagIconSolid,
  ArrowTrendingUpIcon as TrendingUpIconSolid,
  ListBulletIcon as ViewListIconSolid,
  LanguageIcon as LanguageIconSolid,
} from "@heroicons/react/24/solid";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../App";
import { unMemberFilter } from "../utils";

const REGIONS = {
  world: { label: "World", filter: () => true },
  americas: { label: "Americas", filter: (c) => c.region === "Americas" },
  europe: { label: "Europe", filter: (c) => c.region === "Europe" },
  africa: { label: "Africa", filter: (c) => c.region === "Africa" },
  asiania: { label: "Asia & Oceania", filter: (c) => c.region === "Asia" || c.region === "Oceania" },
};

const DURATIONS = {
  complete: { label: "All", divider: 1 },
  medium: { label: "Half", divider: 2 },
  small: { label: "Third", divider: 3 },
};

export default function GameDashboard({ dark }) {
  const allContext = useContext(DataContext);
  const [region, setRegion] = useState("world");
  const [duration, setDuration] = useState("complete");
  const [territories, setTerritories] = useState(false);


  useEffect(() => {
    document.title = "Where in the world? - Games";
  }, []);

  const filteredData = useMemo(() => {
    const base = territories ? allContext : unMemberFilter(allContext);
    const byRegion = base.filter(REGIONS[region].filter);
    const count = Math.round(byRegion.length / DURATIONS[duration].divider);
    if (duration === "complete") return byRegion;
    const shuffled = [...byRegion].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, [allContext, region, duration, territories]);

  const countryCount = filteredData.length;

  const gameLink = (path) =>
    `${path}?region=${region}&duration=${duration}${territories ? "&territories=true" : ""}`;

  const GameCard = ({ to, icon: Icon, iconSolid: IconSolid, title, description }) => (
    <Link
      to={to}
      className="border p-4 rounded-lg shadow hover:bg-black/10 dark:hover:bg-white/10 transition-all flex flex-col gap-1"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-lg">{title}</span>
        {dark ? <IconSolid className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
      </div>
      <small className="opacity-70">{description}</small>
    </Link>
  );

  return (
    <div className="flex flex-col dark:text-white items-center justify-center h-full px-4">
      <div className="p-6 rounded-lg bg-white/10 backdrop-blur shadow-lg flex flex-col gap-6 w-full max-w-md">
        <h1 className="text-4xl sm:text-5xl font-bold text-center">Let's play</h1>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="region" className="text-xs font-semibold uppercase opacity-60">Region</label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="px-2 py-2 rounded dark:bg-dark-mode-ligth dark:border w-full"
              >
                {Object.entries(REGIONS).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="duration" className="text-xs font-semibold uppercase opacity-60">Duration</label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="px-2 py-2 rounded dark:bg-dark-mode-ligth dark:border w-full"
              >
                {Object.entries(DURATIONS).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-sm text-center opacity-60">
            {countryCount} countries selected
          </p>
          <label className="flex items-center gap-2 justify-center cursor-pointer">
            <input
              type="checkbox"
              checked={territories}
              onChange={(e) => setTerritories(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm">Include territories</span>
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <GameCard
            to={gameLink("/guesstheflag")}
            icon={FlagIcon}
            iconSolid={FlagIconSolid}
            title="Guess the Flag"
            description="See a flag, pick the correct country name"
          />
          <GameCard
            to={gameLink("/guessthecountry")}
            icon={ViewListIcon}
            iconSolid={ViewListIconSolid}
            title="Guess the Country"
            description="Read the clues, name the correct country"
          />
          <GameCard
            to={gameLink("/worldle")}
            icon={LanguageIcon}
            iconSolid={LanguageIconSolid}
            title="Worldle"
            description="Guess the country name letter by letter"
          />
        </div>

        <div className="flex flex-col gap-3 pt-3 border-t border-white/20">
          <GameCard
            to="/higherlower"
            icon={TrendingUpIcon}
            iconSolid={TrendingUpIconSolid}
            title="Higher or Lower"
            description="Compare populations — guess which is bigger"
          />
        </div>
      </div>
    </div>
  );
}
