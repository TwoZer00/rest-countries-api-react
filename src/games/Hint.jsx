import { useEffect, useState } from "react";

export default function Hint({ id, title, data, ts, cost, suggested, onReveal }) {
  const valK = data?.includes("km");
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showDeduction, setShowDeduction] = useState(false);

  const handleVisible = () => {
    if (visible || closing) return;
    setVisible(true);
    setShowDeduction(true);
    ts((value) => value - cost);
    onReveal?.();
    setTimeout(() => setShowDeduction(false), 800);
  };

  useEffect(() => {
    if (visible) {
      setClosing(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setClosing(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    setVisible(false);
    setClosing(false);
  }, [id]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleVisible();
    }
  };

  const showData = visible && !closing;

  return (
    <div
      onClick={handleVisible}
      onKeyDown={handleKeyDown}
      tabIndex={visible ? -1 : 0}
      role="button"
      aria-label={`${title} hint, costs ${cost} points`}
      className={`relative flex flex-col items-center h-24 sm:h-28 w-full shadow bg-white dark:bg-dark-mode-ligth rounded px-3 sm:px-4 py-2 backdrop-blur outline-none focus:ring-2 focus:ring-valid/50 transition-all duration-300 ${
        closing ? "scale-95 opacity-50" : ""
      } ${!visible && !closing ? "hover:cursor-pointer hover:scale-105" : ""} ${
        suggested && !visible && !closing ? "ring-2 ring-valid/40" : ""
      }`}
    >
      {showDeduction && (
        <span className="absolute -top-3 right-1 text-invalid font-bold text-sm animate-bounce">
          -{cost} pt
        </span>
      )}
      {suggested && !visible && !closing && (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] bg-valid/80 text-white px-1.5 rounded-full">
          Cheapest
        </span>
      )}
      {!visible && !closing && (
        <span className="absolute top-1 right-2 text-xs opacity-40">
          -{cost} pt
        </span>
      )}
      <p className="text-center font-semibold w-full">{title}</p>
      <div className="flex flex-col justify-center items-center h-full w-full">
        {showData ? (
          <p className="text-lg text-center break-words w-full text-black dark:text-white">
            {data ?? "—"}
            {valK && <sup>2</sup>}
          </p>
        ) : (
          <p className="text-2xl opacity-20 select-none">?</p>
        )}
      </div>
    </div>
  );
}
