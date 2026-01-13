import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useMatch } from "../../context/MatchContext";
import { useDuel } from "../../context/DuelContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createDuelPlayers } from "../../utils/createDuelMatch";
import img from "../../assets/images/blue_vs_red.png"; // ajuste o caminho corretamente
import { toast } from "react-toastify"; // ✅ importando toast

export function Xone() {
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

    // mínimo de 2 jogadores
    if (filtered.length < 2) {
      toast.error("É necessário pelo menos 2 jogadores");
      return;
    }

    // número de rodadas inválido
    if (rounds < 1) {
      toast.error("Número de rodadas inválido");
      return;
    }

    // verifica se o número de jogadores é ímpar
    if (filtered.length % 2 !== 0) {
      toast.error("Número ímpar de jogadores! Adicione mais 1 jogador para equilibrar as duplas.");
      return;
    }

    const players = createDuelPlayers(filtered);
    setPlayers(players);
    setTotalRounds(rounds);

    toast.success("Duel iniciado com sucesso!");
    navigate("/duel");
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Navbar />

      <main
        className="flex-1 flex flex-col items-center justify-center gap-8 px-4 text-center relative"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay escuro para o conteúdo ficar legível */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-white">Criar Duel</h1>

          {/* TEMPO */}
          <section className="flex flex-col items-center gap-3 text-white">
            <p className="text-zinc-200">Configure o tempo da partida</p>

            <div className="flex items-center gap-3">
              <label className="text-sm">Tempo (min)</label>
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
              <label className="text-sm">Rodadas</label>
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
          <section className="flex flex-col items-center gap-4 text-white">
            <p>Insira os jogadores</p>

            {names.map((name, i) => (
              <input
                key={i}
                value={name}
                onChange={(e) => handleChange(i, e.target.value)}
                placeholder={`Jogador ${i + 1}`}
                className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 w-64 text-white"
              />
            ))}

            <button onClick={addPlayer} className="text-sm text-emerald-400 hover:underline">
              + adicionar jogador
            </button>
          </section>

          {/* START */}
          <button
            onClick={startDuel}
            disabled={names.filter((n) => n.trim() !== "").length < 2 || rounds < 1}
            className="mt-4 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Iniciar Duel
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
