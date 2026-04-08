import { useRef } from "react";
import { MagnifyingGlassIcon as SearchIcon } from "@heroicons/react/24/outline";

export const Search = ({ onSearch }) => {
  const debounceRef = useRef(null);

  const handleInput = (event) => {
    const value = event.target.value.toLowerCase();
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onSearch(value), 300);
  };

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
