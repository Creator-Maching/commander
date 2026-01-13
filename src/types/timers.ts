export type TimerConfig = {
  minutes: number;
  onTick?: (remainingMs: number) => void;
  onEnd?: () => void;
};
