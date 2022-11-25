import React, { useEffect } from "react";
import { useState } from "react";
import { Timer } from "./components/Timer";
import Modal from "./Modal";
import RandomFlag from "./RandomFlag";

export default function Game(props) {
  // console.log(props.data.find(element => { return element.ccn3 === "336" }))
  // console.log(props.data.find(element => { return element.ccn3 === "275" }))
  const realCountries = [...props.data.filter(element => { return element.unMember }),props.data.find(element => { return element.ccn3 === "336" }),props.data.find(element => { return element.ccn3 === "275" })];
  const [score, setScore] = useState([0, 0]);
  const [time, setTime] = useState(10);
  const [randomFlag, setRandomFlag] = useState(
    realCountries[Math.floor(Math.random() * 195)]
  );
  const [countries, setCountries] = useState(realCountries);
  const [options, setOptions] = useState([
    realCountries[Math.floor(Math.random() * 195)],
    realCountries[Math.floor(Math.random() * 195)],
    realCountries[Math.floor(Math.random() * 195)],
    realCountries[Math.floor(Math.random() * 195)],
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

  const [rmClick, setRmClick] = useState(false);
  let max = 10;
  const handleClick = (event) => {
    let options = event.target.parentElement.children;
    setRmClick(true)
    // for (let index = 0; index < options.length; index++) {
    //   options[index].disabled = true;
    // }
    let target = event.target.innerHTML;
    if (target === randomFlag.name.common) {
      win(true);
    } else {
      loss(true);
    }

    setTimeout(() => {
      setRmClick(false);
    }, 120);
  };

  const win = (flag) => {
    // console.log('win')
    let scoreTemp = score;
    scoreTemp[0] = score[0] + 1;
    setScore(scoreTemp);
    setSkipFlag(flag);
    reset();
    // setTime(false);
  }

  const loss = (flag) => {
    // console.log('loss')
    let scoreTemp = score;
    scoreTemp[1] = score[1] + 1;
    setScore(scoreTemp);
    setSkipFlag(flag);
    reset();
  }


  const [skipFlag,setSkipFlag] = useState();

  const reset = (win) => {
    // console.log(score);
    let countriesTemp = countries.filter((element) => {
      return element.ccn3 !== randomFlag.ccn3;
    });
    setCountries(countriesTemp);
    let random = countries[Math.floor(Math.random() * countries.length)];
    setRandomFlag(random);
    let temOptions = realCountries.filter((element) => {
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
    setTime(10);
    // setSkipFlag(false)
  };
  useEffect(() => {
    document.title = `Where in the world? - Guess the flag`;
  });  
  if (countries.length !== 0) {
    // if (false) {
    return (
      <div className="dark:text-white flex flex-col h-full w-11/12 justify-center items-center mx-auto relative ">
        <div className="flex flex-col bg-white/10 backdrop-blur-sm p-10 rounded gap-5 px-5 w-full sm:w-fit">
          
          {countries.length >= realCountries.length && <h1 className="font-semibold text-2xl">
            Choose the name of the country based on the flag
          </h1>}
          <div className="w-full flex justify-center">
            <RandomFlag flag={randomFlag} />
          </div>
          <div className={`flex flex-col gap-x-2 justify-center flex-wrap w-full gap-2 ${rmClick?'pointer-events-none':''}`}>
            {options.map((element, index) => {
              return (
                <button
                  key={index}
                  onClick={handleClick}
                  className="shadow disabled:bg-invalid rounded p-2 bg-white dark:bg-dark-fe border hover:bg-dark-mode-ligth/10 transition-colors dark:hover:bg-dark-mode-ligth/10 hover:cursor-pointer select-none"
                >
                  {element.name.common}
                </button>
              );
            })}
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="font-bold">{countries.length}</div>
            <Timer reducer={1} time={time} skip={skipFlag} skipf={setSkipFlag} loss={loss} setTime={setTime} className={"self-end"}/>
          </div>
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
    );
  }
}
