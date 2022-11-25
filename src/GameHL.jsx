import {
  ArrowUpIcon as TrendingUpIcon,
  ArrowDownIcon as TrendingDownIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { DataContext } from "./App";
import HLFlag from "./HLFlag";
import Modal from "./Modal";
import { randomCountryPosition } from "./utils";

export default function GameHL() {
  const data = [...useContext(DataContext).filter(element => { return element.unMember }), useContext(DataContext).find(element => { return element.ccn3 ==='275'}), useContext(DataContext).find(element => { return element.ccn3 ==='336'})];
  let country1 = data[randomCountryPosition(data.length)];
  let country2 = data.filter((element) => {
    return element.ccn3 !== country1.ccn3;
  })[
    randomCountryPosition(
      data.filter((element) => {
        return element.ccn3 !== country1.ccn3;
      }).length
    )
  ];
  const [modalLose, setModalLose] = useState(false);
  let countries = data.filter((element) => {
    return element.ccn3 !== country1.ccn3 && element.ccn3 !== country2.ccn3;
  });
  //   console.log(country1, country2, countries);
  const [country, setCountry] = useState(country1);
  const [countryC, setCountryC] = useState(country2);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const results = (e) => {
    setShowResults(true);
    let target = e.target.childNodes[0].textContent.toLowerCase();
    // console.log(target);
    let result = "";
    if (country.population > countryC.population) {
      //   return console.log(true, country.population, countryC.population);
      result = "lower";
    } else if (country.population === countryC.population) {
      result = "draw";
    } else {
      //   return console.log(false, country.population, countryC.population);
      result = "higher";
    }
    // console.log(result === target, country.population, countryC.population);
    if (result === target || result === "draw") {
      setScore((value) => {
        return value + 1;
      });
      setTimeout(() => {
        setShowResults(false);
        reset();
      }, 1500);
    } else {
      let tempRecord = parseInt(
        localStorage.getItem("GameHL") !== null
          ? localStorage.getItem("GameHL")
          : "0"
      );
      // console.log(localStorage.getItem("GameHL"));
      localStorage.setItem(
        "GameHL",
        localStorage.getItem("GameHL") < score ? score : tempRecord
      );
      setTimeout(() => {
        setModalLose(true);
        setShowResults(false);
      }, 1500);
    }
  };

  const reset = () => {
    setCountry(countryC);
    countries = data.filter((element) => {
      return element.ccn3 !== countryC.ccn3;
    });
    setCountryC(countries[randomCountryPosition(countries.length)]);
  };
  const resetGame = () => {
    setScore(0);
    country1 = data[randomCountryPosition(data.length)];
    country2 = data.filter((element) => {
      return element.ccn3 !== country1.ccn3 && element.ccn3 !== countryC.ccn3;
    })[
      randomCountryPosition(
        data.filter((element) => {
          return element.ccn3 !== country1.ccn3;
        }).length
      )
    ];
    countries = data.filter((element) => {
      return element.ccn3 !== country1.ccn3 && element.ccn3 !== country2.ccn3;
    });
    setCountry(country1);
    setCountryC(country2);
    setModalLose(false);
  };
  return (
    <div className="h-full relative text-white">
      <div className="w-full mx-auto flex flex-col items-center justify-center h-full">
        <div className="text-3xl font-bold flex-col tracking-wide absolute top-0 z-40 flex pt-4 w-[180px]">
          <p className="flex items-center">
            Higher <TrendingUpIcon className="w-7 h-7" />
          </p>
          <p className="text-center text-sm">OR</p>
          <p className="flex items-center self-end">
            <TrendingDownIcon className="w-7 h-7" /> Lower
          </p>
        </div>
        <div className="flex flex-col lg:flex-row items-center w-full text-center h-full relative">
          <HLFlag
            name={country.name.common}
            btn={false}
            population={country.population}
            svg={country.flags.svg}
            val={results}
            showPopulation={showResults}
            animate={true}
          />
          <p className="font-bold text-2xl  absolute flex flex-col top-0 items-center justify-center w-full h-full z-40 pointer-events-none">
            V.S
          </p>
          <HLFlag
            name={countryC.name.common}
            btn={true}
            population={countryC.population}
            svg={countryC.flags.svg}
            val={results}
            showPopulation={showResults}
            animate={false}
          />
        </div>
      </div>
      {modalLose && (
        <Modal
          title="Game over 🥲"
          desc="Thanks for play our game, check you score, play again to break it or go back and play more of our games."
          again={resetGame}
          score={score}
          record={parseInt(
            localStorage.getItem("GameHL")
              ? localStorage.getItem("GameHL")
              : "0"
          )}
        />
        // <div className="absolute top-0 w-screen h-full z-50 flex flex-col items-center justify-center">
        //   <div className="bg-dark-fe/70 backdrop-blur-xl rounded w-80 h-80 flex p-2 flex-col justify-center shadow-lg items-center gap-2">
        //     <h3 className="text-xl font-semibold">Better luck next time 😬</h3>
        //     <p className="w-3/4 text-center">
        //       You loose, try again or check other puzzles 😎
        //     </p>
        //     <div className="flex flex-row gap-x-4 h-12 items-stretch">
        //       <Link
        //         to={"/games"}
        //         className="border px-4 rounded hover:bg-white/20 flex flex-col items-center justify-center transition-all"
        //       >
        //         Menu
        //       </Link>
        //       <button
        //         onClick={resetGame}
        //         className="border px-4 rounded hover:bg-white/20 transition-all"
        //       >
        //         Play again
        //       </button>
        //     </div>
        //   </div>
        // </div>
      )}
    </div>
  );
}
