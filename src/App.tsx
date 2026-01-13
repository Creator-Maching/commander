import { Routes, Route } from "react-router-dom";
import { Home }  from "./pages/Home";
import { Xone } from "./pages/duel";
import { BigTable } from "./pages/mesao";
import { Gigant } from "./pages/gigante";
import { Hibrido } from "./pages/hibrido";
import { Duel } from "./pages/duel/Duel";
import { Gigante } from "./pages/gigante/Gigante";
import { Hybrid } from "./pages/hibrido/hibrido";
import { Mesao } from "./pages/mesao/mesao";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/xone" element={<Xone />} />
      <Route path="/bigtable" element={<BigTable />} />
      <Route path="/mesao" element={<Mesao />} />
      <Route path="/gigant" element={<Gigant />} />
      <Route path="/hybrid" element={<Hybrid />} />
      <Route path="/duel" element={<Duel />} />
      <Route path="/gigante" element={<Gigante />} />
      <Route path="/hibrido" element={<Hibrido />} />
    </Routes>
  );
}

export default App;
