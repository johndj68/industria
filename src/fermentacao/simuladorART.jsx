
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
  const [titulando, setTitulando] = useState(false);
  const [corBalao, setCorBalao] = useState('amber');
  const [agitacao, setAgitacao] = useState(false);
  const [nivelAlvoPipetaHCl, setNivelAlvoPipetaHCl] = useState(100);
  const [neutralizandoEDTA, setNeutralizandoEDTA] = useState(false);
  const [gotasEDTA, setGotasEDTA] = useState(0);
  const [gotejandoEDTA, setGotejandoEDTA] = useState(false);
  const [adicionandoAgua, setAdicionandoAgua] = useState(false);
  const [nivelAlvoBalao, setNivelAlvoBalao] = useState(100); // menisco
  const [diluindo, setDiluindo] = useState(false);
  const [te088Ligado, setTe088Ligado] = useState(false);
  const [te088Aquecendo, setTe088Aquecendo] = useState(false);
  const [fervendo, setFervendo] = useState(false);
  const [te088Quente, setTe088Quente] = useState(false);
  const [fehlingAAdicionado, setFehlingAAdicionado] = useState(false);
  const [nivelErlenmeyerTE, setNivelErlenmeyerTE] = useState(0);
  const [fehlingBAdicionado, setFehlingBAdicionado] = useState(false);
  const [pipetaAzulCheia, setPipetaAzulCheia] = useState(false);
  const [nivelPipetaAzul, setNivelPipetaAzul] = useState(0);
  const [erlenmeyerDireitoAzul, setErlenmeyerDireitoAzul] = useState(false);
  const [gotasAzul, setGotasAzul] = useState(0);
  const [gotejandoAzul, setGotejandoAzul] = useState(false);
  const [posicaoGotasAzul, setPosicaoGotasAzul] = useState([]);
  const [transferindoBalaoParaBureta, setTransferindoBalaoParaBureta] = useState(false);
  const [nivelBuretaDireita, setNivelBuretaDireita] = useState(0);
  const [corBuretaDireita, setCorBuretaDireita] = useState('#ffffff');
  const [gotejandoBuretaDireita, setGotejandoBuretaDireita] = useState(false);
  const [corErlenmeyerDireitoFinal, setCorErlenmeyerDireitoFinal] = useState('#3b82f6'); // azul inicial
  const [posicaoGotasBureta, setPosicaoGotasBureta] = useState([]);



  const ligarTE088 = () => {
  if (etapaAtual !== 17) return;

  setTe088Ligado(true);
  setTe088Aquecendo(true);

   // 🔽 AUMENTO SUAVE DO NÍVEL
    setNivelErlenmeyerTE((prev) => Math.min(prev + 5, 25));

  // inicia fervura visual
  setFervendo(true);

  // tempo de aquecimento (ex: 4s)
  setTimeout(() => {
    setTe088Aquecendo(false);
    setFervendo(false);

    setTe088Quente(true);

    celebrarAcerto();
    proximaEtapa();
  }, 4000);
};





  const etapas = [
    { id: 0, titulo: "Montar Filtração",  descricao: "Arraste o funil para encaixar no coletor",  itemNecessario: "funil",  alvo: "coletor" },
    { id: 1, titulo: "Filtrar Amostra",  descricao: "Arraste a amostra para o funil",  itemNecessario: "amostra",  alvo: "coletor"},
    { id: 2, titulo: "Posicionar Balão na Balança", descricao: "Arraste o balão até a balança", itemNecessario: "balao", alvo: "balanca" },
    { id: 3, titulo: "Pesar Amostra", descricao: "Arraste a amostra filtrada até a balança", itemNecessario: "coletor", alvo: "balanca" },
    { id: 4, titulo: "Carregar Pipeta",descricao: "Arraste a pipeta de 20mL até o NaOH 20%", itemNecessario: "pipeta", alvo: "naoh"},
    { id: 5, titulo: "Transferir NaOH", descricao: "Arraste a pipeta até o balão da bancada", itemNecessario: "pipeta",   alvo: "balao-bancada" },
    { id: 6, titulo: "Aquecer no Microondas", descricao: "Arraste o balão até o microondas", itemNecessario: "balao", alvo: "microondas" },
    { id: 7, titulo: "Carregar Pipeta com Açúcar Invertido",  descricao: "Arraste a pipeta até o Açúcar Invertido",  itemNecessario: "pipeta",  alvo: "acucar"},
    { id: 8, titulo: "Transferir Açúcar Invertido",  descricao: "Arraste a pipeta até o balão da bancada",  itemNecessario: "pipeta",  alvo: "balao-bancada"},
    { id: 9, titulo: "Adicionar Fenolftaleína",  descricao: "Arraste a Fenolftaleína até o balão da bancada",  itemNecessario: "fenol",  alvo: "balao-bancada"},
    { id: 10, titulo: "Carregar Pipeta com HCl",  descricao: "Arraste a pipeta até o HCl",  itemNecessario: "pipeta",  alvo: "acido"},
    { id: 11, titulo: "Titular com HCl",  descricao: "Goteje o HCl até atingir o ponto vermelho cereja",  itemNecessario: "pipeta",  alvo: "balao-bancada"},
    { id: 12, titulo: 'Preparar EDTA 4%',  descricao: 'Leve a pipeta até o frasco de EDTA 4% e encha até a metade',  itemNecessario: 'pipeta',alvo: 'edta4',},
    { id: 13, titulo: 'Adicionar EDTA 4%',  descricao: 'Leve a pipeta com EDTA 4% até o balão para neutralizar a solução',itemNecessario: 'pipeta',  alvo: 'balao-bancada',},
    { id: 14, titulo: 'Completar volume com água',  descricao: 'Arraste a água até o balão e complete o volume até o menisco',  itemNecessario: 'agua',  alvo: 'balao-bancada',},
    { id: 15,  titulo: 'Adicionar Fehling A ao TE-088',  descricao: 'Leve o Fehling A até o Determinador TE-088',itemNecessario: 'fehlingA',  alvo: 'te088'},
    { id: 16,  titulo: 'Adicionar Fehling B ao TE-088',  descricao: 'Leve o Fehling B até o Determinador TE-088',itemNecessario: 'fehlingB',  alvo: 'te088',},
    { id: 17,  titulo: 'Ligar Determinador TE-088',  descricao: 'Clique no Determinador TE-088 para iniciar o aquecimento',  alvo: 'te088'},
    { id: 18,  titulo: 'Adicionar Azul de Metileno',  descricao: 'Leve a pipeta até o Azul de Metileno e encha-a',itemNecessario: 'pipeta',  alvo: 'azul-metileno',},
    { id: 19,  titulo: 'adicionar 3 gotas de azul de metileno no TE-088 ', descricao: 'Leve a pipeta com Azul de Metileno até o TE-088',itemNecessario: 'pipeta',alvo: 'te088'},
    { id: 20,  titulo: 'Transferir solução para a bureta do TE-088',  descricao: 'Leve o balão da bancada até o TE-088',  itemNecessario: 'balao',  alvo: 'te088'},
    { id: 21,  titulo: 'Realizar titulação na bureta',  descricao: 'Clique na bureta direita para iniciar a titulação',  alvo: 'bureta-direita'},


  ];

  const handleDragStart = (item, e) => {
  if (pesando && etapaAtual <= 3)  return; // ⛔ bloqueia drag durante pesagem
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
      setBalaoEncaixado(true);
      
   

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
    setTimeout(()=>{
      setTransferindo(true);
      setPesando(true);

    },600),
    
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

// 🔹 ETAPA 11 — TITULAÇÃO COM HCl
if (
  itemSegurado === 'pipeta' &&
  alvo === 'balao-bancada' &&
  etapaAtual === 11 &&
  pipetaHClCheia
) {
  setTitulando(true);
  setAgitacao(true);
  setItemSegurado(null);
  return;
}

  // 🔹 ETAPA 12 — ENCHER PIPETA COM HCl ATÉ 50%
if (
  itemSegurado === 'pipeta' &&
  alvo === 'edta4' &&
  etapaAtual === 12
) {
  setNivelPipetaHCl(0);          // começa vazia
  setNivelAlvoPipetaHCl(50);     // 🎯 meta = metade
  setPipetaHClCheia(true);
  setItemSegurado(null);

  celebrarAcerto();
  proximaEtapa();
  return;
}
// 🔹 ETAPA 13 — EDTA 4% NO BALÃO (REVERSÃO DA COR)
if (
  itemSegurado === 'pipeta' &&
  alvo === 'balao-bancada' &&
  etapaAtual === 13 &&
  pipetaHClCheia // mesma pipeta que foi usada no EDTA
) {
  setGotasEDTA(0);
  setGotejandoEDTA(true);
  setAgitacao(true);
  setItemSegurado(null);
  return;
}

// 🔹 ETAPA 14 — COMPLETAR COM ÁGUA ATÉ O MENISCO
if (
  itemSegurado === 'agua' &&
  alvo === 'balao-bancada' &&
  etapaAtual === 14
) {
  setAdicionandoAgua(true);
  setDiluindo(true);
  setItemSegurado(null);
  return;
}

// 🔹 ETAPA 15 — FEHLING A NO TE-088
if (
  itemSegurado === 'fehlingA' &&
  alvo === 'te088' &&
  etapaAtual === 15
) {
  setFehlingAAdicionado(true);

  // cria nível baixo e branco no erlenmeyer
  setNivelErlenmeyerTE(15); // 🔽 bem baixo, visual realista
  setCorErlenmeyerDireitoFinal('#f8fafc');

  celebrarAcerto();
  proximaEtapa();
  setItemSegurado(null);
  return;
}

// 🔹 ETAPA 16 — FEHLING B NO TE-088
if (
  itemSegurado === 'fehlingB' &&
  alvo === 'te088' &&
  etapaAtual === 16
) {
  setFehlingBAdicionado(true);

  // 🔼 sobe MAIS um pouco o nível do erlenmeyer
  setNivelErlenmeyerTE((prev) => Math.min(prev + 5, 35));
  setCorErlenmeyerDireitoFinal('#f8fafc');

  celebrarAcerto();
  proximaEtapa();
  setItemSegurado(null);
  return;
}


// 🔹 ETAPA 18 — PIPETA NO AZUL DE METILENO
if (
  itemSegurado === 'pipeta' &&
  alvo === 'azul-metileno' &&
  etapaAtual === 18 &&
  !pipetaAzulCheia
) {
  setNivelPipetaAzul(0);
  setPipetaAzulCheia(true);
  setItemSegurado(null);

  celebrarAcerto();
  proximaEtapa();
  return;
}

// 🔹 ETAPA 19 — AZUL DE METILENO → TE-088
if (
  itemSegurado === 'pipeta' &&
  alvo === 'te088' &&
  etapaAtual === 19 &&
  pipetaAzulCheia
) {
  // inicia gotejamento
setPosicaoGotasAzul([]);
setGotasAzul(0);
setGotejandoAzul(true);

  // pipeta começa a esvaziar
  setPipetaAzulCheia(false);
  setNivelPipetaAzul(0);

  setItemSegurado(null);
  return;
}

// 🔹 ETAPA 20 — BALÃO → BURETA DO TE-088
if (
  itemSegurado === 'balao' &&
  alvo === 'te088' &&
  etapaAtual === 20
) {
  // inicia transferência
  setTransferindoBalaoParaBureta(true);

  // a bureta herda a cor atual do balão
  setCorBuretaDireita(
    corBalao === 'amber' ? '#f59e0b' :
    corBalao === 'orange' ? '#fb923c' :
    corBalao === 'pink' ? '#ec4899' :
    corBalao === 'rose' ? '#f43f5e' :
    corBalao === 'cherry' ? '#7f1d1d' :
    '#3b82f6'
  );

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
  }, 260);

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
      if (prev >= nivelAlvoPipetaHCl) {
        clearInterval(intervalo);
        return nivelAlvoPipetaHCl;
      }
      return prev + 5;
    });
  }, 150);

  return () => clearInterval(intervalo);
}, [pipetaHClCheia, nivelAlvoPipetaHCl]);

React.useEffect(() => {
  if (!titulando) return;

  const cores = [
    'amber',       // inicial
    'orange',
    'pink',
    'rose',
    'cherry'       // vermelho cereja
  ];

  let passo = 0;

  const intervalo = setInterval(() => {
    // ↓ esvazia pipeta
    setNivelPipetaHCl((prev) => Math.max(prev + 2, 100));

    // ↓ muda a cor do balão gradualmente
    setCorBalao(cores[passo]);

    passo++;

    if (passo >= cores.length) {
      clearInterval(intervalo);
      setTitulando(false);
      setAgitacao(false);
      setPipetaHClCheia(false);

      // 🎉 sucesso
      celebrarAcerto();
      proximaEtapa();
    }
  }, 800); // ritmo realista de gotejamento

  return () => clearInterval(intervalo);
}, [titulando])

React.useEffect(() => {
  if (!neutralizandoEDTA) return;

  const coresReversao = [
    'rose',
    'pink',
    'orange',
    'amber'
  ];

  let passo = 0;

  const intervalo = setInterval(() => {
    setCorBalao(coresReversao[passo]);
    passo++;

    if (passo >= coresReversao.length) {
      clearInterval(intervalo);

      setNeutralizandoEDTA(false);
      setAgitacao(false);
      setPipetaHClCheia(false);

      celebrarAcerto();
      proximaEtapa();
    }
  }, 700); // suave e realista

  return () => clearInterval(intervalo);
}, [neutralizandoEDTA]);

React.useEffect(() => {
  if (!gotejandoEDTA) return;

  const intervalo = setInterval(() => {
    setGotasEDTA((prev) => {
      const novaQtd = prev + 1;

      // 💧 diminui um pouco o nível da pipeta a cada gota
      setNivelPipetaHCl((nivel) => Math.max(nivel - 8, 0));

      if (novaQtd >= 3) {
        clearInterval(intervalo);
        setGotejandoEDTA(false);

        // ✅ após 3 gotas → neutraliza
        setNeutralizandoEDTA(true);
      }

      return novaQtd;
    });
  }, 900); // 1 gota por segundo (realista)

  return () => clearInterval(intervalo);
}, [gotejandoEDTA]);

React.useEffect(() => {
  if (!adicionandoAgua) return;

  const intervalo = setInterval(() => {
    setNivelBalao((prev) => {
      if (prev >= nivelAlvoBalao) {
        clearInterval(intervalo);
        setAdicionandoAgua(false);
        setDiluindo(false);

        celebrarAcerto();
        proximaEtapa();
        return nivelAlvoBalao;
      }
      return prev + 2; // subida lenta e realista
    });
  }, 120);

  return () => clearInterval(intervalo);
}, [adicionandoAgua]);

React.useEffect(() => {
  if (!pipetaAzulCheia) return;

  const intervalo = setInterval(() => {
    setNivelPipetaAzul((prev) => {
      if (prev >= 100) {
        clearInterval(intervalo);
        return 100;
      }
      return prev + 5;
    });
  }, 120);

  return () => clearInterval(intervalo);
}, [pipetaAzulCheia]);

React.useEffect(() => {
  if (!gotejandoAzul) return;

  const intervalo = setInterval(() => {
    setPosicaoGotasAzul((prev) => {
      const novas = [...prev];

      // adiciona nova gota
      if (novas.length < 3) {
        novas.push(230);
      }

      // faz todas caírem
      return novas.map((y) => y + 6);
    });
  }, 80);

  return () => clearInterval(intervalo);
}, [gotejandoAzul]);

React.useEffect(() => {
  const yLiquido = 320 - nivelErlenmeyerTE;

  const todasAbsorvidas =
    posicaoGotasAzul.length === 3 &&
    posicaoGotasAzul.every((y) => y >= yLiquido);

  if (todasAbsorvidas) {
    setGotejandoAzul(false);
    setPosicaoGotasAzul([]);
    setCorErlenmeyerDireitoFinal('#2563eb');

    setTimeout(() => {
            celebrarAcerto();
      proximaEtapa();
    }, 400);
  }
}, [posicaoGotasAzul, nivelErlenmeyerTE]);

React.useEffect(() => {
  if (!transferindoBalaoParaBureta) return;

  const intervalo = setInterval(() => {
    setNivelBalao((prev) => {
      if (prev <= 50) {
        clearInterval(intervalo);

        setTransferindoBalaoParaBureta(false);

        // garante nível da bureta cheio
        setNivelBuretaDireita(100);

        celebrarAcerto();
        proximaEtapa();

        return 50;
      }
      return prev - 2; // esvaziamento gradual
    });

    setNivelBuretaDireita((prev) =>
      Math.min(prev + 2, 100)
    );
  }, 120);

  return () => clearInterval(intervalo);
}, [transferindoBalaoParaBureta]);

React.useEffect(() => {
  if (!gotejandoBuretaDireita) return;

  const intervalo = setInterval(() => {
    setNivelBuretaDireita((prev) => {
      const novoNivel = prev - 1;

      // Quando chegar a 10%
      if (novoNivel <= 10) {
        clearInterval(intervalo);

        setGotejandoBuretaDireita(false);
      

        // 🔴 muda para vermelho tijolo
        setCorErlenmeyerDireitoFinal('#b91c1c');

        celebrarAcerto();
        proximaEtapa();

        return 10;
      }

      return novoNivel;
    });
  }, 120);

  return () => clearInterval(intervalo);
}, [gotejandoBuretaDireita]);

React.useEffect(() => {
  if (!gotejandoBuretaDireita) return;

  const intervalo = setInterval(() => {
    setPosicaoGotasBureta((prev) => {
      const novas = [...prev];

      if (novas.length < 1) {
        novas.push(200);
      }

      const yLiquido = 320 - nivelErlenmeyerTE;

      const atualizadas = novas.map((y) => y + 10);

      const atingiu = atualizadas.some((y) => y >= yLiquido);

      if (atingiu) {
        return [];
      }

      return atualizadas;
    });
  }, 60);

  return () => clearInterval(intervalo);
}, [gotejandoBuretaDireita, nivelErlenmeyerTE]);



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
          
          <div className="bg-gradient-to-b from-stone-400 to-stone-500 rounded-2xl p-8 shadow-inner border-4 border-stone-600 min-h-[700px] relative ">
            
            <div className="  grid  grid-cols-1  md:grid-cols-3  gap-12  items-end  mb-12">
            <div className="flex flex-col items-center gap-8">
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
              

             
      <div className="relative">
     <div className="flex flex-col items-center">
      {/* SLOT FIXO – DETERMINADOR TE-088 */}
<div className="flex flex-col items-center justify-end min-h-[260px] w-[220px]">
          {/* TE-088 */}
       <div
            onClick={ligarTE088}
            onDrop={(e) => handleDrop('te088', e)}
            onDragOver={handleDragOver}
            className={`relative cursor-pointer transition-all
              ${etapas[etapaAtual]?.alvo === 'te088' ? 'ring-4 ring-green-500' : ''}
              ${etapas[etapaAtual]?.itemNecessario === 'te088'? 'animate-pulse-leve': ''}
            `}
          >


          
          {/* SVG do equipamento - escala reduzida mantendo proporções */}
          <svg width="100%" height="100%" viewBox="0 0 500 600" preserveAspectRatio="xMidYMid meet">
            <defs>
              {/* Gradientes */}
              <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="50%" stopColor="#6b7280" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>
              
              <linearGradient id="glassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.1" />
              </linearGradient>

              <radialGradient id="displayGlow">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>

              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                <feOffset dx="0" dy="2" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Corpo Principal - Estrutura Metálica */}
            <g filter="url(#shadow)">
              <rect x="50" y="450" width="300" height="130" rx="8" 
                    fill="url(#metalGradient)" stroke="#374151" strokeWidth="2"/>
              
              <rect x="80" y="150" width="240" height="310" rx="6" 
                    fill="url(#metalGradient)" stroke="#374151" strokeWidth="2"/>
              
              <rect x="50" y="200" width="30" height="250" rx="4" 
                    fill="#4b5563" stroke="#374151" strokeWidth="1"/>
              
              <rect x="320" y="200" width="30" height="250" rx="4" 
                    fill="#4b5563" stroke="#374151" strokeWidth="1"/>
            </g>

            {/* Caldeira de Vidro Borossilicato (ESQUERDA - vazia) */}
            <g>
              {/* Base da caldeira */}
              <ellipse cx="130" cy="150" rx="45" ry="10" 
                       fill="#1e293b" stroke="#475569" strokeWidth="2"/>
              
              {/* Corpo da caldeira */}
              <rect x="85" y="80" width="90" height="70" 
                    fill="url(#glassGradient)" stroke="#94a3b8" strokeWidth="2" rx="4"/>
              
              {/* Brilho do vidro */}
              <rect x="90" y="85" width="15" height="60" 
                    fill="white" opacity="0.3" rx="2"/>
              
              {/* Topo da caldeira */}
              <ellipse cx="130" cy="80" rx="45" ry="10" 
                       fill="url(#glassGradient)" stroke="#94a3b8" strokeWidth="2"/>
              
              {/* Tampa superior */}
              <ellipse cx="130" cy="68" rx="25" ry="6" 
                       fill="#6b7280" stroke="#4b5563" strokeWidth="2"/>
              <rect x="126" y="56" width="8" height="15" 
                    fill="#6b7280" stroke="#4b5563" strokeWidth="1"/>
            </g>

            {/* BURETA (DIREITA) - Sistema de Titulação */}
            <g style={{ cursor: etapaAtual === 21 ? 'pointer' : 'default' }}
              onClick={() => {
                if (etapaAtual === 21 && !gotejandoBuretaDireita) {
                  setGotejandoBuretaDireita(true);
                }
              }}>
              {/* Suporte da Bureta */}
              <rect x="360" y="60" width="8" height="180" 
                    fill="#4b5563" stroke="#374151" strokeWidth="2"/>
              
              {/* Presilha superior */}
              <rect x="355" y="75" width="18" height="12" rx="2"
                    fill="#6b7280" stroke="#374151" strokeWidth="1"/>
              
              {/* Presilha inferior */}
              <rect x="355" y="150" width="18" height="12" rx="2"
                    fill="#6b7280" stroke="#374151" strokeWidth="1"/>
              
              {/* Corpo da Bureta (tubo de vidro graduado) */}
              <rect x="378" y="70" width="24" height="150" 
                    fill="url(#glassGradient)" stroke="#94a3b8" strokeWidth="2" rx="2"/>
              
              {/* Graduações da bureta */}
              {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135].map(y => (
                <line key={y} x1="378" y1={70 + y} x2="385" y2={70 + y} 
                      stroke="#64748b" strokeWidth="1"/>
              ))}
              
              {/* Nível do reagente (líquido azul - Reagente de Fehling) */}
              <rect
                    x="379"
                    y={205 - (nivelBuretaDireita * 1.35)}
                    width="22"
                    height={nivelBuretaDireita * 1.35}
                    fill={corBuretaDireita}
                    opacity="0.6"
                  />
                   {/* Brilho do vidro da bureta */}
              <rect x="380" y="72" width="6" height="145" 
                    fill="white" opacity="0.2" rx="1"/>
              
              {/* Torneira/Válvula de controle */}
              <g>
                <rect x="386" y="218" width="12" height="8" 
                      fill="#6b7280" stroke="#374151" strokeWidth="1"/>
                <ellipse cx="392" cy="222" rx="8" ry="4" 
                         fill="#4b5563" stroke="#374151" strokeWidth="1"/>
              </g>
              
              {/* Bico da bureta (ponteira) */}
              <path d="M 390 226 L 388 235 L 394 235 Z" 
                    fill="#94a3b8" stroke="#64748b" strokeWidth="1"/>
                    {posicaoGotasBureta.map((y, i) => (
                  <circle
                    key={i}
                    cx="385"
                    cy={y}
                    r="4"
                    fill={corBuretaDireita}
                  />
                ))}
            </g>

            {/* Erlenmeyer/Cuba de Reação (DIREITA) */}
            <g>
              {/* Corpo do erlenmeyer */}
              <path d="M 350 250 L 340 290 L 340 310 Q 340 320, 350 320 L 430 320 Q 440 320, 440 310 L 440 290 L 430 250 Z"
                    fill="url(#glassGradient)" stroke="#94a3b8" strokeWidth="2"/>
              
              {/* Gargalo */}
              <rect x="385" y="230" width="20" height="20" 
                    fill="url(#glassGradient)" stroke="#94a3b8" strokeWidth="2"/>
              
              {/* Boca do erlenmeyer */}
              <ellipse cx="395" cy="230" rx="10" ry="3" 
                       fill="url(#glassGradient)" stroke="#94a3b8" strokeWidth="2"/>
              
              {/* Brilho do vidro */}
              <path d="M 352 255 L 348 285 L 348 305" 
                    stroke="white" strokeWidth="8" opacity="0.2" fill="none"/>
                     {fervendo && (
                        <>
                          {/* bolhas */}
                          {[...Array(6)].map((_, i) => (
                            <circle
                              key={i}
                              cx={370 + Math.random() * 40}
                              cy={300 - Math.random() * 40}
                              r="3"
                              fill="#93c5fd"
                              opacity="0.7"
                              className="animate-bounce"
                            />
                          ))}

                          {/* vapor */}
                          <path
                            d="M 380 220 C 370 200, 390 180, 380 160"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                            fill="none"
                            opacity="0.6"
                            className="animate-pulse"
                          />
                        </>
                      )}
                      {nivelErlenmeyerTE > 0 && (
                          <rect
                            x="350"
                            y={320 - nivelErlenmeyerTE}
                            width="80"
                            height={nivelErlenmeyerTE}
                            fill={corErlenmeyerDireitoFinal}
                            opacity="0.9"
                          />
                        )}

                        {/* GOTAS DE AZUL DE METILENO */}
                    {posicaoGotasAzul.map((y, i) => {
                      const yLiquido = 320 - nivelErlenmeyerTE;

                      // se tocar o líquido → remove gota
                      if (y >= yLiquido) return null;

                      return (
                        <circle
                          key={i}
                          cx={395}
                          cy={y}
                          r="3.2"
                          fill="#1e40af"
                          opacity="0.85"
                        />
                      );
                    })}
                       
              
              {/* Base do erlenmeyer */}
              <ellipse cx="390" cy="320" rx="50" ry="8" 
                       fill="#1e293b" stroke="#475569" strokeWidth="2"/>
            </g>

            {/* Eletrodo de Platina (dentro do erlenmeyer) */}
            <g>
              <line x1="365" y1="240" x2="365" y2="305" 
                    stroke="#d1d5db" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="365" cy="305" r="4" fill="#e5e7eb"/>
              <circle cx="365" cy="310" r="6" fill="#9ca3af" opacity="0.5"/>
              
              {/* Fio de conexão do eletrodo */}
              <line x1="365" y1="240" x2="365" y2="200" 
                    stroke="#d1d5db" strokeWidth="2"/>
            </g>

            {/* Tubulação conectando caldeira */}
            <path d="M 130 150 Q 130 170, 150 180" 
                  stroke="#6b7280" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <circle cx="150" cy="180" r="8" fill="#4b5563" stroke="#374151" strokeWidth="2"/>

            {/* Painel Frontal */}
            <g>
              <rect x="100" y="250" width="200" height="180" rx="8" 
                    fill="#1e293b" stroke="#475569" strokeWidth="2"/>
              
              {/* Display Digital */}
              <rect x="120" y="280" width="160" height="50" rx="4" 
                    fill="url(#displayGlow)" stroke="#334155" strokeWidth="2"/>
              
              <text x="200" y="295" textAnchor="middle" 
                    fill="#334155" fontSize="10" fontFamily="monospace">
                mV
              </text>
             <text x="200" y="318" textAnchor="middle"
              fill={te088Aquecendo || te088Quente ? '#f87171' : '#22c55e'}
              fontSize="28"
              fontFamily="monospace"
              fontWeight="bold">
              {te088Aquecendo || te088Quente ? '95.0' : '25.0'}
            </text>

              {/* LED Indicador */}
              <circle
                  cx="130"
                  cy="360"
                  r="6"
                  fill={te088Aquecendo || te088Quente ? '#ef4444' : '#22c55e'}
                  className={te088Aquecendo ? 'animate-pulse' : ''}
                />
              <text x="145" y="365" fill="#94a3b8" fontSize="11">AQUEC.</text>

              {/* Botão Power */}
              <g>
                <circle cx="260" cy="360" r="18" 
                        fill="#374151" 
                        stroke="#1f2937" strokeWidth="2"/>
                <circle cx="260" cy="360" r="14" 
                        fill="#4b5563"/>
                <circle cx="260" cy="358" r="10" 
                        fill="#6b7280"/>
              </g>
              <text x="243" y="395" fill="#94a3b8" fontSize="10">POWER</text>

              {/* Controle de Temperatura */}
              <g>
                <circle cx="200" cy="400" r="22" 
                        fill="#374151" stroke="#1f2937" strokeWidth="2"/>
                <circle cx="200" cy="400" r="18" 
                        fill="#4b5563" stroke="#374151" strokeWidth="1"/>
                
                <line 
                  x1="200" 
                  y1="400" 
                  x2={200 + 14 * Math.cos(-50 * Math.PI / 180)}
                  y2={400 + 14 * Math.sin(-50 * Math.PI / 180)}
                  stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"/>
                
                {[0, 30, 60, 90].map(angle => (
                  <line 
                    key={angle}
                    x1={200 + 24 * Math.cos((angle - 50) * Math.PI / 180)}
                    y1={400 + 24 * Math.sin((angle - 50) * Math.PI / 180)}
                    x2={200 + 28 * Math.cos((angle - 50) * Math.PI / 180)}
                    y2={400 + 28 * Math.sin((angle - 50) * Math.PI / 180)}
                    stroke="#6b7280" strokeWidth="2"/>
                ))}
              </g>
              <text x="175" y="435" fill="#94a3b8" fontSize="9">TEMP °C</text>
            </g>

            {/* Etiqueta */}
            <rect x="150" y="520" width="100" height="35" rx="4" 
                  fill="#0f172a" stroke="#334155" strokeWidth="1"/>
            <text x="200" y="535" textAnchor="middle" 
                  fill="#60a5fa" fontSize="12" fontWeight="bold">
              TECNAL
            </text>
            <text x="200" y="548" textAnchor="middle" 
                  fill="#94a3b8" fontSize="10">
              TE-088
            </text>

            {/* Ventilação */}
            {[0, 1, 2, 3, 4].map(i => (
              <line key={`left-${i}`} x1="110" y1={480 + i * 8} x2="140" y2={480 + i * 8} 
                    stroke="#374151" strokeWidth="2"/>
            ))}
            {[0, 1, 2, 3, 4].map(i => (
              <line key={`right-${i}`} x1="260" y1={480 + i * 8} x2="290" y2={480 + i * 8} 
                    stroke="#374151" strokeWidth="2"/>
            ))}
          </svg>
        </div>
        
        <p className="text-xs font-semibold text-gray-800 mt-2">Determinador TE-088</p>
      </div>
    </div>
    </div>
    </div>
    </div>

              <div className="flex flex-col items-center gap-10">
              <div 
                className="flex flex-col items-center cursor-move"
                draggable
                onDragStart={(e) => handleDragStart('amostra', e)}
                onDragEnd={handleDragEnd}
              >
                <div className={`relative transition-all hover:scale-110 ${itemSegurado === 'amostra' ? 'opacity-50' : ''}
                ${etapas[etapaAtual]?.itemNecessario === 'amostra'? 'animate-pulse-leve': ''}`}>
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
                        ${itemSegurado === 'funil' ? 'opacity-50' : ''}
                        ${etapas[etapaAtual]?.itemNecessario === 'funil'? 'animate-pulse-leve': ''}`}
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
                        ${etapas[etapaAtual]?.alvo === 'coletor'? 'border-green-500 shadow-green-500/50 scale-105':'border-cyan-300'}
                        ${etapas[etapaAtual]?.itemNecessario === 'coletor'? 'animate-pulse-leve': ''}`}>
                    
                    {/* LÍQUIDO */}
                    <div
                      className="absolute bottom-0 bg-amber-600 w-full transition-all duration-300"
                      style={{ height: `${nivelColetor}%` }}
                    />
                  </div>

                  <p className="text-xs font-semibold text-gray-800 mt-2">🖱️ Coletor</p>
                </div>
                   <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-12 h-16 bg-gradient-to-b from-green-210 to-cyan-300 border-4 border-cyan-500 rounded-lg relative shadow-lg">
                    <div className="absolute -top-2 -right-2 w-6 h-10 bg-cyan-300 border-2 border-cyan-500 rounded-t-full transform rotate-45"></div>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 text-cyan-900 text-xs font-bold">4%</div>
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-1">4%</p>
              </div>
              </div>
               {/* SLOT FIXO DO BALÃO DA BANCADA */}
               <div className="flex flex-col items-center gap-8">
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
                  <div className={`w-6 h-12 bg-gradient-to-b from-cyan-100/40 to-transparent border-2 border-cyan-300 mx-auto transition-all
                    ${etapas[etapaAtual]?.alvo === 'balao-bancada'
                              ? 'border-green-500 shadow-green-500/50 scale-105'
                              : 'border-cyan-300'
                          }
                      ${etapas[etapaAtual]?.itemNecessario === 'balao'? 'animate-pulse-leve': ''}
                    `}></div>

                  <div
                        className={`w-24 h-32 bg-gradient-to-b from-cyan-100/40 to-cyan-200/60 
                          border-4 rounded-full shadow-lg relative overflow-hidden transition-all
                          ${
                            etapas[etapaAtual]?.alvo === 'balao-bancada'
                              ? 'border-green-500 shadow-green-500/50 scale-105'
                              : 'border-cyan-300'
                          }
                          ${etapas[etapaAtual]?.itemNecessario === 'balao'? 'animate-pulse-leve': ''}
                        `}
                      >

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
                          className={`absolute bottom-0 left-0 right-0 transition-all duration-500
                          ${diluindo
                            ? 'bg-amber-300'
                            : corBalao === 'amber'
                            ? 'bg-amber-600'
                            : corBalao === 'orange'
                            ? 'bg-orange-400'
                            : corBalao === 'pink'
                            ? 'bg-pink-400'
                            : corBalao === 'rose'
                            ? 'bg-rose-500'
                            : 'bg-red-700'}
                          ${agitacao ? 'animate-vibrar' : ''}
                          ${amostraQuente ? 'animate-pulse' : ''}
                          
                        `}
                        style={{ height: `${nivelBalao * 0.55}%` }}
                      />

                  </div>
                  {/* GOTAS DE EDTA 4% */}
                    {gotasEDTA > 0 &&
                        Array.from({ length: gotasEDTA }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                            style={{
                              top: `${6 + i * 10}px`,
                              animation: 'quedaGota 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                            }}
                          >
                            <div
                              className="w-2.5 h-5 rounded-full bg-gradient-to-b from-red-500 via-red-700 to-red-900 shadow-md"
                              style={{
                                clipPath:
                                  'polygon(50% 0%, 65% 20%, 80% 45%, 70% 70%, 50% 100%, 30% 70%, 20% 45%, 35% 20%)',
                              }}
                            />
                            {/* brilho da gota */}
                            <div className="absolute left-1 top-1 w-0.5 h-2 bg-white/40 rounded-full" />
                          </div>
                        ))}



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
                  <div className={`w-6 h-6 bg-red-400 rounded-full border-2 border-red-600 mx-auto transition-all
                  ${etapas[etapaAtual]?.itemNecessario === 'pipeta'? 'animate-pulse-leve': ''}`}></div>
                  <div className={`w-2 h-8 bg-gradient-to-b from-cyan-100/60 to-cyan-200/80 border-2 border-cyan-400 mx-auto transition-all
                  ${etapas[etapaAtual]?.itemNecessario === 'pipeta'? 'animate-pulse-leve': ''}`}></div>
                  <div className={`w-16 h-20 bg-gradient-to-b from-cyan-20/60 to-cyan-100/0 border-4 border-cyan-400 rounded-full mx-auto relative shadow-lg overflow-hidden transition-all
                  ${etapas[etapaAtual]?.itemNecessario === 'pipeta'? 'animate-pulse-leve': ''}`}>
                 {/* LÍQUIDO DA PIPETA */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 transition-all duration-300
                        ${
                          pipetaAzulCheia
                            ? 'bg-blue-800'        // 🔵 azul de metileno
                            : pipetaHClCheia
                            ? 'bg-red-400'
                            : pipetaAcucarCheia
                            ? 'bg-blue-400'
                            : pipetaCheia
                            ? 'bg-blue-300'
                            : 'bg-gray-300'
                        }
                      `}
                      style={{
                        height: pipetaAzulCheia
                          ? `${nivelPipetaAzul}%`
                          : pipetaHClCheia
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
                  <div className={`w-3 h-16 bg-gradient-to-b from-cyan-100/60 to-cyan-200/80 border-2 border-cyan-400 mx-auto transition-all
                  ${etapas[etapaAtual]?.itemNecessario === 'pipeta'? 'animate-pulse-leve': ''}`}></div>
                  <div className="w-1 h-3 bg-cyan-300 border border-cyan-500 mx-auto"></div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-2">🖱️Pipeta 20mL</p>
              </div>
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
                ${etapas[etapaAtual]?.alvo === 'acido'? 'border-red-600 ring-4 ring-green-500': ''}`}>
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
                      className={`w-16 h-20 bg-gradient-to-b from-amber-400 to-amber-500 border-4 border-amber-700 rounded-lg relative shadow-lg transition-all
                        ${ etapas[etapaAtual]?.alvo === 'acucar'  ? 'border-green-500 shadow-green-500/50 scale-105': ''}`}>
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
                      <div className={`w-12 h-16 bg-gradient-to-b from-pink-300 to-pink-400 border-4 border-pink-600 rounded-lg relative shadow-lg transiton-all
                       ${etapas[etapaAtual]?.itemNecessario === 'fenol'? 'animate-pulse-leve': ''}`}>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-6 bg-pink-500 rounded-t-full border-2 border-pink-700"></div>
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-pink-900 text-xs font-bold">Fen.</div>
                      </div>
                      <p className="text-xs font-semibold text-gray-800 mt-1">🖱️Fenolftaleína</p>
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

             <div className="flex flex-col items-center"
                onDrop={(e) => handleDrop('edta4', e)}
                onDragOver={handleDragOver}
              >
                
                  <div className={`w-16 h-20 bg-gradient-to-b from-purple-200 to-purple-700 border-4 border-purple-700 rounded-lg relative shadow-lg transition-all
                   ${etapas[etapaAtual]?.alvo === 'edta4'? 'border-purple-500 ring-4 ring-green-500': 'border-blue-900'}`}>
                  <div className="absolute top-1 left-1 right-1 h-3 bg-purple-600 rounded-t"></div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 text-purple-900 text-xs font-bold">EDTA</div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-1">EDTA 4%</p>
              </div>


              {/* FEHLING A */}
              <div
                draggable={etapaAtual === 15 && !fehlingAAdicionado}
                onDragStart={(e) => {
                  if (etapaAtual === 15 && !fehlingAAdicionado) {
                    handleDragStart('fehlingA', e);
                  }
                }}
                onDragEnd={handleDragEnd}
              >
                 <div className= {`w-16 h-20 bg-gradient-to-b from-blue-500 to-blue-600 border-4 border-blue-800 rounded-lg relative shadow-lg transition-all
                  ${etapas[etapaAtual]?.itemNecessario === 'fehlingA'? 'animate-pulse-leve': ''} `}>
                  <div className="absolute top-1 left-1 right-1 h-3 bg-blue-700 rounded-t"></div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white text-xs font-bold">Feh.A</div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-1">Fehling A</p>
              </div>
              
              {/* FEHLING B */}
                <div
                  draggable={etapaAtual === 16 && !fehlingBAdicionado}
                  onDragStart={(e) => {
                    if (etapaAtual === 16 && !fehlingBAdicionado) {
                      handleDragStart('fehlingB', e);
                    }
                  }}
                  onDragEnd={handleDragEnd}
                  
                    
                >
                  <div className={`w-16 h-20 bg-gradient-to-b from-green-500 to-green-600 border-4 border-green-800 rounded-lg relative shadow-lg transition-all
                  ${etapas[etapaAtual]?.itemNecessario === 'fehlingB'? 'animate-pulse-leve': ''}`}>
                  <div className="absolute top-1 left-1 right-1 h-3 bg-green-700 rounded-t"></div>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white text-xs font-bold">Feh.B</div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-1">Fehling B</p>
              </div>

              
              <div
              draggable={false}
              onDrop={(e) => handleDrop('azul-metileno', e)}
              onDragOver={handleDragOver}
            >
                  <div className={`w-12 h-16 bg-gradient-to-b from-blue-700 to-blue-800 border-4 border-blue-900 rounded-lg relative shadow-lg transition-all
                  ${etapas[etapaAtual]?.alvo === 'azul-metileno'? 'ring-4 ring-green-500': 'border-blue-900'}`} >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-6 bg-blue-800 rounded-t-full border-2 border-blue-900"></div>
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white text-xs font-bold">A.M.</div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-1">Azul Met.</p>
              </div>

              <div className="flex flex-col items-center cursor-move"
                draggable
                onDragStart={(e) => handleDragStart('agua', e)}
                onDragEnd={handleDragEnd}
              >
                <div className={`w-12 h-16 bg-gradient-to-b from-cyan-200 to-cyan-300 border-4 border-cyan-500 rounded-lg relative shadow-lg transition-all
                ${etapas[etapaAtual]?.itemNecessario === 'agua'? 'animate-pulse-leve': ''}`}>
                    <div className="absolute -top-2 -right-2 w-6 h-10 bg-cyan-300 border-2 border-cyan-500 rounded-t-full transform rotate-45"></div>
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 text-cyan-900 text-xs font-bold">H₂O</div>
                </div>
                <p className="text-xs font-semibold text-gray-800 mt-1">🖱️ Água</p>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-6 bg-blue-500 rounded-xl shadow-xl p-4 text-center">
          <p className="text-white font-semibold">💡 Arraste os itens piscando para os locais destacados em verde!</p>
        </div>
      </div>
    </div>
  );
};export default SimuladorART;