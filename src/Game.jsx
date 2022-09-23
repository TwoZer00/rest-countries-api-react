import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import RandomFlag from "./RandomFlag";

export default function Game(props) {
  const [score, setScore] = useState([0, 0]);
  const [randomFlag, setRandomFlag] = useState(
    props.data[Math.floor(Math.random() * 250)]
  );
  const [countries, setCountries] = useState(props.data);
  const [options, setOptions] = useState([
    props.data[Math.floor(Math.random() * 250)],
    props.data[Math.floor(Math.random() * 250)],
    props.data[Math.floor(Math.random() * 250)],
    props.data[Math.floor(Math.random() * 250)],
    randomFlag,
  ]);
  options.sort((a, b) => {
    let x = a.name.common.toLowerCase();
    let y = b.name.common.toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
  const handleClick = (event) => {
    let options = event.target.parentElement.children;
    for (let index = 0; index < options.length; index++) {
      options[index].disabled = true;
    }
    let target = event.target.innerHTML;
    if (target === randomFlag.name.common) {
      let scoreTemp = score;
      scoreTemp[0] = score[0] + 1;
      setScore(scoreTemp);
    } else {
      let scoreTemp = score;
      scoreTemp[1] = score[1] + 1;
      setScore(scoreTemp);
    }
    let countriesTemp = countries.filter((element) => {
      return element.ccn3 !== randomFlag.ccn3;
    });
    setCountries(countriesTemp);
    for (let index = 0; index < options.length; index++) {
      options[index].removeAttribute("disabled");
    }
    reset();
  };
  const reset = () => {
    let random = countries[Math.floor(Math.random() * countries.length)];
    setRandomFlag(random);
    let temOptions = props.data.filter((element) => {
      return element.ccn3 !== random.ccn3;
    });
    let optionsTemp = [
      temOptions[Math.floor(Math.random() * temOptions.length)],
      temOptions[Math.floor(Math.random() * temOptions.length)],
      temOptions[Math.floor(Math.random() * temOptions.length)],
      temOptions[Math.floor(Math.random() * temOptions.length)],
      random,
    ];
    setOptions(optionsTemp);
  };
  if (countries.length !== 0) {
    // if (false) {
    return (
      <div className="dark:text-white flex flex-col h-full w-11/12 justify-center items-center mx-auto relative ">
        <div className="flex flex-col bg-white/10 backdrop-blur-sm p-10 rounded gap-5 px-5 w-full sm:w-fit">
          <h1 className="font-semibold text-2xl">
            Choose the name of the country based on the flag
          </h1>
          <div className="w-full flex justify-center">
            <RandomFlag flag={randomFlag} />
          </div>
          <div className="flex flex-col gap-x-2 justify-center flex-wrap w-full gap-2">
            {options.map((element, index) => {
              return (
                <button
                  key={index}
                  onClick={handleClick}
                  className="shadow disabled:bg-white rounded p-2 bg-white dark:bg-dark-fe border hover:bg-dark-mode-ligth/10 transition-colors dark:hover:bg-dark-mode-ligth/10 hover:cursor-pointer select-none"
                >
                  {element.name.common}
                </button>
              );
            })}
          </div>
          <div className="self-end font-bold">{countries.length}</div>
        </div>
      </div>
    );
  } else {
    return (
      <Modal
        title="You finished the game 😁👍🏻"
        desc="Congrats! see you score, also you can play again or go back to play more puzzles"
        again={reset}
        score={score}
      />
      // <div>
      //   <h1>Game finish</h1>
      //   <p>You score</p>
      //   <p>
      //     Correct <span className="font-bold">{score[0]}</span>
      //     <br />
      //     Incorrect<span className="font-bold">{score[1]}</span>
      //   </p>
      //   <Link to="/">Back</Link>
      // </div>
    );
  }
}
