import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./components/Main/Home";
import Detailed from "./components/Main/Detailed";
import NotFound from "./components/NotFound";
import { useState, useEffect, createContext } from "react";
import Game from "./games/Game";
import FlagModeSelect from "./games/FlagModeSelect";
import GameDashboard from "./games/GameDashboard";
import GameC from "./games/GameC";
import GameHL from "./games/GameHL";
import Worldle from "./games/Worldle";
import GameBingo from "./games/GameBingo";
import { getOverview } from "./services/api";
export const DataContext = createContext();
export const DarkContext = createContext();
function App() {
  const [data, setData] = useState(
    localStorage.getItem("data")
      ? JSON.parse(localStorage.getItem("data"))
      : undefined
  );
  const [dark, setDark] = useState(
    localStorage.getItem("dark") === "true" ? true : false
  );

  useEffect(() => {
    const getData = async () => {
      let dataB = await getOverview();
      setData(dataB);
    };
    if (!data) {
      getData();
    }
  }, []);
  if (!data) {
    return (
      <div className={`${dark ? "dark" : ""}`}>
        <div className="flex flex-col min-h-screen h-screen dark:bg-dark-fe background transition-colors items-center justify-center">
          <p className="text-xl font-semibold dark:text-white animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DarkContext.Provider value={{ dark, setDark }}>
      <div className={`${dark ? "dark" : ""}`}>
        <div
          className={`flex flex-col min-h-screen h-screen dark:bg-dark-fe background transition-colors`}
        >
          <Header />
          <div className="h-full overflow-auto pt-16 sm:pt-20">
            <DataContext.Provider value={data}>
              <Routes>
                <Route path="/" element={<Home data={data} />} />
                <Route path="/country/:id" element={<Detailed data={data} />} />
                <Route path="/games" element={<GameDashboard />} />
                <Route path="/guesstheflag" element={<FlagModeSelect />} />
                <Route path="/guesstheflag/:mode" element={<Game />} />
                <Route path="/guessthecountry" element={<GameC />} />
                <Route path="/higherlower" element={<GameHL />} />
                <Route path="/worldle" element={<Worldle />} />
                <Route path="/borderbingo" element={<GameBingo />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </DataContext.Provider>
          </div>
        </div>
      </div>
    </DarkContext.Provider>
    );
}

export default App;
