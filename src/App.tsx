import { FC, useEffect, useRef, useState } from 'react';

export const App: FC<{ name: string }> = ({ name }) => {
  return <StopWatch />;
};

function StopWatch() {
  const [startTime, setStartTime] = useState<DOMHighResTimeStamp>(null);
  const [endTime, setEndTime] = useState<DOMHighResTimeStamp>(null);

  const counter = (() => {
    if (startTime == null) {
      return <FormattedTime timeElapsedInMS={0} />;
    }

    if (endTime == null) {
      return <ActiveCounter startTimeFromPerfNow={startTime} />;
    }

    return <FormattedTime timeElapsedInMS={endTime - startTime} />;
  })();

  const primaryButton = (() => {
    if (startTime == null) {
      return (
        <button onClick={() => setStartTime(performance.now())}>Start</button>
      );
    }

    if (endTime == null) {
      return (
        <button onClick={() => setEndTime(performance.now())}>Pause</button>
      );
    }

    return <button onClick={() => setEndTime(null)}>Resume</button>;

    // throw if startTime == null && endTime != null
    // source: trust me bro
  })();

  return (
    <>
      {counter}
      <div>
        {primaryButton}
        <button onClick={reset}>Reset</button>
      </div>
    </>
  );

  function reset() {
    setStartTime(null);
    setEndTime(null);
  }
}

const CENTI_IN_MS = 10;
const SEC_IN_MS = 1000;
const MINUTE_IN_MS = 60 * SEC_IN_MS;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;

function FormattedTime({ timeElapsedInMS }) {
  const hour = f(timeElapsedInMS / HOUR_IN_MS);
  const minute = f((timeElapsedInMS % HOUR_IN_MS) / MINUTE_IN_MS);
  const seconds = f((timeElapsedInMS % MINUTE_IN_MS) / SEC_IN_MS);
  const centi = f((timeElapsedInMS % SEC_IN_MS) / CENTI_IN_MS);

  function f(num: number) {
    return Math.floor(num).toString().padStart(2, '0');
  }

  return <>{`${hour}:${minute}:${seconds}:${centi}`}</>;
}

function ActiveCounter({ startTimeFromPerfNow }) {
  const [elapsedInMS, setElapsedInMS] = useState(0);
  const animationFrameID = useRef<number>();

  function animateFrame(timeNow: DOMHighResTimeStamp) {
    setElapsedInMS(timeNow - startTimeFromPerfNow);

    animationFrameID.current = window.requestAnimationFrame(animateFrame);
  }

  useEffect(() => {
    animationFrameID.current = window.requestAnimationFrame(animateFrame);

    return () => window.cancelAnimationFrame(animationFrameID.current);
  }, []);

  return <FormattedTime timeElapsedInMS={elapsedInMS} />;
}
