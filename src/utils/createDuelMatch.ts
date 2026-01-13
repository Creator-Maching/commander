import type { DuelPlayer } from "../types/duel";

export function createDuelPlayers(names: string[]): DuelPlayer[] {
  return names.map((name) => ({
    id: crypto.randomUUID(),
    name,
    points: 0, // pontos totais do torneio
    score: 0,  // pontuação da rodada atual ou placar temporário
  }));
}

