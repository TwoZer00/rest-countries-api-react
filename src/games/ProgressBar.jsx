export default function ProgressBar({ current, total }) {
  const progress = total > 0 ? (current / total) * 100 : 0;
  return (
    <>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">{current} / {total}</span>
      </div>
      <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-valid rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}
