import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import GameLayout from "./GameLayout";
import Switch from "../components/Switch";
import usePageMeta from "../hooks/usePageMeta";

const MODES = [
  { key: "classic", label: "Classic", desc: "10s per flag, 5 options, skip allowed", icon: "🎯" },
  { key: "endless", label: "Endless", desc: "Infinite flags, one wrong and it's over", icon: "♾️" },
  { key: "speed", label: "Speed Run", desc: "60s total, answer as many as you can", icon: "⚡" },
  { key: "zen", label: "Zen", desc: "No timer, just accuracy", icon: "🧘" },
  { key: "hardcore", label: "Hardcore", desc: "5s, 6 options, no skipping", icon: "💀" },
];

export default function FlagModeSelect() {
  const [searchParams] = useSearchParams();
  const [typed, setTyped] = useState(false);
  const [suggestions, setSuggestions] = useState(true);

  const buildLink = (modeKey) => {
    const params = new URLSearchParams(searchParams);
    if (typed) {
      params.set("typed", "true");
      if (!suggestions) params.set("noSuggestions", "true");
    } else {
      params.delete("typed");
      params.delete("noSuggestions");
    }
    const qs = params.toString();
    return `/guesstheflag/${modeKey}${qs ? `?${qs}` : ""}`;
  };

  usePageMeta(
    "Where in the world? - Guess the Flag",
    "Choose a game mode for the flag guessing game"
  );

  return (
    <GameLayout>
      <h1 className="text-2xl font-bold text-center">Guess the Flag</h1>
      <p className="text-sm text-center opacity-60">Choose a game mode</p>

      <div className="flex flex-col gap-2">
        {MODES.map((mode) => (
          <Link
            key={mode.key}
            to={buildLink(mode.key)}
            className="border p-3 rounded-lg shadow hover:bg-black/10 dark:hover:bg-white/10 transition-all flex items-center gap-3"
          >
            <span className="text-2xl">{mode.icon}</span>
            <div className="flex flex-col">
              <span className="font-semibold">{mode.label}</span>
              <small className="opacity-70">{mode.desc}</small>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <Switch checked={typed} onChange={setTyped} label="Type answers (no multiple choice)" />
        {typed && (
          <Switch checked={suggestions} onChange={setSuggestions} label="Show suggestions" />
        )}
      </div>
    </GameLayout>
  );
}
