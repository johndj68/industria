import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

export const useSimuladorDrag = (etapas, {
  // game
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // espatula
  setEspatulaComPo,
  // amostra / tubos
  setNivelAmostra,
  setNivelTubo, setCorTubo, setTuboPrep,
  setCorVazio, setNivelVazio,
  setCorFinal, setNivelFinal,
  // pipeta
  tipIdx, pipetaCheia,
  setCorPipeta, setPipetaCheia, setNivelPipeta, setTipIdx,
  // vortex
  setVortexLigado, setHomogeneizado, setTuboNoVortex, setTipoTuboVortex,
  // neubauer / microscopio
  setNeuCarreg, setOilAplicado, setLaminaNaMic,
}) => {

  // ── Helpers de classe ─────────────────────────────────
  const isAlvo = (id) => etapas[etapaAtual]?.alvo === id;
  const isItem = (id) => etapas[etapaAtual]?.item === id;
  const dropCls = (id) => isAlvo(id) ? 'drop-target' : '';
  const itemCls = (id) => isItem(id) ? 'pulse-item'  : '';

  // ── Drag handlers ─────────────────────────────────────
  const handleDragStart = (item, e) => {
    if (!isItem(item)) { e.preventDefault(); return; }
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
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
  };

  // ── Drop handler ──────────────────────────────────────
  const handleDrop = (alvo, e) => {
    e.preventDefault();
    e.stopPropagation();
    // Remove o overlay imediatamente no drop — evita que ele fique preso
    // caso o dragend não dispare após o React re-renderizar o componente
    encerrarOverlayDrag();

    const itemDrop = e.dataTransfer.getData('text/plain') || itemSegurado;
    if (!itemDrop) return;

    const etapa = etapas[etapaAtual];
    if (etapa && itemDrop === etapa.item && alvo !== etapa.alvo) {
      mostrarErroAcao(`Este item não deve ser usado em "${alvo}" neste momento.`);
      setItemSegurado(null);
      return;
    }

    // 🔹 ETAPA 0 — AMOSTRA → TUBO
    if (itemDrop === 'amostra' && alvo === 'tubo' && etapaAtual === 0) {
      setItemSegurado(null);
      setNivelAmostra(a => Math.max(a - 20, 0));
      setNivelTubo(50);
      setCorTubo('#9b5615');
      setTuboPrep(true);
      celebrarAcerto();
      proximaEtapa();
    }

    // 🔹 ETAPA 1 — ESPATULA → PAPAINA
    if (itemDrop === 'espatula' && alvo === 'papaina' && etapaAtual === 1) {
      setItemSegurado(null);
      setEspatulaComPo(true);
      celebrarAcerto();
      proximaEtapa();
    }

    // 🔹 ETAPA 2 — ESPATULA → TUBO
    if (itemDrop === 'espatula' && alvo === 'tubo' && etapaAtual === 2) {
      setItemSegurado(null);
      setEspatulaComPo(false);
      setNivelTubo(53);
      setCorTubo('#a15e1e');
      celebrarAcerto();
      proximaEtapa();
    }

    // 🔹 ETAPA 3 — TUBO → VÓRTEX
    if (itemDrop === 'tubo' && alvo === 'vortex' && etapaAtual === 3) {
      setItemSegurado(null);
      setTipoTuboVortex('tubo');
      setTuboNoVortex(true);
      setVortexLigado(true);
      setTimeout(() => {
        setVortexLigado(false);
        setHomogeneizado(true);
        setCorTubo('rgba(228, 137, 84, 0.75)');
        setTuboNoVortex(false);
        setTipoTuboVortex(null);
        celebrarAcerto();
        proximaEtapa();
      }, 3000);
      return;
    }

    // 🔹 ETAPA 5 — PIPETA → TUBO
    if (itemDrop === 'pipeta' && alvo === 'tubo' && etapaAtual === 5 && tipIdx !== null && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(228, 137, 84, 0.75)');
      setPipetaCheia(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 6 — PIPETA → TUBOVAZIO
    if (itemDrop === 'pipeta' && alvo === 'tubovazio' && etapaAtual === 6 && pipetaCheia) {
      setItemSegurado(null);
      setCorVazio('rgba(204, 141, 104, 0.75)');
      setNivelVazio(t => Math.min((t || 0) + 28, 100));
      setNivelPipeta(0);
      setPipetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 7 — AGUA → TUBOVAZIO
    if (itemDrop === 'agua' && alvo === 'tubovazio' && etapaAtual === 7) {
      setItemSegurado(null);
      setCorVazio('rgba(187, 173, 158, 0.98)');
      setNivelVazio(t => Math.min((t || 0) + 50, 100));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 8 — TUBO2 → VÓRTEX
    if (itemDrop === 'tubovazio' && alvo === 'vortex' && etapaAtual === 8) {
      setItemSegurado(null);
      setTipoTuboVortex('tubovazio');
      setTuboNoVortex(true);
      setVortexLigado(true);
      setTimeout(() => {
        setVortexLigado(false);
        setHomogeneizado(true);
        setCorVazio('rgba(168, 160, 141, 0.75)');
        setTuboNoVortex(false);
        setTipoTuboVortex(null);
        celebrarAcerto();
        proximaEtapa();
      }, 3000);
      return;
    }

    // 🔹 ETAPA 9 — PIPETA → TUBOVAZIO
    if (itemDrop === 'pipeta' && alvo === 'tubovazio' && etapaAtual === 9 && tipIdx !== null && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(223, 211, 185, 0.75)');
      setPipetaCheia(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 10 — PIPETA → TUBOFINAL
    if (itemDrop === 'pipeta' && alvo === 'tubofinal' && etapaAtual === 10 && pipetaCheia) {
      setItemSegurado(null);
      setCorFinal('rgba(184, 167, 148, 0.98)');
      setNivelFinal(t => Math.min((t || 0) + 28, 100));
      setNivelPipeta(0);
      setPipetaCheia(false);
      setTipIdx(null);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 12 — PIPETA → ERITROSINA
    if (itemDrop === 'pipeta' && alvo === 'eritrosina' && etapaAtual === 12 && tipIdx !== null && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('#ff0000');
      setPipetaCheia(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 13 — PIPETA → TUBOFINAL
    if (itemDrop === 'pipeta' && alvo === 'tubofinal' && etapaAtual === 13 && pipetaCheia) {
      setItemSegurado(null);
      setCorFinal('rgba(192, 124, 85, 0.98)');
      setNivelPipeta(0);
      setPipetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 14 — TUBO3 → VÓRTEX
    if (itemDrop === 'tubofinal' && alvo === 'vortex' && etapaAtual === 14) {
      setItemSegurado(null);
      setTipoTuboVortex('tubofinal');
      setTuboNoVortex(true);
      setVortexLigado(true);
      setTimeout(() => {
        setVortexLigado(false);
        setHomogeneizado(true);
        setCorFinal('rgba(255, 108, 108, 0.75)');
        setTuboNoVortex(false);
        setTipoTuboVortex(null);
        celebrarAcerto();
        proximaEtapa();
      }, 3000);
      return;
    }

    // 🔹 ETAPA 15 — PIPETA → TUBOFINAL
    if (itemDrop === 'pipeta' && alvo === 'tubofinal' && etapaAtual === 15 && tipIdx !== null && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(255, 108, 108, 0.75)');
      setPipetaCheia(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 16 — PIPETA → CÂMARA DE NEUBAUER
    if (itemDrop === 'pipeta' && alvo === 'neubauer' && etapaAtual === 16 && pipetaCheia) {
      setItemSegurado(null);
      setNeuCarreg(true);
      setNivelPipeta(0);
      setPipetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 17 — ÓLEO → CÂMARA DE NEUBAUER
    if (itemDrop === 'oil' && alvo === 'neubauer' && etapaAtual === 17) {
      setItemSegurado(null);
      setOilAplicado(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 18 — CÂMARA → MICROSCÓPIO
    if (itemDrop === 'neubauer' && alvo === 'microscopio' && etapaAtual === 18) {
      setItemSegurado(null);
      setLaminaNaMic(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }
  };

  return {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isAlvo, isItem, dropCls, itemCls,
  };
};
