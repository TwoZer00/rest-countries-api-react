import { useEffect, useRef } from 'react';

export default function Timer({ time, setTime, reducer, className, skip, skipf, loss }) {
  const timeoutRef = useRef(null);
  const lossRef = useRef(loss);
  lossRef.current = loss;

  useEffect(() => {
    if (skip) return;
    timeoutRef.current = setTimeout(() => {
      if (time > 0) {
        setTime((v) => v - 1);
      } else {
        lossRef.current();
      }
    }, reducer * 1000);

    return () => clearTimeout(timeoutRef.current);
  }, [time, skip, reducer, setTime]);

  useEffect(() => {
    if (skip) {
      clearTimeout(timeoutRef.current);
      skipf(false);
    }
  }, [skip, skipf]);

  return (
    <div className={`${className} font-bold h-8 w-8 text-xl dark:bg-white bg-black text-white dark:text-black flex flex-col justify-center items-center rounded-full`}>
      {time}
    </div>
  );
}
