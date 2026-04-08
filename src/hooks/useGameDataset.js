import { useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DataContext } from "../App";
import { unMemberFilter } from "../utils";

const REGION_FILTERS = {
  americas: (c) => c.region === "Americas",
  europe: (c) => c.region === "Europe",
  africa: (c) => c.region === "Africa",
  asiania: (c) => c.region === "Asia" || c.region === "Oceania",
};

const DURATION_DIVIDERS = { small: 3, medium: 2, complete: 1 };

export function useGameDataset() {
  const allData = useContext(DataContext);
  const [searchParams] = useSearchParams();
  const region = searchParams.get("region") || "world";
  const duration = searchParams.get("duration") || "complete";
  const includeTerritories = searchParams.get("territories") === "true";

  return useMemo(() => {
    const base = includeTerritories ? allData : unMemberFilter(allData);
    const regionFilter = REGION_FILTERS[region];
    const byRegion = regionFilter ? base.filter(regionFilter) : base;
    const divider = DURATION_DIVIDERS[duration] || 1;
    if (divider === 1) return byRegion;
    const count = Math.round(byRegion.length / divider);
    const shuffled = [...byRegion].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, [allData, region, duration, includeTerritories]);
}
