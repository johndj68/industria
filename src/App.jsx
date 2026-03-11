import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SimuladorART from "./fermentacao/simuladorART";
import SimuladorMicrobiologico from "./microbiologia/viabilidade";

function Home() {
  return (
    <div>
      <h1>Página Inicial</h1>

      <Link to="/simulador">
        <button>Abrir Simulador</button>
      </Link>
       <Link to="/viabilidade">
        <button>Abrir viabilidade</button>
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;