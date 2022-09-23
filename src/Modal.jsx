import React from "react";
import { Link } from "react-router-dom";

export default function Modal({ title, desc, back, again, score, record }) {
  return (
    <div className="absolute h-full w-screen flex flex-col items-center justify-center top-0 bg-dark-mode-ligth/60 z-50 dark:text-white">
      <div className="bg-dark-fe/70 backdrop-blur w-96 rounded shadow-lg p-5 flex flex-col gap-3">
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
