import React from "react";
import { Link } from "react-router-dom";

export default function Modal({ title, desc, back, again, score, record, results }) {
  let data = []
  results.forEach((element, parentIndex) => {
    let options = [<td className="border">{parentIndex + 1}</td>]
    element.options.forEach((option, index) => {
      if (option === element.correct) {
        options.push(<td key={`option${parentIndex}.${index}`} className={`${option === element.selected ? "font-bold" : ""} text-bold border bg-valid/20 dark:border-dark-mode-ligth/50`}>{option.name.common + " " + option.flag}</td>);
      }
      else if (option === element.selected) {
        options.push(<td key={`option${parentIndex}.${index}`} className={`border bg-invalid/20 dark:border-dark-mode-ligth/50`}>{option.name.common + " " + option.flag}</td>);
      }
      else {
        options.push(<td key={`option${parentIndex}.${index}`} className={`border dark:border-dark-mode-ligth/50`}>{option.name.common + " " + option.flag}</td>);
      }

    });
    data.push(<tr key={`try${parentIndex}`}>{options}</tr>);
  })


  return (
    <div className="absolute h-full w-screen flex flex-col items-center justify-center top-0 bg-dark-mode-ligth/60 z-50 dark:text-white">
      <div className="dark:bg-dark-fe/70 bg-white/40 backdrop-blur w-fit max-w-96 rounded shadow-lg p-5 flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-center">{title}</h2>
        <p className="text-center">{desc}</p>
        {score[1] !== undefined ? (
          <p className="flex gap-x-3 justify-center">
            Corrects<span>{score[0]}</span>Incorrects <span>{score[1]} </span>
          </p>
        ) : (
          <div className="flex gap-x-2 justify-center">
            <p className="flex gap-x-2">
              Score <span>{score}</span>
            </p>
            <p className="flex gap-x-2">
              Record <span>{record}</span>
            </p>
          </div>
        )}
        <div className="flex flex-col max-h-[200px] overflow-auto">
          <table className="border border-collapse dark:border-dark-mode-ligth">
            <thead>
              <tr>
                <th className=""></th>
                <th className="border dark:border-dark-mode-ligth dark:bg-white/10">Option 1</th>
                <th className="border dark:border-dark-mode-ligth dark:bg-white/10">Option 2</th>
                <th className="border dark:border-dark-mode-ligth dark:bg-white/10">Option 3</th>
                <th className="border dark:border-dark-mode-ligth dark:bg-white/10">Option 4</th>
                <th className="border dark:border-dark-mode-ligth dark:bg-white/10">Option 5</th>
              </tr>
            </thead>
            <tbody>
              {data}
            </tbody>
          </table>
        </div>
        <div className="flex flex-row justify-center gap-x-4 text-sm">
          <Link
            to="/games"
            className="border py-2 px-4 rounded hover:cursor-pointer hover:bg-white/20 transition-all"
          >
            Menu
          </Link>
          <button
            onClick={again}
            className="border py-2 px-4 rounded hover:cursor-pointer hover:bg-white/20 transition-all"
          >
            Play again
          </button>
        </div>
      </div>
    </div>
  );
}
