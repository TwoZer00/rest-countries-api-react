export default function GameLayout({ children, className = "" }) {
  return (
    <div className="dark:text-white flex flex-col h-full w-11/12 justify-center items-center mx-auto relative">
      <div className={`flex flex-col bg-white/10 backdrop-blur-sm p-6 sm:p-10 rounded-lg gap-5 w-full sm:w-[500px] ${className}`}>
        {children}
      </div>
    </div>
  );
}
