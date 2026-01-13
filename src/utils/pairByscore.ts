import type { DuelPlayer, DuelPair } from "../types/duel";

export function pairByScore(players: DuelPlayer[]): DuelPair[] {
  const sorted = [...players].sort(
    (a, b) => b.score - a.score
  );

  const pairs: DuelPair[] = [];

  for (let i = 0; i < sorted.length; i += 2) {
    pairs.push({
      playerA: sorted[i],
      playerB: sorted[i + 1],
    });
  }

  return pairs;
}
