import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Flag } from "./Flag";
import { Search } from "./Search";

const PAGE_SIZE = 20;
const REGIONS = { "1": "Africa", "2": "Americas", "3": "Asia", "4": "Europe", "5": "Oceania" };

export const Home = ({ data }) => {
  const [region, setRegion] = useState(null);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let result = data;
    if (region) {
      result = result.filter((d) => d.region === region);
    }
    if (search) {
      result = result.filter((d) => d.name.common.toLowerCase().includes(search));
    }
    return result;
  }, [data, region, search]);

  const handleRegionChange = (event) => {
    setRegion(REGIONS[event.target.value] || null);
    setVisible(PAGE_SIZE);
  };

  useEffect(() => {
    document.title = "Where in the world?";
  }, []);

  if (!data) return null;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:h-12 px-4 sm:px-10 gap-4 sm:gap-7 my-6 sm:my-8">
          <div className="w-full h-12">
            <Search onSearch={(value) => { setSearch(value); setVisible(PAGE_SIZE); }} />
          </div>
          <select
            className="h-12 w-full sm:w-1/2 lg:h-full bg-white dark:bg-dark-mode-ligth dark:text-white rounded shadow px-3"
            defaultValue="0"
            onChange={handleRegionChange}
          >
            <option value="0" disabled>Filter by region</option>
            <option value="1">Africa</option>
            <option value="2">America</option>
            <option value="3">Asia</option>
            <option value="4">Europe</option>
            <option value="5">Oceania</option>
            <option value="6">All</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full justify-items-center gap-8 sm:gap-16 px-4 sm:px-10 pb-10">
          {filtered.slice(0, visible).map((element) => (
            <Link
              key={element.ccn3}
              to={`/country/${element.ccn3}`}
              className="w-full"
            >
              <Flag data={element} />
            </Link>
          ))}
        </div>
        {visible < filtered.length && (
          <div className="flex justify-center pb-10">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="px-6 py-2 rounded shadow bg-white dark:bg-dark-mode-ligth dark:text-white font-semibold hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
