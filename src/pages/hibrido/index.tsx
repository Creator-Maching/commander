import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useMatch } from "../../context/MatchContext";
import { useHybrid } from "../../context/HybridContext";
import type { Player } from "../../context/HybridContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import rapidHybridImg from "../../assets/images/rapid-hybridization-.webp"; 
import { toast } from "react-toastify"; 

interface HibridoProps {
  initialPlayers?: string[];
  initialRounds?: number;
}

export function Hibrido({ initialPlayers = [], initialRounds = 3 }: HibridoProps) {
  const navigate = useNavigate();
  const { timeMinutes, setTimeMinutes } = useMatch();
  const { startHybrid } = useHybrid();

  const [names, setNames] = useState<string[]>(
    initialPlayers.length ? initialPlayers : ["", "", "", ""]
  );
  const [rounds, setRounds] = useState(initialRounds);

  function handleNameChange(i: number, value: string) {
    const copy = [...names];
    copy[i] = value;
    setNames(copy);
  }

  function addPlayer() {
    setNames((prev) => [...prev, ""]);
  }

  function handleStart() {
    const filtered = names.filter((n) => n.trim() !== "");

    if (filtered.length < 4) {
      toast.error("Mínimo de 4 jogadores");
      return;
    }

    if (rounds < 1) {
      toast.error("Número de rodadas inválido");
      return;
    }

    // valida múltiplo de 4
    if (filtered.length % 4 !== 0) {
      const faltando = 4 - (filtered.length % 4);
      toast.error(`Número de jogadores deve ser múltiplo de 4! Adicione mais ${faltando} jogador(es).`);
      return;
    }

    const playersForHybrid: Player[] = filtered.map((name) => ({
      id: uuidv4(),
      name,
      totalPoints: 0,
    }));

    startHybrid({
      players: playersForHybrid,
      totalRounds: rounds,
      timeMinutes,
    });

    toast.success("Torneio iniciado com sucesso!");
    navigate("/hybrid");
  }

  useEffect(() => {
    if (initialPlayers.length) {
      setNames(initialPlayers);
    }
  }, [initialPlayers]);

  return (
    <div
      className="min-h-screen flex flex-col text-zinc-100"
      style={{
        backgroundImage: `url(${rapidHybridImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />

      <main className="flex-1 flex flex-col items-center gap-6 px-4 py-10 bg-black/60">
        <h1 className="text-3xl font-bold">Configurar Híbrido</h1>

        <section className="w-full max-w-md bg-zinc-900 p-6 rounded-xl space-y-4">
          <div className="flex justify-between">
            <span>Tempo por rodada (min)</span>
            <input
              type="number"
              value={timeMinutes}
              onChange={(e) => setTimeMinutes(Number(e.target.value))}
              className="w-20 bg-zinc-800 rounded px-2 text-center"
            />
          </div>

          <div className="flex justify-between">
            <span>Rodadas</span>
            <input
              type="number"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-20 bg-zinc-800 rounded px-2 text-center"
            />
          </div>
        </section>

        <section className="w-full max-w-md space-y-2">
          {names.map((n, i) => (
            <input
              key={i}
              value={n}
              placeholder={`Jogador ${i + 1}`}
              onChange={(e) => handleNameChange(i, e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2"
            />
          ))}

          <button onClick={addPlayer} className="text-emerald-400 text-sm">
            + adicionar jogador
          </button>
        </section>

        <button
          onClick={handleStart}
          disabled={
            names.filter((n) => n.trim() !== "").length < 4 || 
            rounds < 1 || 
            names.filter((n) => n.trim() !== "").length % 4 !== 0
          }
          className="px-6 py-3 bg-indigo-600 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Iniciar Torneio
        </button>
      </main>

      <Footer />
    </div>
  );
}
