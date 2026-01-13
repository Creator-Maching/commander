import { useRef, useState } from "react";
import { Timer } from "../utils/Timer";

type UseTimerOptions = {
  minutes: number;
  onEnd?: () => void;
};

export function useTimer({ minutes, onEnd }: UseTimerOptions) {
  const timerRef = useRef<Timer | null>(null);
  const [remaining, setRemaining] = useState(minutes * 60 * 1000);

  function start() {
    timerRef.current = new Timer({
      minutes,
      onTick: setRemaining,
      onEnd,
    });

    timerRef.current.start();
  }

  function pause() {
    timerRef.current?.pause();
  }

  function reset(newMinutes?: number) {
    timerRef.current?.reset(newMinutes ?? minutes);
    setRemaining((newMinutes ?? minutes) * 60 * 1000);
  }

  return {
    remaining,
    start,
    pause,
    reset,
  };
}
