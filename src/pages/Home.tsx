import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import breya from "../assets/images/breya_wallpaper.jpg";

export function Home() {
  return (
    <div
      className="min-h-screen flex flex-col text-zinc-100"
      style={{
        backgroundImage: `url(${breya})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center bg-black/50">
        <h1 className="text-4xl font-bold mb-6">Coffee Commander</h1>

        <p className="text-lg text-shadow text-zinc-300 leading-relaxed">
          Coffee Commander é uma plataforma focada em organizar e emparelhar
          jogadores de Magic: The Gathering no formato Commander, respeitando
          diferentes estilos de jogo como X1, mesão, gigante de duas cabeças
          e formatos híbridos.
        </p>

        <p className="mt-4 text-zinc-300 text-shadow">
          A ideia é criar mesas mais equilibradas, divertidas e alinhadas com
          a experiência que cada jogador procura.
        </p>
      </main>

      <Footer />
    </div>
  );
}
