export default function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer mx-auto
        ${checked
          ? "bg-black/80 dark:bg-white/80 text-white dark:text-black border-transparent shadow-md"
          : "bg-transparent border-dashed border-black/30 dark:border-white/30 hover:border-solid hover:border-black/50 dark:hover:border-white/50"
        }`}
    >
      {checked ? "● " : "○ "}{label}
    </button>
  );
}
