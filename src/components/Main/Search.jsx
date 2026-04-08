import { useEffect, useState, useRef } from "react";
import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/outline";

export const Search = ({ data, setData }) => {
  const [input, setInput] = useState("");
  const debounceRef = useRef(null);

  const handleInput = (event) => {
    const value = event.target.value.toLowerCase();
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setInput(value), 300);
  };

  useEffect(() => {
    if (input.length > 0) {
      setData(data.filter((d) => d.name.common.toLowerCase().includes(input)));
    } else {
      setData([...data]);
    }
  }, [data, input]);

  return (
    <div className="flex flex-row shadow rounded gap-x-4 w-full h-full pl-4 group dark:bg-dark-mode-ligth bg-white">
      <SearchIcon className="w-8 dark:text-white text-black/30" />
      <input
        type="text"
        className="w-full dark:text-white h-full bg-white/0 dark:placeholder:text-white font-semibold pl-1 pr-4 outline-none dark:bg-dark-mode-ligth"
        placeholder="Search for a country..."
        onChange={handleInput}
      />
    </div>
  );
};
