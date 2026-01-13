import { useEffect } from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useTimer } from "../../hooks/useTimer";
import { formatTime } from "../../utils/formatTimer";
import { useMatch } from "../../context/MatchContext";
import { useMesao } from "../../context/MesaoContext";
import { toast } from "react-toastify"; // ✅ importando toast

export function Mesao() {
  const { timeMinutes } = useMatch();
  const {
    players,
    matches,
    round,
    totalRounds,
    setMatchValues,
    endRound,
    startMesao,
  } = useMesao();

  /* =====================
     BLOQUEIO DE SEGURANÇA
  ===================== */
  if (players.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100">
        <p className="text-zinc-400">
          Nenhum jogador definido. Volte para criar o Mesão.
        </p>
      </div>
    );
  }

  /* =====================
     CRIA PARTIDAS 1x
  ===================== */
  useEffect(() => {
    if (players.length >= 4 && matches.length === 0) {
      startMesao();
    }
  }, [players, matches, startMesao]);

  /* =====================
     TIMER
  ===================== */
  const { remaining, start, pause, reset } = useTimer({
    minutes: timeMinutes,
    onEnd: () => toast.info("Tempo esgotado!"), // ✅ substituído alert
  });

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Navbar />

      <main className="flex-1 flex flex-col items-center gap-6 px-4 py-10 text-center">
        <h1 className="text-3xl font-bold">
          Mesão — Rodada {round}/{totalRounds}
        </h1>

        <div className="text-6xl font-mono tracking-widest bg-zinc-900 px-8 py-6 rounded-xl shadow">
          {formatTime(remaining)}
        </div>

        <div className="flex gap-3">
          <button onClick={start} className="px-4 py-2 rounded-lg bg-emerald-600">
            Start
          </button>

          <button onClick={pause} className="px-4 py-2 rounded-lg bg-yellow-600">
            Pause
          </button>

          <button
            onClick={() => reset(timeMinutes)}
            className="px-4 py-2 rounded-lg bg-red-600"
          >
            Reset
          </button>
        </div>

        {/* =====================
           PARTIDAS
        ===================== */}
        {matches.map((match) => (
          <div
            key={match.id}
            className="w-full max-w-xl bg-zinc-900 p-4 rounded-xl"
          >
            {match.players.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 mb-2">
                <span className="flex-1 text-left font-medium">
                  {p.name}
                </span>

                <input
                  type="number"
                  min={0}
                  value={match.values[i]}
                  onChange={(e) =>
                    setMatchValues(
                      match.id,
                      match.values.map((v, idx) =>
                        idx === i ? Number(e.target.value) : v
                      )
                    )
                  }
                  className="w-16 bg-zinc-800 rounded text-center"
                />
              </div>
            ))}
          </div>
        ))}

        {matches.length > 0 && (
          <button
            onClick={endRound}
            className="mt-4 px-6 py-2 bg-blue-600 rounded-lg"
          >
            Finalizar Rodada
          </button>
        )}

        {/* =====================
           RANKING
        ===================== */}
        <section className="w-full max-w-md mt-8">
          <h2 className="text-xl font-semibold mb-3">Pontuação</h2>

          {players.map((p, i) => (
            <div
              key={p.id}
              className="flex justify-between bg-zinc-900 px-4 py-2 rounded mb-2"
            >
              <span>
                #{i + 1} {p.name}
              </span>
              <span>{p.score || 0} pts</span>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
