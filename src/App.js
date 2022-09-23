import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Home } from "./components/Main/Home";
import { Detailed } from "./components/Main/Detailed";
import { useState, useEffect, createContext } from "react";
import { getAll } from "./utils.js";
import Game from "./Game";
import GameDashboard from "./GameDashboard";
import GameC from "./GameC";
import GameHL from "./GameHL";
export const DataContext = createContext();
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
      let dataB = await getAll();
      setData(dataB);
      localStorage.setItem("data", JSON.stringify(dataB));
    };
    if (!data) {
      getData();
    }
  }, []);
  //
  if (data) {
    return (
      <div className={`${dark ? "dark" : ""}`}>
        <div
          className={`flex flex-col min-h-screen h-screen dark:bg-dark-fe background transition-colors`}
        >
          <Header dark={dark} setDark={setDark} />
          <div className="h-full overflow-auto pt-20">
            <DataContext.Provider value={data}>
              <Routes>
                <Route path="/" element={<Home data={data} />} />
                <Route path="/country/:id" element={<Detailed data={data} />} />
                <Route path="/games" element={<GameDashboard dark={dark} />} />
                <Route path="/guesstheflag" element={<Game data={data} />} />
                <Route path="/guessthecountry" element={<GameC />} />
                <Route path="/higherlower" element={<GameHL />} />
              </Routes>
            </DataContext.Provider>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
