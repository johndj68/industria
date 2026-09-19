import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';
import { etapas } from '../fermentacao/data/etapasART';

/**
 * useSimuladorDragART — handlers de drag/drop para o SimuladorART.
 *
 * Recebe todas as variáveis de estado e setters necessários para
 * executar as ações de cada etapa, evitando 350+ linhas no componente.
 */
export const useSimuladorDragART = ({
  // game
  etapaAtual, itemSegurado, setItemSegurado, avancarEtapa,
  // condições de read
  pesando, funilEncaixado,
  pipetaCheia, pipetaAcucarCheia, pipetaHClCheia, pipetaAzulCheia,
  fehlingAAdicionado, corBalao,
  // filtração
  setFunilPosicionado, setFunilEncaixado, setFiltrando,
  // balão / balança
  setBalaoPosicionado, setBalaoEncaixado, setTransferindo, setPesando,
  // pipeta NaOH
  setPipetaCheia, setTransferindoPipeta,
  // microondas
  setBalaoNoMicroondas, setAquecendo, setTempoMicroondas,
  // pipeta açúcar
  setPipetaAcucarCheia, setTransferindoPipetaAcucar,
  // fenolftaleína
  setAdicionandoFenol, setGotasFenol,
  // pipeta HCl / EDTA
  setNivelPipetaHCl, setNivelAlvoPipetaHCl, setPipetaHClCheia,
  setTitulando, setAgitacao,
  setGotasEDTA, setGotejandoEDTA,
  // água
  setAdicionandoAgua, setDiluindo,
  // Fehling / TE-088
  setFehlingAAdicionado, setNivelErlenmeyerTE, setCorErlenmeyerDireitoFinal,
  setFehlingBAdicionado,
  // azul de metileno
  setNivelPipetaAzul, setPipetaAzulCheia,
  setPosicaoGotasAzul, setGotasAzul, setGotejandoAzul,
  // bureta
  setTransferindoBalaoParaBureta, setCorBuretaDireita,
}) => {

  const handleDragStart = (item, e) => {
    // Bloqueia drag enquanto a pesagem está em andamento
    if (pesando && etapaAtual <= 3) {
      e.preventDefault();
      return;
    }
    setItemSegurado(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', item);
    // Suprime o ghost nativo (invisível no Linux) e inicia overlay visual customizado.
    // Os offsets garantem que o item aparece exatamente onde o usuário clicou.
    if (IMAGEM_DRAG_VAZIA) e.dataTransfer.setDragImage(IMAGEM_DRAG_VAZIA, 0, 0);
    const rect = e.currentTarget.getBoundingClientRect();
    iniciarOverlayDrag(e.currentTarget, e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleDragEnd = () => {
    setItemSegurado(null);
    encerrarOverlayDrag();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (alvo, e) => {
    e.preventDefault();
    // Remove o overlay imediatamente no drop — evita que ele fique preso
    // caso o dragend não dispare após o React re-renderizar o componente
    encerrarOverlayDrag();

    // 🔹 ETAPA 0 — FUNIL NO COLETOR
    if (itemSegurado === 'funil' && alvo === 'coletor' && etapaAtual === 0) {
      setFunilPosicionado(true);
      setTimeout(() => setFunilEncaixado(true), 700);
      avancarEtapa();
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 1 — FILTRAÇÃO
    if (itemSegurado === 'amostra' && alvo === 'coletor' && funilEncaixado && etapaAtual === 1) {
      setFiltrando(true);
      avancarEtapa();
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 2 — BALÃO NA BALANÇA (⚠️ TEM QUE VIR ANTES DO GENÉRICO)
    if (itemSegurado === 'balao' && alvo === 'balanca' && etapaAtual === 2) {
      setBalaoPosicionado(true);
      setBalaoEncaixado(true);
      avancarEtapa();
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 3 — COLETOR NA BALANÇA → INICIA TRANSFERÊNCIA
    if (itemSegurado === 'coletor' && alvo === 'balanca' && etapaAtual === 3) {
      setTimeout(() => {
        setTransferindo(true);
        setPesando(true);
      }, 600);
      avancarEtapa();
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 4 — PIPETA NO NaOH
    if (itemSegurado === 'pipeta' && alvo === 'naoh' && etapaAtual === 4 && !pipetaCheia) {
      setPipetaCheia(true);
      avancarEtapa();
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 5 — PIPETA NO BALÃO DA BANCADA
    if (itemSegurado === 'pipeta' && alvo === 'balao-bancada' && etapaAtual === 5 && pipetaCheia) {
      setTransferindoPipeta(true);
      avancarEtapa();
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 6 — BALÃO NO MICROONDAS
    if (itemSegurado === 'balao' && alvo === 'microondas' && etapaAtual === 6) {
      setBalaoNoMicroondas(true);
      setAquecendo(true);
      setTempoMicroondas(30);
      avancarEtapa();
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 7 — PIPETA NO AÇÚCAR INVERTIDO
    if (itemSegurado === 'pipeta' && alvo === 'acucar' && etapaAtual === 7 && !pipetaAcucarCheia) {
      setPipetaAcucarCheia(true);
      avancarEtapa();
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 8 — TRANSFERIR AÇÚCAR PARA O BALÃO
    if (itemSegurado === 'pipeta' && alvo === 'balao-bancada' && etapaAtual === 8 && pipetaAcucarCheia) {
      setTransferindoPipetaAcucar(true);
      avancarEtapa();
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 9 — FENOLFTALEÍNA NO BALÃO
    if (itemSegurado === 'fenol' && alvo === 'balao-bancada' && etapaAtual === 9) {
      setAdicionandoFenol(true);
      setGotasFenol(0);
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 10 — CARREGAR PIPETA COM HCl
    // Importante: não avança imediatamente. A etapa só muda depois
    // que a animação visual da pipeta cheia terminar no useEffect.
    if (itemSegurado === 'pipeta' && alvo === 'acido' && etapaAtual === 10 && !pipetaHClCheia) {
      setNivelPipetaHCl(0);
      setNivelAlvoPipetaHCl(100);
      setPipetaHClCheia(true);
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 11 — TITULAÇÃO COM HCl
    if (itemSegurado === 'pipeta' && alvo === 'balao-bancada' && etapaAtual === 11 && pipetaHClCheia) {
      setTitulando(true);
      setAgitacao(true);
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 12 — ENCHER PIPETA COM EDTA ATÉ 50%
    if (itemSegurado === 'pipeta' && alvo === 'edta4' && etapaAtual === 12) {
      setNivelPipetaHCl(0);
      setNivelAlvoPipetaHCl(50);
      setPipetaHClCheia(true);
      setItemSegurado(null);
      avancarEtapa();
      return;
    }

    // 🔹 ETAPA 13 — EDTA 4% NO BALÃO (REVERSÃO DA COR)
    if (itemSegurado === 'pipeta' && alvo === 'balao-bancada' && etapaAtual === 13 && pipetaHClCheia) {
      setGotasEDTA(0);
      setGotejandoEDTA(true);
      setAgitacao(true);
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 14 — COMPLETAR COM ÁGUA ATÉ O MENISCO
    if (itemSegurado === 'agua' && alvo === 'balao-bancada' && etapaAtual === 14) {
      setAdicionandoAgua(true);
      setDiluindo(true);
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 15 — FEHLING A NO TE-088
    // Importante: não avança imediatamente. Mantém a etapa visível
    // por alguns instantes e depois libera a etapa 16.
    if (itemSegurado === 'fehlingA' && alvo === 'te088' && etapaAtual === 15 && !fehlingAAdicionado) {
      setFehlingAAdicionado(true);
      setNivelErlenmeyerTE(15);
      setCorErlenmeyerDireitoFinal('#f8fafc');
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 16 — FEHLING B NO TE-088
    if (itemSegurado === 'fehlingB' && alvo === 'te088' && etapaAtual === 16) {
      setFehlingBAdicionado(true);
      setNivelErlenmeyerTE((prev) => Math.min(prev + 5, 35));
      setCorErlenmeyerDireitoFinal('#f8fafc');
      avancarEtapa();
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 18 — PIPETA NO AZUL DE METILENO
    if (itemSegurado === 'pipeta' && alvo === 'azul-metileno' && etapaAtual === 18 && !pipetaAzulCheia) {
      setNivelPipetaAzul(0);
      setPipetaAzulCheia(true);
      setItemSegurado(null);
      avancarEtapa();
      return;
    }

    // 🔹 ETAPA 19 — AZUL DE METILENO → TE-088
    if (itemSegurado === 'pipeta' && alvo === 'te088' && etapaAtual === 19 && pipetaAzulCheia) {
      setPosicaoGotasAzul([]);
      setGotasAzul(0);
      setGotejandoAzul(true);
      setPipetaAzulCheia(false);
      setNivelPipetaAzul(0);
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 20 — BALÃO → BURETA DO TE-088
    if (itemSegurado === 'balao' && alvo === 'te088' && etapaAtual === 20) {
      setTransferindoBalaoParaBureta(true);
      setCorBuretaDireita(
        corBalao === 'amber'  ? '#f59e0b' :
        corBalao === 'orange' ? '#fb923c' :
        corBalao === 'pink'   ? '#ec4899' :
        corBalao === 'rose'   ? '#f43f5e' :
        corBalao === 'cherry' ? '#7f1d1d' :
        '#3b82f6'
      );
      setItemSegurado(null);
      return;
    }

    // 🔹 REGRA GENÉRICA (somente depois dos casos específicos)
    if (
      itemSegurado === etapas[etapaAtual]?.itemNecessario &&
      alvo === etapas[etapaAtual]?.alvo
    ) {
      if (alvo === 'balanca') setPesando(true);
      avancarEtapa();
      setItemSegurado(null);
      return;
    }

    setItemSegurado(null);
  };

  return { handleDragStart, handleDragEnd, handleDragOver, handleDrop };
};
