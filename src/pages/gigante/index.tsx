import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useMatch } from "../../context/MatchContext";
import { useDuel } from "../../context/DuelContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createDuelPlayers } from "../../utils/createGigantMatch";
import gigantesImg from "../../assets/images/gigantes.jpg"; 
import { toast } from "react-toastify"; 

export function Gigant() {
  const { timeMinutes, setTimeMinutes } = useMatch();
  const { setPlayers, setTotalRounds } = useDuel();
  const navigate = useNavigate();

  const [names, setNames] = useState<string[]>(["", ""]);
  const [rounds, setRounds] = useState<number>(1);

  function handleChange(index: number, value: string) {
    const copy = [...names];
    copy[index] = value;
    setNames(copy);
  }

  function addPlayer() {
    setNames([...names, ""]);
  }

  function startDuel() {
    const filtered = names.filter((n) => n.trim() !== "");

    // mínimo de 1 dupla
    if (filtered.length < 1) {
      toast.error("Insira pelo menos uma dupla de jogadores");
      return;
    }

    // número de rodadas inválido
    if (rounds < 1) {
      toast.error("Número de rodadas inválido");
      return;
    }

    // verifica se todas as duplas têm 2 jogadores
    for (const n of filtered) {
      if (n.split("/").length !== 2) {
        toast.error("Cada dupla precisa ter 2 jogadores (ex: Alice/Bob)");
        return;
      }
    }

    // verifica se o número de duplas é ímpar
    if (filtered.length % 2 !== 0) {
      toast.error("Número ímpar de duplas! Adicione mais 1 dupla para iniciar.");
      return;
    }

    const players = createDuelPlayers(filtered);
    setPlayers(players);
    setTotalRounds(rounds);

    toast.success("Duel iniciado com sucesso!");
    navigate("/gigante");
  }

  return (
    <div
      className="min-h-screen flex flex-col text-zinc-100"
      style={{
        backgroundImage: `url(${gigantesImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center gap-8 px-4 text-center bg-black/60">
        <h1 className="text-3xl font-bold">Criar Duel</h1>

        {/* TEMPO */}
        <section className="flex flex-col items-center gap-3">
          <p className="text-zinc-400">Configure o tempo da partida</p>

          <div className="flex items-center gap-3">
            <label className="text-sm text-zinc-300">Tempo (min)</label>
            <input
              type="number"
              min={5}
              step={5}
              value={timeMinutes}
              onChange={(e) => setTimeMinutes(Number(e.target.value))}
              className="w-20 rounded-md bg-zinc-900 border border-zinc-700 px-2 py-1 text-center"
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <label className="text-sm text-zinc-300">Rodadas</label>
            <input
              type="number"
              min={1}
              step={1}
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-20 rounded-md bg-zinc-900 border border-zinc-700 px-2 py-1 text-center"
            />
          </div>
        </section>

        {/* JOGADORES */}
        <section className="flex flex-col items-center gap-4">
          <p className="text-zinc-400">Insira os jogadores</p>

          {names.map((name, i) => (
            <input
              key={i}
              value={name}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder={`Dupla ${i + 1} (ex: Alice/Bob)`}
              className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 w-64"
            />
          ))}

          <button
            onClick={addPlayer}
            className="text-sm text-emerald-400 hover:underline"
          >
            + adicionar jogador
          </button>
        </section>

        <button
          onClick={startDuel}
          disabled={names.filter((n) => n.trim() !== "").length < 2 || rounds < 1}
          className="mt-4 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Iniciar Duel
        </button>
      </main>

      <Footer />
    </div>
  );
}
