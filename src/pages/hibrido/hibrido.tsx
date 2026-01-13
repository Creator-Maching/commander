import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useHybrid } from "../../context/HybridContext";
import { useTimer } from "../../hooks/useTimer";
import { formatTime } from "../../utils/formatTimer";
import { useMatch } from "../../context/MatchContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ importando toast

function shuffle<T>(array: T[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

export function Hybrid() {
  const navigate = useNavigate();
  const { timeMinutes } = useMatch();

  const {
    mode,
    round,
    totalRounds,
    players,
    roundPoints,
    setRoundPoint,
    nextPhase,
    resetHybrid,
  } = useHybrid();

  // Timer da rodada
  const { remaining, start, pause, reset } = useTimer({
    minutes: timeMinutes,
    onEnd: () => toast.info("Tempo esgotado!"), // ✅ substituído pelo toast
  });

  // 🔹 Agrupa jogadores para MESAO ou DUEL
  const groupedPlayers = (() => {
    if (mode === "MESAO") {
      // Mesão: grupos de 4
      return Array.from({ length: Math.ceil(players.length / 4) }, (_, i) =>
        players.slice(i * 4, i * 4 + 4)
      );
    } else {
      // Duelo: grupos de 2
      return Array.from({ length: Math.floor(players.length / 2) }, (_, i) =>
        players.slice(i * 2, i * 2 + 2)
      );
    }
  })();

  // 🔹 Ordena por pontuação e aleatoriza entre próximos para emparelhamento
  const displayGroups = groupedPlayers.map((group) => shuffle(group));

  // 🔹 Finaliza o torneio
  const handleEndTournament = () => {
    resetHybrid();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Navbar />

      <main className="flex-1 flex flex-col items-center gap-6 px-4 py-6">
        <h1 className="text-3xl font-bold">
          Rodada {round}/{totalRounds}
        </h1>

        <span className="uppercase text-emerald-400 tracking-widest">
          {mode === "MESAO" ? "Mesão (4 jogadores)" : "Duelo X1"}
        </span>

        <div className="text-5xl font-mono bg-zinc-900 px-6 py-4 rounded-xl">
          {formatTime(remaining)}
        </div>

        <div className="flex gap-3">
          <button onClick={start} className="btn bg-emerald-600">
            Start
          </button>
          <button onClick={pause} className="btn bg-yellow-600">
            Pause
          </button>
          <button onClick={() => reset(timeMinutes)} className="btn bg-red-600">
            Reset
          </button>
        </div>

        {/* =====================
            GRUPOS / DUELOS
        ===================== */}
        <section className="w-full max-w-2xl flex flex-col gap-6 mt-6">
          {displayGroups.map((group, i) => (
            <div key={i} className="bg-zinc-900 p-4 rounded-xl">
              <h2 className="font-semibold mb-3">
                {mode === "MESAO" ? `Mesa ${i + 1}` : `Duelo ${i + 1}`}
              </h2>

              {group.map((p) => (
                <div key={p.id} className="flex justify-between items-center mb-2">
                  <span>
                    {p.name} —{" "}
                    <span className="text-zinc-400">{p.totalPoints} pts</span>
                  </span>

                  <input
                    type="number"
                    min={0}
                    value={roundPoints[p.id] ?? ""}
                    onChange={(e) => setRoundPoint(p.id, Number(e.target.value))}
                    className="w-20 bg-zinc-800 rounded px-2 py-1 text-center"
                    placeholder="+pts"
                  />
                </div>
              ))}
            </div>
          ))}
        </section>

        {/* =====================
            BOTÃO DE FINALIZAR FASE
        ===================== */}
        {round < totalRounds ? (
          <button
            onClick={nextPhase}
            className="mt-6 px-6 py-3 bg-indigo-600 rounded-xl text-lg"
          >
            Finalizar Fase
          </button>
        ) : (
          <button
            onClick={handleEndTournament}
            className="mt-6 px-6 py-3 bg-red-600 rounded-xl text-lg"
          >
            Finalizar Torneio
          </button>
        )}

        {/* =====================
            RANKING FINAL
        ===================== */}
        <section className="w-full max-w-md mt-8">
          <h2 className="text-xl font-semibold mb-3">Ranking Atual</h2>
          {players
            .slice()
            .sort((a, b) => b.totalPoints - a.totalPoints)
            .map((p, i) => (
              <div
                key={p.id}
                className="flex justify-between bg-zinc-900 px-4 py-2 rounded mb-2"
              >
                <span>
                  #{i + 1} {p.name}
                </span>
                <span>{p.totalPoints} pts</span>
              </div>
            ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
