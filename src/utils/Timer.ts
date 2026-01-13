import type { TimerConfig } from "../types";

export class Timer {
  private durationMs: number;
  private remainingMs: number;
  private intervalId: number | null = null;

  private onTick?: TimerConfig["onTick"];
  private onEnd?: TimerConfig["onEnd"];

  constructor({ minutes, onTick, onEnd }: TimerConfig) {
    this.durationMs = minutes * 60 * 1000;
    this.remainingMs = this.durationMs;
    this.onTick = onTick;
    this.onEnd = onEnd;
  }

  start() {
    if (this.intervalId) return;

    this.intervalId = window.setInterval(() => {
      this.remainingMs -= 1000;
      this.onTick?.(this.remainingMs);

      if (this.remainingMs <= 0) {
        this.stop();
        this.onEnd?.();
      }
    }, 1000);
  }

  pause() {
    if (!this.intervalId) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  stop() {
    this.pause();
    this.remainingMs = 0;
  }

  reset(minutes?: number) {
    this.pause();
    if (minutes !== undefined) {
      this.durationMs = minutes * 60 * 1000;
    }
    this.remainingMs = this.durationMs;
  }

  getRemainingMs() {
    return this.remainingMs;
  }
}
