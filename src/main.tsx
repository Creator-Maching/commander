import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { MatchProvider } from "./context/MatchContext";
import { DuelProvider } from "./context/DuelContext";
import { MesaoProvider } from "./context/MesaoContext";
import { HybridProvider } from "./context/HybridContext";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify"; // ✅ importação correta

function AppWrapper() {
  return (
    <>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3000} // fecha sozinho em 3 segundos
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </>
  );
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root não encontrado");
}

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <MatchProvider>
      <MesaoProvider>
        <DuelProvider>
          <HybridProvider>
            <AppWrapper />
          </HybridProvider>
        </DuelProvider>
      </MesaoProvider>
    </MatchProvider>
  </BrowserRouter>
);
