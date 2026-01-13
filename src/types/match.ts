export type GameMode =
  | "DUEL"
  | "TWO_HEADED_GIANT"
  | "HYBRID"
  | "BIG_TABLE";

export type MatchSetup = {
  mode: GameMode;
  timeLimitMinutes: number;
  maxPlayers: number;
};
