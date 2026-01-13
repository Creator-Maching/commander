export interface DuelPlayer {
  id: string;
  name: string;
  score: number;
}

export interface DuelMatchConfig {
  rounds: number;
  timeMinutes: number;
}

export interface DuelPair {
  playerA: DuelPlayer;
  playerB: DuelPlayer;
}

