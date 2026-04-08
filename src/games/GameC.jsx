import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { DataContext } from "../App";
import Hint from "./Hint";
import { useOutsideAlerter } from "../hooks/useOutsideAlerter";
import lossSound from "../resources/loss_sound.wav";
import winSound from "../resources/win_sound.wav";
import { randomCountryPosition, unMemberFilter } from "../utils";
import { getCountryDetails } from "../services/api";
import { useGameDataset } from "../hooks/useGameDataset";

export default function GameC() {
  const dataset = useGameDataset();
  const data = unMemberFilter(useContext(DataContext));
  const [countries, setCountries] = useState(dataset);
  const [randomCountry, setRandomCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(10);
  const [optionsSearch, setOptionsSearch] = useState(data);
  const [visible, setVisible] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [valid, setValid] = useState(undefined);

  const dropdownRef = useRef();
  const audioRef = useRef();
  const formRef = useRef();
  useOutsideAlerter(dropdownRef, setVisible);

  useEffect(() => {
    document.title = "Where in the world? - Guess the country";
  }, []);

  useEffect(() => {
    if (!randomCountry) {
      fetchNextCountry(dataset);
    }
  }, []);

  const fetchNextCountry = async (pool) => {
    if (pool.length === 0) return;
    setLoading(true);
    const temp = pool[randomCountryPosition(pool.length)];
    const details = await getCountryDetails(temp.ccn3);
    setRandomCountry(details);
    setLoading(false);
  };

  const handleSubmit = (e, form) => {
    setVisible(false);
    setShowResult(true);
    let value;
    if (e) {
      e.preventDefault();
      value = optionsSearch[0]?.name.common;
      if (!value) return;
      formRef.current.country.value = value;
    } else {
      value = form.country.value;
    }

    const isCorrect = value.toLowerCase() === randomCountry.name.common.toLowerCase();
    if (isCorrect) {
      setScore((prev) => prev + totalScore);
      setValid(true);
      audioRef.current.src = winSound;
      audioRef.current.play();
    } else {
      setValid(false);
      audioRef.current.src = lossSound;
      audioRef.current.play();
    }

    const remaining = countries.filter(
      (c) => c.name.common !== randomCountry.name.common
    );

    setTimeout(() => {
      setCountries(remaining);
      if (e) e.target.reset();
      else form.reset();
      setShowResult(false);
      setValid(undefined);
      setOptionsSearch(data);
      setTotalScore(10);
      fetchNextCountry(remaining);
    }, 2000);
  };

  const selectOption = (name) => {
    formRef.current.country.value = name;
    setVisible(false);
    handleSubmit(undefined, formRef.current);
  };

  const handleSearch = (e) => {
    setVisible(true);
    dropdownRef.current.scroll(0, 0);
    const value = e.target.value;
    if (value.length > 0) {
      const filtered = data
        .filter((c) => c.name.common.toLowerCase().includes(value.toLowerCase()))
        .sort((a, b) => a.name.common.localeCompare(b.name.common));
      setOptionsSearch(filtered);
    } else {
      setOptionsSearch(data);
    }
  };

  const startAgain = async () => {
    setCountries(dataset);
    setScore(0);
    setTotalScore(10);
    setValid(undefined);
    setShowResult(false);
    setOptionsSearch(data);
    formRef.current?.reset();
    fetchNextCountry(dataset);
  };

  if (loading && !randomCountry) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xl font-semibold dark:text-white animate-pulse">Loading...</p>
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto dark:text-white">
        <div className="flex flex-col gap-3 items-center justify-center w-full max-w-md p-6 bg-white/10 backdrop-blur rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold">Game over</h1>
          <p className="text-lg">Your score: {score}</p>
          <div className="flex gap-3">
            <button onClick={startAgain} className="border rounded px-4 py-1 hover:bg-black/10 transition-colors">
              Play again
            </button>
            <Link to="/games" className="border rounded px-4 py-1 hover:bg-black/10 transition-colors">
              Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:text-white h-full flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto">
      <div className="flex w-full flex-col bg-white/10 backdrop-blur-sm lg:w-fit p-4 rounded-lg">
        <div className="text-center">
          <h1 className="font-bold text-4xl">What's the country?</h1>
          <small>
            Click boxes for more details, every box has a cost that reduces your score.
          </small>
        </div>
        <div className="flex flex-col lg:flex-row gap-x-8 items-center p-4">
          <div className="flex flex-col gap-4 items-center justify-center w-full">
            <div className="flex flex-row items-stretch w-full">
              <form
                onSubmitCapture={handleSubmit}
                ref={formRef}
                className="w-full"
              >
                <div
                  className={`relative group shadow ${
                    valid === true
                      ? "bg-valid"
                      : valid === false
                        ? "bg-invalid"
                        : "bg-white dark:bg-dark-mode-ligth"
                  } w-full rounded`}
                >
                  <div>
                    <input
                      list="countries"
                      id="country"
                      name="country"
                      className={`${
                        valid !== undefined ? "text-white" : ""
                      } text-xl py-2 bg-white/0 w-full ${
                        visible ? "rounded-b-none" : ""
                      } border-none px-2 outline-none`}
                      placeholder="Search country"
                      disabled={showResult || loading}
                      autoComplete="off"
                      onInputCapture={handleSearch}
                      onFocusCapture={() => setVisible(true)}
                    />
                  </div>
                  <div
                    ref={dropdownRef}
                    className={`absolute z-10 top-full w-full max-h-[100px] bg-white text-black dark:text-white dark:bg-dark-mode-ligth shadow rounded-b-md overflow-auto px-2 flex-col divide-y divide-black/20 dark:divide-white/20 ${
                      visible ? "flex" : "hidden"
                    }`}
                  >
                    {optionsSearch.map((element, index) => (
                      <button
                        type="button"
                        key={index}
                        className="flex flex-row gap-x-2 text-xl items-center w-full hover:bg-black/20 hover:cursor-pointer px-2 py-0.5 text-left"
                        onClick={() => selectOption(element.name.common)}
                      >
                        <span>{element.flag}</span>
                        <span>{element.name.common}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full justify-items-center">
              <Hint
                id={randomCountry?.ccn3}
                title="Region"
                data={randomCountry?.region}
                ts={setTotalScore}
                cost={1}
              />
              <Hint
                id={randomCountry?.ccn3}
                title="Population"
                data={randomCountry?.population?.toLocaleString()}
                ts={setTotalScore}
                cost={0.5}
              />
              <Hint
                id={randomCountry?.ccn3}
                title="Domain"
                data={randomCountry?.tld?.[0]}
                ts={setTotalScore}
                cost={3}
              />
              <Hint
                id={randomCountry?.ccn3}
                title="Language"
                data={Object.values(randomCountry?.languages ?? {})[0]}
                ts={setTotalScore}
                cost={1}
              />
              <Hint
                id={randomCountry?.ccn3}
                title="Capital"
                data={randomCountry?.capital?.[0]}
                ts={setTotalScore}
                cost={3}
              />
              <Hint
                id={randomCountry?.ccn3}
                title="Area"
                data={randomCountry?.area ? randomCountry.area + " km" : undefined}
                ts={setTotalScore}
                cost={0.5}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-2 select-none w-full lg:w-2/3 py-2">
            <div className="h-52 w-[350px] max-w-[350px] mx-auto bg-white/90 dark:bg-dark-mode-ligth/90 py-4 rounded shadow">
              {showResult && randomCountry && (
                <img
                  src={randomCountry.flags.svg}
                  alt={randomCountry.name.common}
                  className="w-full h-full transition-opacity object-contain opacity-100"
                />
              )}
            </div>
            <p className="text-xl max-w-full min-w-[200px] min-h-[32px] shadow bg-white dark:bg-dark-mode-ligth rounded text-center flex flex-col items-center justify-center">
              {showResult && randomCountry?.name.common}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center px-4">
          <p className="font-bold">{countries.length} remaining</p>
          <p className="font-semibold">Score: {score}</p>
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  );
}
