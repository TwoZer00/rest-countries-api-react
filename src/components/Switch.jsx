export default function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`px-3 py-1.5 rounded-full text-sm border transition-all cursor-pointer mx-auto
        ${checked
          ? "bg-blue-500 text-white border-blue-500 shadow-md"
          : "bg-transparent border-dashed border-black/30 dark:border-white/30 hover:border-solid hover:border-blue-400"
        }`}
    >
      {checked ? "● " : "○ "}{label}
    </button>
  );
}
