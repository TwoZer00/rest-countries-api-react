import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Flag } from "./Flag";
import { Search } from "./Search";

const PAGE_SIZE = 20;

export const Home = ({ data }) => {
  const [filtered, setFiltered] = useState(data);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const handleChange = (event) => {
    const regions = { "1": "Africa", "2": "Americas", "3": "Asia", "4": "Europe", "5": "Oceania" };
    const region = regions[event.target.value];
    if (region) {
      setFiltered(data.filter((d) => d.region === region));
    } else {
      setFiltered([...data]);
    }
    setVisible(PAGE_SIZE);
  };

  useEffect(() => {
    document.title = "Where in the world?";
  }, []);

  useEffect(() => {
    if (data) setFiltered([...data]);
  }, [data]);

  if (!filtered) return null;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:h-12 px-10 gap-7 my-8">
          <div className="w-full h-12">
            <Search data={filtered} setData={setFiltered} />
          </div>
          <select
            className="h-12 w-1/2 lg:h-full bg-white dark:bg-dark-mode-ligth dark:text-white rounded shadow px-3"
            defaultValue="0"
            onChange={handleChange}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full justify-items-center gap-16 px-10 pb-10">
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
