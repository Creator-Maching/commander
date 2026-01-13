import { createContext, useContext, useState } from "react";
import type { DuelPlayer } from "../types/duel";

/* ===========================
   TIPOS
=========================== */

export type MesaoMatch = {
  id: string;
  players: DuelPlayer[];
  values: number[];
  winner: DuelPlayer[];
};

interface MesaoContextData {
  players: DuelPlayer[];
  matches: MesaoMatch[];
  round: number;
  totalRounds: number;

  setPlayers: React.Dispatch<React.SetStateAction<DuelPlayer[]>>;
  setTotalRounds: React.Dispatch<React.SetStateAction<number>>;

  startMesao: () => void;
  setMatchValues: (matchId: string, values: number[]) => void;
  endRound: () => void;
  resetTournament: () => void;
}

/* ===========================
   CONTEXT
=========================== */

const MesaoContext = createContext<MesaoContextData | undefined>(undefined);

/* ===========================
   PROVIDER
=========================== */

export function MesaoProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = useState<DuelPlayer[]>([]);
  const [matches, setMatches] = useState<MesaoMatch[]>([]);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);

  /* ===========================
     UTIL
  =========================== */

  function shuffle<T>(array: T[]) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  /* ===========================
     START MESÃO
  =========================== */

  function startMesao() {
    const shuffled = shuffle(players);
    const tables: MesaoMatch[] = [];

    for (let i = 0; i < shuffled.length; i += 4) {
      const table = shuffled.slice(i, i + 4);

      if (table.length === 4) {
        tables.push({
          id: crypto.randomUUID(),
          players: table,
          values: [1, 1, 1, 1],
          winner: [],
        });
      }
    }

    setMatches(tables);
  }

  /* ===========================
     SET VALUES
  =========================== */

  function setMatchValues(matchId: string, values: number[]) {
    setMatches((prev) =>
      prev.map((m) =>
        m.id === matchId ? { ...m, values } : m
      )
    );
  }

  /* ===========================
     END ROUND (FIX DEFINITIVO)
  =========================== */

  function endRound() {
  setPlayers((prevPlayers) => {
    const playerMap = new Map(
      prevPlayers.map((p) => [
        p.id,
        { ...p, score: p.score ?? 0 },
      ])
    );

    matches.forEach((match) => {
      match.players.forEach((player, index) => {
        const current = playerMap.get(player.id);
        if (!current) return;

        // ✅ soma SOMENTE o valor digitado
        current.score += match.values[index];
      });
    });

    return Array.from(playerMap.values()).sort(
      (a, b) => (b.score ?? 0) - (a.score ?? 0)
    );
  });

  setMatches([]);
  setRound((r) => r + 1);
}


  /* ===========================
     RESET
  =========================== */

  function resetTournament() {
    setPlayers([]);
    setMatches([]);
    setRound(1);
  }

  /* ===========================
     PROVIDER
  =========================== */

  return (
    <MesaoContext.Provider
      value={{
        players,
        matches,
        round,
        totalRounds,
        setPlayers,
        setTotalRounds,
        startMesao,
        setMatchValues,
        endRound,
        resetTournament,
      }}
    >
      {children}
    </MesaoContext.Provider>
  );
}

/* ===========================
   HOOK
=========================== */

export function useMesao(): MesaoContextData {
  const ctx = useContext(MesaoContext);
  if (!ctx) {
    throw new Error("useMesao must be used inside MesaoProvider");
  }
  return ctx;
}
