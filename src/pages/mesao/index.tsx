import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useMatch } from "../../context/MatchContext";
import { useMesao } from "../../context/MesaoContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import img from "../../assets/images/Mirrodin_Besieged.webp"; // ajuste o caminho correto
import { toast } from "react-toastify";

export function BigTable() {
  const navigate = useNavigate();
  const { timeMinutes, setTimeMinutes } = useMatch();
  const { setPlayers, setTotalRounds, resetTournament } = useMesao();

  const [names, setNames] = useState<string[]>(["", "", "", ""]);
  const [rounds, setRounds] = useState<number>(1);

  /* =====================
     HANDLERS
  ===================== */

  function updateName(index: number, value: string) {
    const copy = [...names];
    copy[index] = value;
    setNames(copy);
  }

  function addPlayer() {
    setNames((prev) => [...prev, ""]);
  }

  function startMesao() {
    const filtered = names.filter((n) => n.trim() !== "");

    if (filtered.length < 4) {
      toast.error("O Mesão precisa de pelo menos 4 jogadores");
      return;
    }

    // ✅ NOVA VALIDAÇÃO: múltiplo de 4
    if (filtered.length % 4 !== 0) {
      const faltando = 4 - (filtered.length % 4);
      toast.error(`Número de jogadores inválido! Adicione mais ${faltando} jogador(es) para formar grupos completos de 4.`);
      return;
    }

    if (rounds < 1) {
      toast.error("Número de rodadas inválido");
      return;
    }

    resetTournament();

    const players = filtered.map((name) => ({
      id: crypto.randomUUID(),
      name,
      score: 0,
    }));

    setPlayers(players);
    setTotalRounds(rounds);

    toast.success("Mesão criado com sucesso!");
    navigate("/mesao");
  }

  /* =====================
     RENDER
  ===================== */

  return (
    <div className="min-h-screen flex flex-col text-zinc-100">
      <Navbar />

      <main
        className="flex-1 flex flex-col items-center justify-center gap-6 px-4 text-center relative"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay escuro para o conteúdo ficar legível */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-md">
          <h1 className="text-3xl font-bold text-white">Criar Mesão</h1>

          {/* TEMPO */}
          <div className="flex items-center gap-3 text-white">
            <label>Tempo (min)</label>
            <input
              type="number"
              min={5}
              step={5}
              value={timeMinutes}
              onChange={(e) => setTimeMinutes(Number(e.target.value))}
              className="w-20 rounded bg-zinc-900 border border-zinc-700 px-2 py-1 text-center text-white"
            />
          </div>

          {/* RODADAS */}
          <div className="flex items-center gap-3 text-white">
            <label>Rodadas</label>
            <input
              type="number"
              min={1}
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="w-20 rounded bg-zinc-900 border border-zinc-700 px-2 py-1 text-center text-white"
            />
          </div>

          {/* JOGADORES */}
          <section className="flex flex-col gap-3 w-full max-w-sm text-white">
            <p>Jogadores (mínimo 4, múltiplo de 4)</p>

            {names.map((name, i) => (
              <input
                key={i}
                value={name}
                placeholder={`Jogador ${i + 1}`}
                onChange={(e) => updateName(i, e.target.value)}
                className="bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-white"
              />
            ))}

            <button
              onClick={addPlayer}
              className="text-sm text-emerald-400 hover:underline self-start"
            >
              + adicionar jogador
            </button>
          </section>

          {/* START */}
          <button
            onClick={startMesao}
            className="mt-4 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition"
          >
            Iniciar Mesão
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
