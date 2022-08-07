import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Home } from "./components/Main/Home";
import { Detailed } from "./components/Main/Detailed";
import { useState, useEffect } from "react";
import { getAll } from "./utils.js";
function App() {
  const [data, setData] = useState();
  const [dark, setDark] = useState(
    localStorage.getItem("dark") === "true" ? true : false
  );

  // console.log(localStorage.getItem("dark"));
  useEffect(() => {
    const getData = async () => {
      setData(await getAll());
    };
    getData();
  }, []);

  return (
    <div className={`${dark ? "dark" : ""}`}>
      <div
        className={`flex flex-col min-h-screen h-full antialiased dark:bg-dark-fe`}
      >
        <Header dark={dark} setDark={setDark} />
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/country/:id" element={<Detailed data={data} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
