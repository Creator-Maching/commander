import { createContext, useContext, useState, useRef } from "react";
import type { ReactNode } from "react";

export type HybridMode = "MESAO" | "DUEL";

export interface Player {
  id: string;
  name: string;
  totalPoints: number;
}

interface HybridStartConfig {
  players: Player[];
  totalRounds: number;
  timeMinutes: number;
}

interface HybridContextData {
  mode: HybridMode;
  round: number;
  totalRounds: number;
  players: Player[];
  roundPoints: Record<string, number>;

  startHybrid: (config: HybridStartConfig) => void;
  setRoundPoint: (id: string, points: number) => void;
  nextPhase: () => void;
  resetHybrid: () => void;
}

const HybridContext = createContext<HybridContextData | undefined>(undefined);

export function HybridProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<HybridMode>("MESAO");
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(3);
  const [players, setPlayers] = useState<Player[]>([]);
  const [roundPoints, setRoundPoints] = useState<Record<string, number>>({});

  // 🔹 Ref para acumular pontos entre fases
  const pointsRef = useRef<Record<string, number>>({});

  function startHybrid(config: HybridStartConfig) {
    setPlayers(config.players);
    setRound(1);
    setTotalRounds(config.totalRounds);
    setMode("MESAO");
    setRoundPoints({});

    // Inicializa pontos acumulados
    pointsRef.current = config.players.reduce((acc, p) => {
      acc[p.id] = p.totalPoints ?? 0;
      return acc;
    }, {} as Record<string, number>);

    // Carrega pontos do localStorage
    const saved = JSON.parse(localStorage.getItem("hybridPoints") || "{}");
    Object.entries(saved).forEach(([id, pts]) => {
      if (pointsRef.current[id] !== undefined) {
        pointsRef.current[id] = pts as number;
      }
    });
  }

  function setRoundPoint(id: string, points: number) {
    setRoundPoints((prev) => ({
      ...prev,
      [id]: points,
    }));
  }

  function nextPhase() {
    // 🔹 Soma os pontos da rodada apenas ao final
    setPlayers((prev) =>
      prev.map((p) => {
        const added = roundPoints[p.id] ?? 0;
        pointsRef.current[p.id] = (pointsRef.current[p.id] ?? 0) + added;
        return { ...p, totalPoints: pointsRef.current[p.id] };
      })
    );

    // Limpa inputs
    setRoundPoints({});

    // Alterna modo e aumenta rodada
    setMode((prev) => {
      if (prev === "MESAO") return "DUEL";
      setRound((r) => r + 1);
      return "MESAO";
    });

    // Salva pontos acumulados
    localStorage.setItem("hybridPoints", JSON.stringify(pointsRef.current));
  }

  function resetHybrid() {
    setPlayers([]);
    setRound(1);
    setTotalRounds(3);
    setMode("MESAO");
    setRoundPoints({});
    pointsRef.current = {};
    localStorage.removeItem("hybridPoints");
  }

  return (
    <HybridContext.Provider
      value={{
        mode,
        round,
        totalRounds,
        players,
        roundPoints,
        startHybrid,
        setRoundPoint,
        nextPhase,
        resetHybrid,
      }}
    >
      {children}
    </HybridContext.Provider>
  );
}

export function useHybrid(): HybridContextData {
  const ctx = useContext(HybridContext);
  if (!ctx) throw new Error("useHybrid must be used inside HybridProvider");
  return ctx;
}
