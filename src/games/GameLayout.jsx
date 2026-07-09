export default function GameLayout({ children, className = "" }) {
  return (
    <div className="dark:text-white flex flex-col h-full w-11/12 max-w-lg justify-center items-center mx-auto relative overflow-auto py-4">
      <div className={`flex flex-col bg-white/10 backdrop-blur-sm p-4 sm:p-6 rounded-lg gap-4 sm:gap-5 w-full ${className}`}>
        {children}
      </div>
    </div>
  );
}
