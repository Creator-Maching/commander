import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type MatchContextType = {
  timeMinutes: number;
  setTimeMinutes: (minutes: number) => void;
  totalRounds: number;
  setTotalRounds: (rounds: number) => void;
};

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export function MatchProvider({ children }: { children: ReactNode }) {
  const [timeMinutes, setTimeMinutes] = useState(25);
  const [totalRounds, setTotalRounds] = useState(3); // novo estado para rounds

  return (
    <MatchContext.Provider value={{ timeMinutes, setTimeMinutes, totalRounds, setTotalRounds }}>
      {children}
    </MatchContext.Provider>
  );
}

export function useMatch() {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error("useMatch must be used within MatchProvider");
  }
  return context;
}
