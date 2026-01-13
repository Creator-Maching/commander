import type { DuelPlayer } from "../types/duel";

export type DuelResult =
  | "2-0"
  | "2-1"
  | "1-1"
  | "1-2"
  | "0-2"
  | "1-0"
  | "0-1";

export function applyDuelResult(
  playerA: DuelPlayer,
  playerB: DuelPlayer,
  result: DuelResult
) {
  switch (result) {
    case "2-0":
    case "1-0":
      playerA.score += 3;
      break;

    case "2-1":
      playerA.score += 2;
      break;

    case "1-1":
      playerA.score += 1;
      playerB.score += 1;
      break;

    case "1-2":
      playerB.score += 2;
      break;

    case "0-2":
    case "0-1":
      playerB.score += 3;
      break;
  }
}
