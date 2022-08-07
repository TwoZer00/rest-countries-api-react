import React, { useEffect, useState } from "react";
import { SearchIcon } from "@heroicons/react/outline";

export const Search = ({ data, setData, setSearch }) => {
  const [input, setInput] = useState("");
  const handleInput = (event) => {
    const value = event.target.value.toLowerCase();
    // consolelog(value.length > 0);
    setInput(value);
  };

  const handleChanges = (val) => {
    // console.log(val || input);
    let value = val || input;
    if (value?.length > 0) {
      const tempData = data.filter((data) => {
        return data.name.common.toLowerCase().includes(value);
      });
      console.info("----", tempData);
      // tempData.length = 8;
      setData(tempData);
    } else {
      let temp = [...data];
      console.info("----a", temp);
      // temp.length = 8;
      setData(temp);
    }
  };

  useEffect(() => {
    handleChanges();
  }, [data, input]);
  return (
    <>
      <div className="flex flex-row shadow rounded gap-x-4 w-full h-full pl-4 group dark:bg-dark-mode-ligth bg-white">
        <SearchIcon className="w-8 dark:text-white text-black/30" />
        <input
          type="text"
          className="w-full dark:text-white h-full bg-white/0 dark:placeholder:text-white font-semibold pl-1 pr-4 outline-none dark:bg-dark-mode-ligth"
          placeholder="Search for a country..."
          onChange={handleInput}
        />
      </div>
    </>
  );
};
