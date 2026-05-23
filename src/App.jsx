import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SimuladorART from "./fermentacao/simuladorART";
import SimuladorMicrobiologico from "./microbiologia/viabilidade";
import COISimulator from "./coi/GeraçaoDeVapor";
import SimuladorSilicaBaixa from "./aguas/SilicaBaixa"


function Home() {
  return (
    <div>
      <h1>Página Inicial</h1>
       <Link to="/SilicaBaixa">
        <button>Abrir Silica</button>
      </Link>

      <Link to="/simulador">
        <button>Abrir Simulador</button>
      </Link>
       <Link to="/viabilidade">
        <button>Abrir viabilidade</button>
      </Link>
       <Link to="/coigeracaodevapor">
        <button>Abrir Coigeraçao de vapor</button>
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulador" element={<SimuladorART />} />
         <Route path="/viabilidade" element={<SimuladorMicrobiologico />} />
         <Route path="/coigeracaodevapor" element={<COISimulator />} />
         <Route path="/SilicaBaixa" element={<SimuladorSilicaBaixa />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;