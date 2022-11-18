import React from "react";

export const Flag = ({ data }) => {
  // console.log(data);
  return (
    <div className="flex flex-col shadow-lg rounded overflow-hidden bg-white dark:bg-dark-mode-ligth dark:text-white min-h-[350px]">
      <div className="flex-none">
        <img
          src={`${data.flags.svg}`}
          alt={data.name.common}
          className="w-full"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col p-5 w-full h-full justify-center">
        <h1 className="font-bold mb-2">{data.name.common}</h1>
        <div className="text-sm">
          <p>
            <span className="font-bold">Population: </span>
            <span>{data.population.toLocaleString("en-US")}</span>
          </p>
          <p>
            <span className="font-bold">Region: </span>
            <span>{data.region}</span>
          </p>
          <p>
            <span className="font-bold">Capital: </span>
            <span>{data.capital ? data.capital[0] : ""}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
