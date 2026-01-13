import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { useTimer } from "../../hooks/useTimer";
import { formatTime } from "../../utils/formatTimer";
import { useMatch } from "../../context/MatchContext";
import { useEffect, useState } from "react";
import type { DuelMatch } from "../../context/DuelContext";
import { useDuel } from "../../context/DuelContext";
import { pairFirstRound } from "../../utils/pairFirstRound";
import { pairByScore } from "../../utils/pairByscore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ importando toast

export function Duel() {
  const { timeMinutes } = useMatch();
  const {
    players,
    matches,
    setMatches,
    round,
    totalRounds,
    endRound,
    resetTournament,
    setPlayers,
  } = useDuel();

  const [roundStarted, setRoundStarted] = useState(false);

  const navigate = useNavigate();

  // Atualização: substituí alert por toast
  const { remaining, start, pause, reset } = useTimer({
    minutes: timeMinutes,
    onEnd: () => toast.info("Tempo esgotado!"), // ✅ toast no lugar do alert
  });

  // Gera partidas quando a rodada começa
  useEffect(() => {
    if (!roundStarted || players.length === 0) return;

    const pairs =
      round === 1 ? pairFirstRound(players) : pairByScore(players);

    const newMatches: DuelMatch[] = pairs.map((pair) => ({
      id: crypto.randomUUID(),
      playerA: pair.playerA,
      playerB: pair.playerB,
      scoreA: 0,
      scoreB: 0,
      winner: null,
    }));

    setMatches(newMatches);
  }, [roundStarted, players, round, setMatches]);

  function startRound() {
    setRoundStarted(true);
    start();
  }

  function handleEndRound() {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        let roundPoints = 0;

        matches.forEach((m) => {
          const draw = m.scoreA === m.scoreB;

          if (draw) {
            // empate 1-1
            if (m.playerA.id === player.id || m.playerB.id === player.id) {
              roundPoints += 1;
            }
          } else if (m.scoreA > m.scoreB) {
            // playerA venceu
            if (m.playerA.id === player.id) roundPoints += 2; // vitória
            if (m.playerB.id === player.id && m.scoreB === 1) roundPoints += 2; // derrota apertada
          } else {
            // playerB venceu
            if (m.playerB.id === player.id) roundPoints += 2; // vitória
            if (m.playerA.id === player.id && m.scoreA === 1) roundPoints += 2; // derrota apertada
          }
        });

        return { ...player, score: (player.score || 0) + roundPoints };
      })
    );

    setRoundStarted(false);
    reset(timeMinutes);
    endRound();
  }

  function setScore(matchId: string, scoreA: number, scoreB: number) {
    setMatches((prev: DuelMatch[]) =>
      prev.map((m) =>
        m.id === matchId ? { ...m, scoreA, scoreB } : m
      )
    );
  }

  const isTournamentFinished = round > totalRounds;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center gap-10 px-4 text-center">
        <h1 className="text-3xl font-bold">
          Duel — Rodada {round}/{totalRounds}
        </h1>

        {/* TIMER */}
        <div className="text-6xl font-mono bg-zinc-900 px-8 py-6 rounded-xl">
          {formatTime(remaining)}
        </div>

        {!isTournamentFinished && (
          <>
            {!roundStarted ? (
              <button
                onClick={startRound}
                className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500"
              >
                Iniciar Rodada
              </button>
            ) : (
              <div className="flex gap-3 justify-center">
                <button
                  onClick={pause}
                  className="px-4 py-2 rounded-lg bg-yellow-600"
                >
                  Pause
                </button>

                <button
                  onClick={() => reset(timeMinutes)}
                  className="px-4 py-2 rounded-lg bg-red-600"
                >
                  Reset
                </button>

                <button
                  onClick={handleEndRound}
                  className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
                >
                  Finalizar Rodada
                </button>
              </div>
            )}
          </>
        )}

        {isTournamentFinished && (
          <div className="mt-6 text-2xl font-semibold text-emerald-400">
            Torneio finalizado!
            <button
              onClick={() => {
                resetTournament(); // reseta os estados do contexto
                navigate("/"); // envia para o index do Duel
              }}
              className="ml-4 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500"
            >
              Reiniciar
            </button>
          </div>
        )}

        {/* PARTIDAS */}
        {matches.length > 0 && (
          <section className="flex flex-col gap-6 mt-6">
            <h2 className="text-2xl font-semibold">Partidas</h2>
            {matches.map((match) => (
              <div
                key={match.id}
                className="flex items-center gap-4 bg-zinc-900 px-6 py-4 rounded-xl"
              >
                <span>{match.playerA.name}</span>
                <span className="text-zinc-400">vs</span>
                <span>{match.playerB.name}</span>

                {/* Inputs de placar */}
                <div className="flex gap-2 ml-4 items-center">
                  <input
                    type="number"
                    min={0}
                    max={2}
                    value={match.scoreA}
                    onChange={(e) =>
                      setScore(match.id, Number(e.target.value), match.scoreB)
                    }
                    className="w-12 px-2 py-1 rounded bg-zinc-800 text-center"
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min={0}
                    max={2}
                    value={match.scoreB}
                    onChange={(e) =>
                      setScore(match.id, match.scoreA, Number(e.target.value))
                    }
                    className="w-12 px-2 py-1 rounded bg-zinc-800 text-center"
                  />
                  <span className="ml-2 font-semibold text-emerald-400">
                    {match.scoreA > match.scoreB
                      ? `${match.playerA.name} venceu`
                      : match.scoreB > match.scoreA
                      ? `${match.playerB.name} venceu`
                      : "Empate"}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* PONTUAÇÃO */}
        {players.length > 0 && (
          <section className="flex flex-col gap-2 mt-6">
            <h2 className="text-2xl font-semibold">Pontuação Atual</h2>
            {[...players]
              .sort((a, b) => (b.score || 0) - (a.score || 0)) // do maior para o menor
              .map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between bg-zinc-900 px-4 py-2 rounded-xl"
                >
                  <span>{p.name}</span>
                  <span>{p.score || 0} pts</span>
                </div>
              ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
