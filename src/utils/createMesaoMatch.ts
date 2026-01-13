import type { DuelPlayer } from "../types/duel";

export type MesaoMatch = {
  id: string;
  players: DuelPlayer[]; // array de 4 jogadores
  values: number[];      // valores a sair (1,2,3 ou vencedor)
};
