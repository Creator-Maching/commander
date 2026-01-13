import type { DuelPlayer } from "../types/duel";

export function createDuelPlayers(names: string[]): DuelPlayer[] {
  return names
    .filter((n) => n.trim() !== "")
    .map((name) => {
      const duo = name.split("/").map((x) => x.trim()); // divide nomes por "/"
      return {
        id: crypto.randomUUID(),
        name: duo.join(" & "), // "Alice & Bob"
        members: duo, // array de nomes da dupla
        score: 0,     // pontuação inicial
      } as DuelPlayer;
    });
}