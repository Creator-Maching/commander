import type { DuelPlayer, DuelPair } from "../types/duel";
import { shufflePlayers } from "./shufflePlayers";

export function pairFirstRound(players: DuelPlayer[]): DuelPair[] {
  const shuffled = shufflePlayers(players);
  const pairs: DuelPair[] = [];

  for (let i = 0; i < shuffled.length; i += 2) {
    pairs.push({
      playerA: shuffled[i],
      playerB: shuffled[i + 1],
    });
  }

  return pairs;
}
