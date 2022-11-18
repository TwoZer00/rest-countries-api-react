import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { DataContext } from "./App";
import Hint from "./Hint";
import { useOutsideAlerter } from "./hooks/useOutsideAlerter";
import { randomCountryPosition } from "./utils";

export default function GameC() {
  const data = useContext(DataContext).filter(
    (element) =>
      element.languages &&
      element.tld &&
      element.region &&
      element.population &&
      element.capital
  );
  const [countries, setCountries] = useState(data);
  const [randomCountry, setRandomCountry] = useState(
    data[randomCountryPosition(data.length)]
  );
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(10);
  const [optionsSearch, setOptionsSearch] = useState(data);
  const [visible, setVisible] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const dropdownRef = useRef();
  const [valid, setValid] = useState();
  useOutsideAlerter(dropdownRef, setVisible);
  const handleSubmit = (e, a) => {
    setShowResult(true);
    let value;
    if (e) {
      e.preventDefault();
      value = optionsSearch[0].name.common;
    } else {
      value = a.country.value;
    }
    // console.log(value, randomCountry.name.common);
    if (value.toLowerCase() === randomCountry.name.common.toLowerCase()) {
      setScore((value) => {
        return value + totalScore;
      });
      setValid(true);
    } else {
      // setScore((value) => {
      //   return value ;
      // });
      setValid(false);
    }
    let countriesTemp = countries.filter(
      (element) => element.name.common !== randomCountry.name.common
    );
    setTimeout(() => {
      setCountries(countriesTemp);
      e && e.target.reset();
      a && a.reset();
      setShowResult(false);
      reset();
    }, 2000);
  };
  const formRef = useRef();
  const reset = () => {
    setRandomCountry(countries[randomCountryPosition(countries.length)]);
    setOptionsSearch(data);
    setTotalScore(10);
    setValid();
  };
  const handleSearch = (e) => {
    setVisible(true);
    dropdownRef.current.scroll(0, 0);
    let value = e.target.value;
    if (value.length > 0) {
      let temp = data.filter((element) =>
        element.name.common.toLowerCase().includes(value.toLowerCase())
      );
      setOptionsSearch(
        temp.sort((a, b) => {
          let x = a.name.common.toLowerCase();
          let y = b.name.common.toLowerCase();
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
        })
      );
    } else {
      setOptionsSearch(data);
    }
  };

  useEffect(() => {
    document.title = `Where in the world? - Guess the country`;
  });

  return (
    <div className="dark:text-white h-full flex flex-col items-center justify-center">
      <div className="flex w-full flex-col bg-white/10 backdrop-blur-sm max-w-[1440px] p-2">
        <div className="text-center">
          <h1 className="font-bold text-4xl">What's the country?</h1>
          <small>
            Click boxes for more details, every box has cost, so if you guess
            correctly, your score will be reduced.
          </small>
        </div>
        <div className="flex flex-col lg:flex-row gap-x-8 items-center p-4">
          <div className="flex flex-col gap-4 items-center justify-center w-full">
            <div className="flex flex-row items-stretch w-full ">
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
                  }   w-full rounded`}
                >
                  {/* <span className="text-2xl bg-white">🏳️</span> */}
                  <div className="">
                    <input
                      list="countries"
                      id="country"
                      name="country"
                      className={`${
                        valid !== undefined ? "text-white" : ""
                      } text-xl py-2 bg-white/0 w-full${
                        visible ? "rounded-b-none" : ""
                      } border-none px-2 outline-none`}
                      placeholder="Search country"
                      disabled={showResult}
                      autoComplete="false"
                      onInputCapture={handleSearch}
                      onFocusCapture={() => {
                        setVisible((value) => {
                          return true;
                        });
                      }}
                    />
                  </div>
                  <div
                    ref={dropdownRef}
                    className={`absolute z-10 top-full w-full max-h-[100px] bg-white text-black dark:text-white dark:bg-dark-mode-ligth shadow rounded-b-md overflow-auto px-2 flex-col divide-y divide-black/20 dark:divide-white/20  ${
                      visible ? "flex" : "hidden"
                    }`}
                  >
                    {optionsSearch.map((element, index) => (
                      <p
                        key={index}
                        value={element.name.common}
                        className="flex flex-row gap-x-2 text-xl items-center w-full hover:bg-black/20 hover:cursor-pointer px-2"
                        onClick={(e) => {
                          let value = e.target.children[1].innerHTML;
                          formRef.current.country.value = value;
                          console.log(e.target.children[1].innerHTML);
                          setVisible(false);
                          // formRef.current.submit();
                          handleSubmit(undefined, formRef.current);
                        }}
                      >
                        <span className="pointer-events-none">
                          {element.flag}
                        </span>
                        <span className="pointer-events-none">
                          {element.name.common}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full">
              <Hint
                id={randomCountry.ccn3}
                title="Region"
                data={randomCountry.region}
                ts={setTotalScore}
                cost={1}
              />
              <Hint
                id={randomCountry.ccn3}
                title="Population"
                data={randomCountry.population.toLocaleString()}
                ts={setTotalScore}
                cost={0.5}
              />
              <Hint
                id={randomCountry.ccn3}
                title="Domain"
                data={randomCountry.tld[0]}
                ts={setTotalScore}
                cost={3}
              />
              <Hint
                id={randomCountry.ccn3}
                title="Language"
                data={Object.values(randomCountry.languages)[0]}
                ts={setTotalScore}
                cost={1}
              />
              <Hint
                id={randomCountry.ccn3}
                title="Capital"
                data={randomCountry.capital[0]}
                ts={setTotalScore}
                cost={3}
              />
              <Hint
                id={randomCountry.ccn3}
                title="Area"
                data={randomCountry.area + " km"}
                ts={setTotalScore}
                cost={0.5}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-2 select-none w-full lg:w-2/3 py-2">
            <div className="h-52 w-[350px] max-w-[350px] mx-auto bg-white/90 dark:bg-dark-mode-ligth/90 py-4 rounded shadow">
              {showResult && (
                <img
                  src={randomCountry.flags.svg}
                  alt="flag"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <p className="text-xl max-w-full min-w-[200px] min-h-[32px] shadow bg-white dark:bg-dark-mode-ligth rounded text-center flex flex-col items-center justify-center">
              {showResult && randomCountry.name.common}
            </p>
          </div>
        </div>
        <p className="self-end font-bold">{countries.length}</p>
      </div>
    </div>
  );
}
