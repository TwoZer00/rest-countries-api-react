import React, { useEffect, useState } from "react";

export default function Hint({ id, title, data, ts, cost }) {
  console.log(data.includes("km"));
  let valK = data.includes("km");
  let nondata = [];
  nondata.length = data.length;
  nondata.fill("*");
  const [visible, setVisible] = useState(false);
  const handleVisible = (e) => {
    e.target.disabled = true;
    setVisible(true);
    ts((value) => {
      return value - cost;
    });
  };
  useEffect(() => {
    setVisible(false);
  }, [id]);
  return (
    <div
      onClick={!visible ? handleVisible : undefined}
      className={`flex flex-col items-center gap-x-2 h-36 w-32 shadow bg-white dark:bg-dark-mode-ligth rounded px-4 py-2 backdrop-blur ${
        !visible && "hover:cursor-pointer"
      }`}
    >
      <p className="text-center font-semibold w-full">{title}</p>
      <div className="flex flex-col justify-center h-full">
        <p
          className={`select-none h-fit text-xl transition-colors text-center ${
            visible
              ? "text-black dark:text-white"
              : "text-white dark:text-dark-mode-ligth"
          }`}
        >
          {visible ? data : nondata.join("")}
          {valK && <sup>2</sup>}
        </p>
      </div>
    </div>
  );
}
