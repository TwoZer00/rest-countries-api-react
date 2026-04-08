import { useEffect, useRef } from 'react';

export const Timer = ({ time, setTime, reducer, className, skip, skipf, loss }) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (skip) return;
    timeoutRef.current = setTimeout(() => {
      if (time > 0) {
        setTime((v) => v - 1);
      } else {
        loss();
      }
    }, reducer * 1000);

    return () => clearTimeout(timeoutRef.current);
  }, [time, skip]);

  useEffect(() => {
    if (skip) {
      clearTimeout(timeoutRef.current);
      skipf(false);
    }
  }, [skip]);

  return (
    <div className={`${className} font-bold h-8 w-8 text-xl dark:bg-white bg-black text-white dark:text-black flex flex-col justify-center items-center rounded-full`}>
      {time}
    </div>
  );
};
