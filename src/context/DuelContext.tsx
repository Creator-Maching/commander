import { createContext, useContext, useState } from "react";
import type { DuelPlayer, DuelPair } from "../types/duel";

/* =======================
   TIPOS
======================= */

export type DuelMatch = {
  id: string;
  playerA: DuelPlayer;
  playerB: DuelPlayer;
  scoreA: number;
  scoreB: number;
  winner: DuelPlayer | null;
};

interface DuelContextData {
  players: DuelPlayer[];
  pairs: DuelPair[];
  matches: DuelMatch[];
  round: number;
  totalRounds: number;

  setPlayers: React.Dispatch<React.SetStateAction<DuelPlayer[]>>;
  setPairs: React.Dispatch<React.SetStateAction<DuelPair[]>>;
  setMatches: React.Dispatch<React.SetStateAction<DuelMatch[]>>;
  setTotalRounds: React.Dispatch<React.SetStateAction<number>>;

  setScore: (matchId: string, scoreA: number, scoreB: number) => void;
  endRound: () => void;
  resetTournament: () => void;
}

/* =======================
   CONTEXT
======================= */

const DuelContext = createContext<DuelContextData | null>(null);

/* =======================
   PROVIDER
======================= */

export function DuelProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<DuelPlayer[]>([]);
  const [pairs, setPairs] = useState<DuelPair[]>([]);
  const [matches, setMatches] = useState<DuelMatch[]>([]);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);


  /* =======================
     ATUALIZA PLACAR DE UMA PARTIDA
  ======================== */
  function setScore(matchId: string, scoreA: number, scoreB: number) {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId ? { ...m, scoreA, scoreB } : m
      )
    );
  }

  /* =======================
     FINALIZA RODADA
  ======================== */
  function endRound() {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        const playerMatches = matches.filter(
          (m) => m.playerA.id === player.id || m.playerB.id === player.id
        );

        let roundPoints = 0;

        playerMatches.forEach((m) => {
          const draw = m.scoreA === m.scoreB;

          if (m.playerA.id === player.id) {
            if (draw) roundPoints += 1;
            else if (m.scoreA > m.scoreB) roundPoints += 2;

            // define vencedor da partida
            m.winner = draw ? null : m.scoreA > m.scoreB ? m.playerA : m.playerB;
          } else if (m.playerB.id === player.id) {
            if (draw) roundPoints += 1;
            else if (m.scoreB > m.scoreA) roundPoints += 2;
          }
        });

        return { ...player, score: (player.score || 0) + roundPoints };
      })
    );

    // limpa matches e pares da rodada
    setMatches([]);
    setPairs([]);
    setRound((r) => r + 1);
  }

  /* =======================
     REINICIA TORNEIO
  ======================== */
  function resetTournament() {
    setPlayers([]);
    setPairs([]);
    setMatches([]);
    setRound(1);
  }

  return (
    <DuelContext.Provider
      value={{
        players,
        pairs,
        matches,
        round,
        totalRounds,
        setPlayers,
        setPairs,
        setMatches,
        setTotalRounds,
        setScore,
        endRound,
        resetTournament,
      }}
    >
      {children}
    </DuelContext.Provider>
  );
}

/* =======================
   HOOK
======================= */
export function useDuel() {
  const ctx = useContext(DuelContext);
  if (!ctx) throw new Error("useDuel must be used inside DuelProvider");
  return ctx;
}
