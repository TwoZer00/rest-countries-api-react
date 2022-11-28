import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { DataContext } from "./App";
import { Timer } from "./components/Timer";
import Modal from "./Modal";
import RandomFlag from "./RandomFlag";
import { getRandomInt, unMemberFilter } from "./utils";

export default function Game({ dataset }) {
  const data = unMemberFilter(useContext(DataContext))
  const [score, setScore] = useState([0, 0]);
  const [results, setResults] = useState([])
  const [time, setTime] = useState(10);
  const [randomFlag, setRandomFlag] = useState(
    dataset[Math.floor(Math.random() * dataset?.length)]
  );
  const [countries, setCountries] = useState(dataset);
  const getOptions = () => {
    let tempOptions = [];
    while (tempOptions.length < 4) {
      let temp = data[getRandomInt(data.length)];
      // console.log(temp)
      if (tempOptions.indexOf(temp) === -1) {
        tempOptions.push(temp);
      }
    }
    return tempOptions;
  }
  const [options, setOptions] = useState([]);




  const [rmClick, setRmClick] = useState(false);
  let max = 10;
  const handleClick = (event) => {
    setRmClick(true)


    let target = event.target.innerHTML;

    let selected = data.find(value => value.name.common === target);
    let tempResult = { options, selected: selected, correct: randomFlag };
    let temps = [...results, tempResult];

    setResults(temps)



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


  const [skipFlag, setSkipFlag] = useState();

  const reset = (win) => {
    // console.log(score);
    let countriesTemp = countries.filter((element) => {
      return element.ccn3 !== randomFlag.ccn3;
    });
    setCountries(countriesTemp);
    let random = countriesTemp[Math.floor(Math.random() * countriesTemp.length)];
    setRandomFlag(random);
    let temOptions = data.filter((element) => {
      return element.ccn3 !== random.ccn3;
    });
    let optionsTemp = [];

    while (optionsTemp.length <= 3) {
      let temp = temOptions[getRandomInt(temOptions.length)];
      if (optionsTemp.indexOf(temp) === -1) {
        optionsTemp.push(temp);
      }
    }
    optionsTemp.push(random);

    optionsTemp.sort((a, b) => {
      // console.log('a')
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


    setOptions(optionsTemp);
    setTime(10);
  };
  const startAgain = () => {
    // console.log(dataset)
    setRandomFlag(dataset[getRandomInt(dataset.length)])
    setCountries(dataset);
    setTime(10);
    setRmClick(false);
    setScore([0, 0])
    setResults([])
    setSkipFlag(false)
    // reset()
  }

  useEffect(() => {
    document.title = `Where in the world? - Guess the flag`;
    setOptions([...getOptions(), randomFlag])
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
  }, []);

  if (dataset.length <= 0) {
    return <Navigate replace to={'/games'} />
  }

  if (countries.length !== 0) {
    // if (false) {
    return (
      <div className="dark:text-white flex flex-col h-full w-11/12 justify-center items-center mx-auto relative ">
        <div className="flex flex-col bg-white/10 backdrop-blur-sm p-10 rounded gap-5 px-5 w-full sm:w-fit">

          {countries.length >= dataset.length && <h1 className="font-semibold text-2xl">
            Choose the name of the country based on the flag
          </h1>}
          <div className="w-full flex justify-center">
            <RandomFlag flag={randomFlag} />
          </div>
          <div className={`flex flex-col gap-x-2 justify-center flex-wrap w-full gap-2 ${rmClick ? 'pointer-events-none' : ''}`}>
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
            <Timer reducer={1} time={time} skip={skipFlag} skipf={setSkipFlag} loss={loss} setTime={setTime} className={"self-end"} />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <Modal
        title="You finished the game 😁👍🏻"
        desc="Congrats! see you score, also you can play again or go back to play more puzzles"
        again={startAgain}
        score={score}
        results={results}
      />
    );
  }
}
