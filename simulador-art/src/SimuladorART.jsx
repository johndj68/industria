
import React, { useState, } from 'react';
import { Beaker, Award, Star, CheckCircle } from 'lucide-react';


const SimuladorART = () => {
  const [pontuacao, setPontuacao] = useState(0);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const [itemSegurado, setItemSegurado] = useState(null);
  const [mostrarParabens, setMostrarParabens] = useState(false);
  const [funilEncaixado, setFunilEncaixado] = useState(false);
  const [funilPosicionado, setFunilPosicionado] = useState(false);
  const [filtrando, setFiltrando] = useState(false);
  const [nivelColetor, setNivelColetor] = useState(0);
  const [peso, setPeso] = useState(0);
  const [pesando, setPesando] = useState(false);
  const [nivelAmostra, setNivelAmostra] = useState(100);
  const [funilVoltando, setFunilVoltando] = useState(false);
  const [balaoEncaixado, setBalaoEncaixado] = useState(false);
  const [balaoPosicionado, setBalaoPosicionado] = useState(false);
  const [transferindo, setTransferindo] = useState(false);
  const [nivelBalao, setNivelBalao] = useState(0);
  const [pipetaCheia, setPipetaCheia] = useState(false);
  const [nivelPipeta, setNivelPipeta] = useState(0);
  const [transferindoPipeta, setTransferindoPipeta] = useState(false);
  const [balaoNoMicroondas, setBalaoNoMicroondas] = useState(false);
  const [tempoMicroondas, setTempoMicroondas] = useState(30);
  const [aquecendo, setAquecendo] = useState(false);
  const [amostraQuente, setAmostraQuente] = useState(false);
  const [mostrarAvisoResfriamento, setMostrarAvisoResfriamento] = useState(false);
  const [pipetaAcucarCheia, setPipetaAcucarCheia] = useState(false);
  const [nivelPipetaAcucar, setNivelPipetaAcucar] = useState(0);
  const [transferindoPipetaAcucar, setTransferindoPipetaAcucar] = useState(false);
  const [adicionandoFenol, setAdicionandoFenol] = useState(false);
  const [gotasFenol, setGotasFenol] = useState(0);
  const [pipetaHClCheia, setPipetaHClCheia] = useState(false);
  const [nivelPipetaHCl, setNivelPipetaHCl] = useState(0);

  const etapas = [
    { id: 0,  titulo: "Montar Filtração",  descricao: "Arraste o funil para encaixar no coletor",  itemNecessario: "funil",  alvo: "coletor" },
    { id: 1,  titulo: "Filtrar Amostra",  descricao: "Arraste a amostra para o funil",  itemNecessario: "amostra",  alvo: "coletor"},
    { id: 2, titulo: "Posicionar Balão na Balança", descricao: "Arraste o balão até a balança", itemNecessario: "balao", alvo: "balanca" },
    { id: 3, titulo: "Pesar Amostra", descricao: "Arraste a amostra filtrada até a balança", itemNecessario: "coletor", alvo: "balanca" },
    { id: 4, titulo: "Carregar Pipeta",descricao: "Arraste a pipeta de 20mL até o NaOH 20%", itemNecessario: "pipeta", alvo: "naoh"},
    { id: 5, titulo: "Transferir NaOH", descricao: "Arraste a pipeta até o balão da bancada", itemNecessario: "pipeta",   alvo: "balao-bancada" },
    { id: 6, titulo: "Aquecer no Microondas", descricao: "Arraste o balão até o microondas", itemNecessario: "balao", alvo: "microondas" },
    { id: 7,  titulo: "Carregar Pipeta com Açúcar Invertido",  descricao: "Arraste a pipeta até o Açúcar Invertido",  itemNecessario: "pipeta",  alvo: "acucar"},
    { id: 8,  titulo: "Transferir Açúcar Invertido",  descricao: "Arraste a pipeta até o balão da bancada",  itemNecessario: "pipeta",  alvo: "balao-bancada"},
    { id: 9,  titulo: "Adicionar Fenolftaleína",  descricao: "Arraste a Fenolftaleína até o balão da bancada",  itemNecessario: "fenol",  alvo: "balao-bancada"},
    {id: 10,  titulo: "Carregar Pipeta com HCl",  descricao: "Arraste a pipeta até o HCl",  itemNecessario: "pipeta",  alvo: "acido"},
  ];

  const handleDragStart = (item, e) => {
  if (pesando) return; // ⛔ bloqueia drag durante pesagem
  setItemSegurado(item);
  e.dataTransfer.effectAllowed = 'move';
};

  const handleDragEnd = () => {
    setItemSegurado(null);
  };

 const handleDrop = (alvo, e) => {
  e.preventDefault();

  // 🔹 ETAPA 0 — FUNIL NO COLETOR
  if (itemSegurado === 'funil' && alvo === 'coletor' && etapaAtual === 0) {
    setFunilPosicionado(true);

    setTimeout(() => {
      setFunilEncaixado(true);
    }, 700);

    celebrarAcerto();
    proximaEtapa();
    setItemSegurado(null);
    return;
  }

  // 🔹 ETAPA 1 — FILTRAÇÃO
  if (
    itemSegurado === 'amostra' &&
    alvo === 'coletor' &&
    funilEncaixado &&
    etapaAtual === 1
  ) {
    setFiltrando(true);
    celebrarAcerto();
    proximaEtapa();
    setItemSegurado(null);
    return;
  }

  // 🔹 ETAPA 2 — BALÃO NA BALANÇA (⚠️ TEM QUE VIR ANTES DO GENÉRICO)
  if (
    itemSegurado === 'balao' &&
    alvo === 'balanca' &&
    etapaAtual === 2
  ) {
    setBalaoPosicionado(true);

    setTimeout(() => {
      setBalaoEncaixado(true);
      setPesando(true);
    }, 600);

    celebrarAcerto();
    proximaEtapa();
    setItemSegurado(null);
    return;
  }
    // 🔹 ETAPA 3 — COLETOR NA BALANÇA → INICIA TRANSFERÊNCIA
  if (
    itemSegurado === 'coletor' &&
    alvo === 'balanca' &&
    etapaAtual === 3
  ) {
    setTransferindo(true);
    celebrarAcerto();
    proximaEtapa();
    setItemSegurado(null);
    return;
  }
  // 🔹 ETAPA 4 — PIPETA NO NaOH
if (
  itemSegurado === 'pipeta' &&
  alvo === 'naoh' &&
  etapaAtual === 4 &&
  !pipetaCheia
) {
  setPipetaCheia(true);
  celebrarAcerto();
  proximaEtapa();
  setItemSegurado(null);
  return;
}

if (
  itemSegurado === 'pipeta' &&
  alvo === 'acido' &&
  etapaAtual === 10 &&
  !pipetaHClCheia
) {
  setPipetaHClCheia(true);
  celebrarAcerto();
  proximaEtapa();
  setItemSegurado(null);
  return;
}

// 🔹 ETAPA 5 — PIPETA NO BALÃO DA BANCADA
if (
  itemSegurado === 'pipeta' &&
  alvo === 'balao-bancada' &&
  etapaAtual === 5 &&
  pipetaCheia
) {
  setTransferindoPipeta(true);
  celebrarAcerto();
  proximaEtapa();
  setItemSegurado(null);
  return;
}
// 🔹 ETAPA 6 — BALÃO NO MICROONDAS
if (
  itemSegurado === 'balao' &&
  alvo === 'microondas' &&
  etapaAtual === 6
) {
  setBalaoNoMicroondas(true);
  setAquecendo(true);
  setTempoMicroondas(30); // começa em 30s

  celebrarAcerto();
  proximaEtapa();
  setItemSegurado(null);
  return;
}

// 🔹 ETAPA 7 — PIPETA NO AÇÚCAR INVERTIDO
if (
  itemSegurado === 'pipeta' &&
  alvo === 'acucar' &&
  etapaAtual === 7 &&
  !pipetaAcucarCheia
) {
  setPipetaAcucarCheia(true);
  celebrarAcerto();
  proximaEtapa();
  setItemSegurado(null);
  return;
}

// 🔹 ETAPA 8 — TRANSFERIR AÇÚCAR PARA O BALÃO
if (
  itemSegurado === 'pipeta' &&
  alvo === 'balao-bancada' &&
  etapaAtual === 8 &&
  pipetaAcucarCheia
) {
  setTransferindoPipetaAcucar(true);
  celebrarAcerto();
  proximaEtapa();
  setItemSegurado(null);
  return;
}
// 🔹 ETAPA 9 — FENOLFTALEÍNA NO BALÃO
if (
  itemSegurado === 'fenol' &&
  alvo === 'balao-bancada' &&
  etapaAtual === 9
) {
  setAdicionandoFenol(true);
  setGotasFenol(0);

  setItemSegurado(null);
  return;
}

  // 🔹 REGRA GENÉRICA (somente depois)
  if (
    itemSegurado === etapas[etapaAtual]?.itemNecessario &&
    alvo === etapas[etapaAtual]?.alvo
  ) {
    if (alvo === 'balanca') {
      setPesando(true);
    }

    celebrarAcerto();
    proximaEtapa();
    setItemSegurado(null);
    return;
  }

  setItemSegurado(null);
};

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const celebrarAcerto = () => {
    setPontuacao(pontuacao + 100);
    setMostrarParabens(true);
    setTimeout(() => setMostrarParabens(false), 2000);
  };

  const proximaEtapa = () => {
    if (etapaAtual < etapas.length - 1) {
      setEtapaAtual(etapaAtual + 1);
    }
  };
    React.useEffect(() => {
    if (!filtrando) return;

    const intervalo = setInterval(() => {
        setNivelColetor((prev) => {
       if (prev >= 100) {
            clearInterval(intervalo);
            setFiltrando(false);

            // dispara retorno do funil
            setFunilVoltando(true);

            return 100;
          }

        return prev + 5;
        });
    }, 200);

    return () => clearInterval(intervalo);
    }, [filtrando]);
    React.useEffect(() => {
  if (!filtrando) return;

  const intervalo = setInterval(() => {
    setNivelAmostra((prev) => {
      if (prev <= 0) {
        clearInterval(intervalo);
        return 0;
      }
      return prev - 5;
    });
  }, 200);

  return () => clearInterval(intervalo);
}, [filtrando]);

React.useEffect(() => {
  if (!funilVoltando) return;

  // primeiro desenxaixa
  setFunilEncaixado(false);

  // depois remove do coletor e volta para lateral
  setTimeout(() => {
    setFunilPosicionado(false);
    setFunilVoltando(false);
  }, 700);
}, [funilVoltando]);

    React.useEffect(() => {
    if (!pesando) return;

    let valor = 0;

    const intervalo = setInterval(() => {
        valor += 1;
        setPeso(valor);

        if (valor >= 50) {
        clearInterval(intervalo);
        setPesando(false);
        }
    }, 100);

    return () => clearInterval(intervalo);
    }, [pesando]);

    React.useEffect(() => {
  if (!pipetaCheia) return;

  const intervalo = setInterval(() => {
    setNivelPipeta((prev) => {
      if (prev >= 100) {
        clearInterval(intervalo);
        return 100;
      }
      return prev + 5;
    });
  }, 150);

  return () => clearInterval(intervalo);
}, [pipetaCheia]);

React.useEffect(() => {
  if (!pipetaAcucarCheia) return;

  const intervalo = setInterval(() => {
    setNivelPipetaAcucar((prev) => {
      if (prev >= 100) {
        clearInterval(intervalo);
        return 100;
      }
      return prev + 5;
    });
  }, 150);

  return () => clearInterval(intervalo);
}, [pipetaAcucarCheia]);

React.useEffect(() => {
  if (!transferindoPipeta) return;

  const intervalo = setInterval(() => {
    setNivelPipeta((prev) => {
      if (prev <= 0) {
        clearInterval(intervalo);
        setTransferindoPipeta(false);
        setPipetaCheia(false);

        // ✅ SOBE UM POUCO O LÍQUIDO DO BALÃO DA BANCADA
        setNivelBalao((balaoPrev) =>
          Math.min(balaoPrev + 12, 100)
        );

        return 0;
      }
      return prev - 5;
    });
  }, 150);

  return () => clearInterval(intervalo);
}, [transferindoPipeta]);

    React.useEffect(() => {
  if (!transferindo) return;

  const intervalo = setInterval(() => {
    setNivelColetor((prev) => {
      if (prev <= 0) {
      clearInterval(intervalo);
      setTransferindo(false);

      // ⏱️ pequena pausa para finalizar animação
      setTimeout(() => {
        setBalaoEncaixado(false);
        setBalaoPosicionado(false);
      }, 600);

      return 0;
    }
      return prev - 5;
    });

    setNivelBalao((prev) => {
      if (prev >= 100) return 100;
      return prev + 5;
    });
  }, 200);

  return () => clearInterval(intervalo);
}, [transferindo]);

React.useEffect(() => {
  if (!transferindoPipetaAcucar) return;

  const intervalo = setInterval(() => {
    setNivelPipetaAcucar((prev) => {
      if (prev <= 0) {
        clearInterval(intervalo);
        setTransferindoPipetaAcucar(false);
        setPipetaAcucarCheia(false);

        // 🍬 AUMENTA O NÍVEL DO BALÃO
        setNivelBalao((balaoPrev) =>
          Math.min(balaoPrev + 10, 100)
        );

        return 0;
      }
      return prev - 5;
    });
  }, 150);

  return () => clearInterval(intervalo);
}, [transferindoPipetaAcucar]);

React.useEffect(() => {
  if (!aquecendo) return;

  // 30 → 0 em 3 segundos
  // 30 passos, cada passo = 100ms
  const intervalo = setInterval(() => {
    setTempoMicroondas((prev) => {
    if (prev <= 1) {
  clearInterval(intervalo);
  setAquecendo(false);

  setBalaoNoMicroondas(false);
  setBalaoPosicionado(false);

  // 🔥 ATIVA ESTADO DE AMOSTRA QUENTE
  setAmostraQuente(true);
  setMostrarAvisoResfriamento(true);

  // ⏱️ após alguns segundos, esfria
  setTimeout(() => {
    setAmostraQuente(false);
    setMostrarAvisoResfriamento(false);
  }, 4000); // 4 segundos

  return 0;
}
      return prev - 1;
    });
  }, 100); // 100ms × 30 = 3s

  return () => clearInterval(intervalo);
}, [aquecendo]);

React.useEffect(() => {
  if (!adicionandoFenol) return;

  const intervalo = setInterval(() => {
    setGotasFenol((prev) => {
      if (prev >= 3) {
        clearInterval(intervalo);
        setAdicionandoFenol(false);

        // 🎉 AGORA SIM: sucesso da etapa
        celebrarAcerto();
        proximaEtapa();

        return 3;
      }
      return prev + 1;
    });
  }, 1000); // ✅ 1 gota por segundo

  return () => clearInterval(intervalo);
}, [adicionandoFenol]);

React.useEffect(() => {
  if (!pipetaHClCheia) return;

  const intervalo = setInterval(() => {
    setNivelPipetaHCl((prev) => {
      if (prev >= 100) {
        clearInterval(intervalo);
        return 100;
      }
      return prev + 5;
    });
  }, 150);

  return () => clearInterval(intervalo);
}, [pipetaHClCheia]);


  const [estrelas] = useState(() =>
  Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.5}s`,
  }))
);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-4 relative">
      
      {mostrarParabens && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white px-12 py-8 rounded-3xl shadow-2xl animate-bounce border-4 border-white">
            <div className="flex items-center gap-4">
              <Star className="w-12 h-12" fill="currentColor" />
              <div>
                <h3 className="text-3xl font-bold">Parabéns!</h3>
                <p className="text-xl">+100 pontos</p>
              </div>
              <CheckCircle className="w-12 h-12" />
            </div>
          </div>
          <div className="absolute inset-0">
          {estrelas.map((estrela) => (
  <Star
    key={estrela.id}
    className="absolute text-yellow-400 animate-ping"
    fill="currentColor"
    style={{
      left: estrela.left,
      top: estrela.top,
      width: '24px',
      animationDelay: estrela.delay,
    }}
  />
))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Beaker className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Análise de ART - Dorna</h1>
                <p className="text-blue-100">Açúcares Redutores Totais</p>
              </div>
            </div>
            <div className="bg-yellow-400 px-6 py-3 rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-900" />
                <span className="text-2xl font-bold text-yellow-900">{pontuacao}</span>
              </div>
              <p className="text-xs text-yellow-800 text-center">pontos</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 mb-6 border-4 border-green-300">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold text-white">
              {etapaAtual + 1}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">{etapas[etapaAtual]?.titulo}</h2>
              <p className="text-green-100 text-lg">{etapas[etapaAtual]?.descricao}</p>
            </div>
            <div className="text-white text-right">
              <p className="text-sm opacity-80">Progresso</p>
              <p className="text-3xl font-bold">{etapaAtual}/{etapas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-amber-100 to-amber-200 rounded-3xl shadow-2xl p-8 border-8 border-amber-900">
          <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Bancada do Laboratório</h2>
          
          <div className="bg-gradient-to-b from-stone-400 to-stone-500 rounded-2xl p-8 shadow-inner border-4 border-stone-600 min-h-[700px]">
            
            <div className="flex justify-around items-end mb-12">
              
              <div 
                className="flex flex-col items-center"
                onDrop={(e) => handleDrop('balanca', e)}
                onDragOver={handleDragOver}
              >
                <div className={`bg-gradient-to-b from-gray-300 to-gray-400 w-32 h-24 rounded-lg border-4 shadow-xl relative transition-all ${
                  etapas[etapaAtual]?.alvo === 'balanca' ? 'border-green-500 shadow-green-500/50 scale-105' : 'border-gray-600'
                }`}>
                  {etapaAtual >= 3 && (
                            <div className="absolute -top-20">
                              {/* desenho do coletor */}
                            </div>
                          )}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-green-400 w-20 h-8 rounded border-2 border-gray-700 flex items-center justify-center">
                    <span className="text-gray-800 font-mono text-sm font-bold">{peso.toFixed(1)}g</span>
                  </div>
                  {balaoPosicionado && (
                            <div 
                              className="flex flex-col items-center cursor-move -mt-12"
                              draggable={etapaAtual >= 2 && !balaoEncaixado}
                              onDragStart={(e) => handleDragStart('balao', e)}
                              onDragEnd={handleDragEnd}
                            >
                              <div className={`relative transition-all hover:scale-105 ${
                                itemSegurado === 'balao' ? 'opacity-50' : ''
                              } ${etapas[etapaAtual]?.alvo === 'balao' ? 'scale-110' : ''}`}>
                                <div className="w-6 h-11 bg-gradient-to-b from-cyan-100/40 to-transparent border-4 border-cyan-300 mx-auto"></div>
                             <div className={`w-24 h-20 bg-gradient-to-b from-cyan-100/40 to-cyan-200/60 
                                  border-2 rounded-full relative shadow-lg overflow-hidden
                                  ${etapas[etapaAtual]?.alvo === 'balao' ? 'border-green-500' : 'border-cyan-300'}
                                `}>

                                  {/* MARCA DE VOLUME */}
                                  <div className="absolute top-8 left-2 right-2 h-0.5 bg-blue-600"></div>
                                  <div className="absolute top-8 right-0 text-xs text-blue-900 font-bold">
                                    200mL
                                  </div>
                                  

                                  {/* ✅ LÍQUIDO REALMENTE DENTRO */}
                                  <div
                                    className="absolute bottom-0 left-0 right-0 bg-amber-600 transition-all duration-300"
                                    style={{ height: `${nivelBalao*0.55}%` }}
                                  />
                                </div>
                                
                              </div>
                              <p className="text-xs font-semibold text-gray-800 mt-2">
                                {etapaAtual >= 2 ? '' : ''} 
                              </p>
                               
                            </div>
                          )}

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2  w-24 h-8 rounded border-2 border-gray-600 shadow-inner"></div>
                </div>
                <p className="text-xs font-semibold text-gray-00 mt-2">Balança</p>
              </div>

              <div 
                      className="flex flex-col items-center"
                      onDrop={(e) => handleDrop('microondas', e)}
                      onDragOver={handleDragOver}
                    >
                <div className={`bg-gradient-to-br from-gray-600 to-gray-800 w-40 h-32 rounded-xl border-4 shadow-xl relative transition-all ${
                  etapas[etapaAtual]?.alvo === 'microondas' ? 'border-green-500 shadow-green-500/50 scale-105' : 'border-gray-900'
                }`}>
                  <div className="absolute top-2 right-2 w-16 h-6 bg-black rounded flex items-center justify-center">
                    <span className="text-green-400 font-mono text-xs">00:{tempoMicroondas.toString().padStart(2, '0')}</span>
                  </div>
                  <div className="absolute top-10 left-4 right-4 bottom-4 bg-gray-900 rounded-lg border-2 border-gray-700"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 bg-gray-400 rounded-full border-2 border-gray-600"></div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-2">Microondas</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-gradient-to-br from-gray-300 to-gray-500 w-44 h-48 rounded-lg border-4 border-gray-700 shadow-2xl relative">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black w-36 h-10 rounded border-2 border-gray-900 flex items-center justify-center">
                    <span className="text-green-400 font-mono text-base font-bold">TE-088</span>
                  </div>
                  <div className="absolute top-16 left-1/2 -translate-x-1/2 w-32 h-24 bg-gradient-to-b from-blue-300/30 to-blue-500/50 rounded-lg border-4 border-gray-600 shadow-inner"></div>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3">
                    <div className="w-8 h-8 bg-red-500 rounded-full border-3 border-red-700 shadow-lg"></div>
                    <div className="w-8 h-8 bg-green-500 rounded-full border-3 border-green-700 shadow-lg"></div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-3 border-blue-700 shadow-lg"></div>
                  </div>
                  <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-28 h-3 bg-gradient-to-r from-orange-600 to-red-600 rounded"></div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-2">Determinador TE-088</p>
              </div>
            </div>

            <div className="flex justify-around items-end mb-8">
              
              <div 
                className="flex flex-col items-center cursor-move"
                draggable
                onDragStart={(e) => handleDragStart('amostra', e)}
                onDragEnd={handleDragEnd}
              >
                <div className={`relative transition-all hover:scale-110 ${itemSegurado === 'amostra' ? 'opacity-50' : ''}`}>
                  <div className="w-20 h-24 bg-gradient-to-b from-cyan-100/40 to-cyan-200/60 border-4 border-cyan-300 rounded-b-lg relative shadow-lg">
                    <div className="absolute bottom-0 left-2 right-2 bg-amber-700/60 rounded-b transition-all duration-300" style={{ height: `${nivelAmostra}%` }}></div>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-cyan-400"></div>
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-2">🖱️ Amostra</p>
              </div>

              <div 
                className="flex flex-col items-center"
                onDragOver={handleDragOver}
              >
              <div className={`relative transition-all duration-700 ${
                              funilEncaixado ? 'translate-y-6 scale-95' : 
                ''}`} ></div>
                <div
                      onDrop={(e) => handleDrop('coletor', e)}
                      onDragOver={handleDragOver}
                      className="relative w-32 h-40 flex items-start justify-center"
                    >

                   {/* FUNIL LATERAL */}
                  {!funilPosicionado && (
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart('funil', e)}
                      onDragEnd={handleDragEnd}
                      className={` w-16 h-40 bg-gradient-to-b from-cyan-100/40 to-transparent border-1-4 border-r-4 border-t-4 transition-all
                        ${itemSegurado === 'funil' ? 'opacity-50' : ''}`}
                        style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}>
                          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-12 bg-cyan-200/60 border-2 border-cyan-300"></div>
                          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-4 bg-white rounded-full border-2 border-gray-300"></div>
                      <p className="text-xs font-semibold text-gray-800 mt-20">🖱️ Funil</p>
                    </div>
                    
                  )}
              </div>
              </div>

              <div
                className="flex flex-col items-center relative"
                draggable={etapaAtual >= 3}
                onDragStart={(e) => handleDragStart('coletor', e)}
                onDragEnd={handleDragEnd}
                onDrop={(e) => handleDrop('coletor', e)}
                onDragOver={handleDragOver}
              >
                {(funilPosicionado || funilEncaixado) && (
                <div className={`absolute ${funilEncaixado ? '-top-10' : '-top-20'}`}>
                  <div className="w-16 h-16 bg-gradient-to-b from-cyan-100/40 to-transparent border-l-4 border-r-4 border-t-4 transition-all" 
                  style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }}>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-12 bg-cyan-200/60 border-2 border-cyan-300"></div>
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-4 bg-white rounded-full border-2 border-gray-300"></div>
                    <p className="text-xs font-semibold text-gray-800 mt-2"></p>
                  </div>
                </div>
              )}
                  {/* COLETOR */}
                  <div className={`w-24 h-24 bg-gradient-to-b from-cyan-100/40 to-cyan-200/60 
                        border-4 rounded-b-2xl relative shadow-lg overflow-hidden transition-all
                        ${
                          etapas[etapaAtual]?.alvo === 'coletor'
                            ? 'border-green-500 shadow-green-500/50 scale-105'
                            : 'border-cyan-300'
                        }
                      `}>
                    
                    {/* LÍQUIDO */}
                    <div
                      className="absolute bottom-0 bg-amber-600 w-full transition-all duration-300"
                      style={{ height: `${nivelColetor}%` }}
                    />
                  </div>

                  <p className="text-xs font-semibold text-gray-800 mt-2">🖱️ Coletor</p>
                </div>
               {/* SLOT FIXO DO BALÃO DA BANCADA */}
            <div className="flex flex-col items-center relative min-h-[180px] w-[190px]">

              {!balaoPosicionado && !balaoNoMicroondas && (
                <div
                  className="flex flex-col items-center cursor-move relative"
                  draggable={etapas[etapaAtual]?.itemNecessario === 'balao'}
                  onDragStart={(e) => handleDragStart('balao', e)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop('balao-bancada', e)}
                  onDragOver={handleDragOver}
                >
                  <div className="w-6 h-12 bg-gradient-to-b from-cyan-100/40 to-transparent border-2 border-cyan-300 mx-auto"></div>

                  <div className="w-24 h-32 bg-gradient-to-b from-cyan-100/40 to-cyan-200/60 
                                  border-4 border-cyan-300 rounded-full shadow-lg relative overflow-hidden">

                    <div className="absolute top-8 left-2 right-2 h-0.5 bg-blue-600"></div>
                    <div className="absolute top-4 right-1 text-xs text-blue-900 font-bold">
                      200mL
                    </div>
                   {/* GOTAS DE FENOLFTALEÍNA (CAINDO) */}
                      {gotasFenol > 0 &&
                        Array.from({ length: gotasFenol }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                           style={{   top: `${10 + i * 8}px`,
                                      animation: `quedaGota 0.8s ease-in forwards`,
                                    }}
                          >
                            <div
                              className="w-2 h-4 bg-pink-500"
                              style={{
                                clipPath:
                                  'polygon(50% 0%, 70% 30%, 100% 60%, 50% 100%, 0% 60%, 30% 30%)',
                              }}
                            />
                          </div>
                        ))}
                    <div
                      className={`absolute bottom-0 left-0 right-0 transition-all duration-300
                        ${amostraQuente ? 'bg-red-500 animate-pulse' : 'bg-amber-600'}
                      `}
                      style={{ height: `${nivelBalao * 0.55}%` }}
                    />
                  </div>

                  <p className="text-xs font-semibold text-gray-800 mt-2">🖱️ Balão</p>

                  {mostrarAvisoResfriamento && (
                    <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-50">
                      <div className="bg-red-600 text-white px-4 py-2 rounded-xl shadow-2xl animate-pulse text-xs text-center whitespace-nowrap">
                        🔥 Aguarde a amostra atingir a temperatura ambiente
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-blue-800"></div>
                  <div className="w-10 h-48 bg-gradient-to-b from-cyan-50/60 to-cyan-100/80 border-4 border-cyan-400 rounded-b relative shadow-lg">
                    {[0, 10, 20, 30, 40, 50].map((val, i) => (
                      <div key={val} className="absolute left-0 w-full" style={{ top: `${i * 38.4}px` }}>
                        <div className="flex items-center justify-between px-1">
                          <div className="w-3 h-0.5 bg-blue-700"></div>
                          <span className="text-xs font-bold text-blue-900">{val}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-2 h-4 bg-cyan-300 border-2 border-cyan-500"></div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-6">Bureta 50mL</p>
              </div>

              <div
                    className="flex flex-col items-center cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart('pipeta', e)}
                    onDragEnd={handleDragEnd}
                  >
                <div className="relative">
                  <div className="w-6 h-6 bg-red-400 rounded-full border-2 border-red-600 mx-auto"></div>
                  <div className="w-2 h-8 bg-gradient-to-b from-cyan-100/60 to-cyan-200/80 border-2 border-cyan-400 mx-auto"></div>
                  <div className="w-16 h-20 bg-gradient-to-b from-cyan-20/60 to-cyan-100/0 border-4 border-cyan-400 rounded-full mx-auto relative shadow-lg overflow-hidden">
                 {/* LÍQUIDO DA PIPETA (NaOH ou Açúcar) */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 transition-all duration-300
                          ${
                          pipetaHClCheia
                          ? 'bg-red-400'
                          : pipetaAcucarCheia
                          ? 'bg-blue-400'
                          : pipetaCheia
                          ? 'bg-blue-300'
                          : 'bg-gray-300'
                          }
                        `}
                        style={{
                          height: pipetaHClCheia
                          ? `${nivelPipetaHCl}%`
                          : pipetaAcucarCheia
                          ? `${nivelPipetaAcucar}%`
                          : `${nivelPipeta}%`
                        }}
                      />

                      <div className="absolute top-2 left-0 right-0 h-0.5 bg-blue-700"></div>
                      <div className="absolute top-2 right-1 text-xs font-bold text-blue-900">
                        20mL
                      </div>
                    </div>
                  <div className="w-3 h-16 bg-gradient-to-b from-cyan-100/60 to-cyan-200/80 border-2 border-cyan-400 mx-auto"></div>
                  <div className="w-1 h-3 bg-cyan-300 border border-cyan-500 mx-auto"></div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-2">Pipeta 20mL</p>
              </div>
            </div>

            <div className="flex justify-around items-end flex-wrap gap-4">
              
                        <div
            className="flex flex-col items-center"
            onDrop={(e) => handleDrop('acido', e)}
            onDragOver={handleDragOver}
          >
            <div
              className={`w-16 h-20 bg-gradient-to-b from-red-600 to-red-700 
                border-4 border-red-900 rounded-lg relative shadow-lg transition-all
                ${etapas[etapaAtual]?.alvo === 'acido'
                  ? 'border-green-500 shadow-green-500/50 scale-105'
                  : ''
                }
              `}
            >
              <div className="absolute top-1 left-1 right-1 h-3 bg-red-800 rounded-t"></div>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white text-xs font-bold">
                HCl
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-800 mt-1">HCl</p>
          </div>

               <div
                    className="flex flex-col items-center"
                    onDrop={(e) => handleDrop('acucar', e)}
                    onDragOver={handleDragOver}
                  >
                    <div
                      className={`w-16 h-20 bg-gradient-to-b from-amber-400 to-amber-500 
                        border-4 border-amber-700 rounded-lg relative shadow-lg transition-all
                        ${
                          etapas[etapaAtual]?.alvo === 'acucar'
                            ? 'border-green-500 shadow-green-500/50 scale-105'
                            : ''
                        }
                      `}
                    >
                      <div className="absolute top-1 left-1 right-1 h-3 bg-amber-600 rounded-t"></div>
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-amber-900 text-xs font-bold">
                        Açúcar
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-gray-800 mt-1">Açúcar Inv.</p>
                  </div>

             <div
                      className="flex flex-col items-center cursor-move"
                      draggable={etapas[etapaAtual]?.itemNecessario === 'fenol'}
                      onDragStart={(e) => handleDragStart('fenol', e)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="w-12 h-16 bg-gradient-to-b from-pink-300 to-pink-400 border-4 border-pink-600 rounded-lg relative shadow-lg">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-6 bg-pink-500 rounded-t-full border-2 border-pink-700"></div>
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-pink-900 text-xs font-bold">Fen.</div>
                      </div>
                      <p className="text-xs font-semibold text-gray-800 mt-1">Fenolftaleína</p>
                    </div>

              <div
                    className="flex flex-col items-center"
                    onDrop={(e) => handleDrop('naoh', e)}
                    onDragOver={handleDragOver}
                  >
                  <div className={`w-16 h-20 bg-gradient-to-b from-blue-300 to-blue-400 border-4 rounded-lg relative shadow-lg transition-all
      ${etapas[etapaAtual]?.alvo === 'naoh'? 'border-green-500 shadow-green-500/50 scale-105': 'border-blue-600'}`}>
                  <div className="absolute top-1 left-1 right-1 h-3 bg-blue-500 rounded-t"></div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 text-blue-900 text-xs font-bold">NaOH</div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-1">NaOH 20%</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-20 bg-gradient-to-b from-purple-400 to-purple-500 border-4 border-purple-700 rounded-lg relative shadow-lg">
                  <div className="absolute top-1 left-1 right-1 h-3 bg-purple-600 rounded-t"></div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 text-purple-900 text-xs font-bold">EDTA</div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-1">EDTA 4%</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-20 bg-gradient-to-b from-blue-500 to-blue-600 border-4 border-blue-800 rounded-lg relative shadow-lg">
                  <div className="absolute top-1 left-1 right-1 h-3 bg-blue-700 rounded-t"></div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white text-xs font-bold">Feh. A</div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-1">Fehling A</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-20 bg-gradient-to-b from-green-500 to-green-600 border-4 border-green-800 rounded-lg relative shadow-lg">
                  <div className="absolute top-1 left-1 right-1 h-3 bg-green-700 rounded-t"></div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white text-xs font-bold">Feh. B</div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-1">Fehling B</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-16 bg-gradient-to-b from-blue-700 to-blue-800 border-4 border-blue-900 rounded-lg relative shadow-lg">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-6 bg-blue-800 rounded-t-full border-2 border-blue-900"></div>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white text-xs font-bold">A.M.</div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-1">Azul Met.</p>
              </div>

              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-12 h-16 bg-gradient-to-b from-cyan-200 to-cyan-300 border-4 border-cyan-500 rounded-lg relative shadow-lg">
                    <div className="absolute -top-2 -right-2 w-6 h-10 bg-cyan-300 border-2 border-cyan-500 rounded-t-full transform rotate-45"></div>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 text-cyan-900 text-xs font-bold">H₂O</div>
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-1">Água</p>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-6 bg-blue-500 rounded-xl shadow-xl p-4 text-center">
          <p className="text-white font-semibold">💡 Arraste os itens com 🖱️ para os locais destacados em verde!</p>
        </div>
      </div>
    </div>
  );
};export default SimuladorART;