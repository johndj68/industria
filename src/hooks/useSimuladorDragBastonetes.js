/**
 * useSimuladorDragBastonetes.js — Hook de drag-and-drop para o simulador
 * de Contagem de Bastonetes Vivos.
 *
 * Adaptado de useSimuladorDrag.js para o fluxo de 21 etapas da análise de
 * bastonetes em amostra de vinho pós-fermentação.
 *
 * Diferenças em relação ao hook original:
 *   • 'eritrosina' → 'corante' (Azul de Metileno + Sulfato de Nilo)
 *   • 'neubauer'   → 'lamina'  (lâmina de infecção microscópica)
 *   • P1000 removida na etapa 12 (não na 10) para cobrir aspiração do corante
 *   • setLaminaCarreg / setOleoNaLamina substituem setNeuCarreg / setOilAplicado
 */
import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

export const useSimuladorDragBastonetes = (etapas, {
  // game
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // espátula
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
  // lâmina / microscópio
  setLaminaCarreg, setOleoNaLamina, setLaminaNaMic,
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
      setCorTubo('rgba(180, 100, 30, 0.82)');
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
      setCorTubo('rgba(160, 110, 40, 0.85)');
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
        setCorTubo('rgba(200, 130, 60, 0.80)');
        setTuboNoVortex(false);
        setTipoTuboVortex(null);
        celebrarAcerto();
        proximaEtapa();
      }, 3000);
      return;
    }

    // 🔹 ETAPA 5 — PIPETA → TUBO (aspirar amostra)
    if (itemDrop === 'pipeta' && alvo === 'tubo' && etapaAtual === 5 && tipIdx !== null && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(200, 130, 60, 0.80)');
      setPipetaCheia(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 6 — PIPETA → TUBOVAZIO (depositar amostra)
    if (itemDrop === 'pipeta' && alvo === 'tubovazio' && etapaAtual === 6 && pipetaCheia) {
      setItemSegurado(null);
      setCorVazio('rgba(200, 160, 80, 0.75)');
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

    // 🔹 ETAPA 8 — TUBOVAZIO → VÓRTEX
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

    // 🔹 ETAPA 9 — PIPETA → TUBOVAZIO (aspirar diluído)
    if (itemDrop === 'pipeta' && alvo === 'tubovazio' && etapaAtual === 9 && tipIdx !== null && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(200, 180, 140, 0.75)');
      setPipetaCheia(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 10 — PIPETA → TUBOFINAL (1 mL amostra diluída)
    // Nota: tipIdx NÃO é removido aqui — P1000 permanece para aspirar o corante
    if (itemDrop === 'pipeta' && alvo === 'tubofinal' && etapaAtual === 10 && pipetaCheia) {
      setItemSegurado(null);
      setCorFinal('rgba(184, 167, 148, 0.98)');
      setNivelFinal(t => Math.min((t || 0) + 28, 100));
      setNivelPipeta(0);
      setPipetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 11 — PIPETA → CORANTE (Azul de Metileno + Sulfato de Nilo)
    if (itemDrop === 'pipeta' && alvo === 'corante' && etapaAtual === 11 && tipIdx !== null && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(30, 100, 220, 0.82)');
      setPipetaCheia(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 12 — PIPETA → TUBOFINAL (adicionar corante)
    // P1000 é removida aqui: próxima ponteira será a P500
    if (itemDrop === 'pipeta' && alvo === 'tubofinal' && etapaAtual === 12 && pipetaCheia) {
      setItemSegurado(null);
      setCorFinal('rgba(55, 130, 215, 0.62)');
      setNivelPipeta(0);
      setPipetaCheia(false);
      setTipIdx(null);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 13 — TUBOFINAL → VÓRTEX
    if (itemDrop === 'tubofinal' && alvo === 'vortex' && etapaAtual === 13) {
      setItemSegurado(null);
      setTipoTuboVortex('tubofinal');
      setTuboNoVortex(true);
      setVortexLigado(true);
      setTimeout(() => {
        setVortexLigado(false);
        setHomogeneizado(true);
        setCorFinal('rgba(45, 120, 205, 0.68)');
        setTuboNoVortex(false);
        setTipoTuboVortex(null);
        celebrarAcerto();
        proximaEtapa();
      }, 3000);
      return;
    }

    // 🔹 ETAPA 15 — PIPETA → TUBOFINAL (aspirar volume para lâmina)
    if (itemDrop === 'pipeta' && alvo === 'tubofinal' && etapaAtual === 15 && tipIdx !== null && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(45, 120, 205, 0.68)');
      setPipetaCheia(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 16 — PIPETA → LÂMINA (depositar na lâmina de infecção)
    if (itemDrop === 'pipeta' && alvo === 'lamina' && etapaAtual === 16 && pipetaCheia) {
      setItemSegurado(null);
      setLaminaCarreg(true);
      setNivelPipeta(0);
      setPipetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 17 — ÓLEO → LÂMINA
    if (itemDrop === 'oil' && alvo === 'lamina' && etapaAtual === 17) {
      setItemSegurado(null);
      setOleoNaLamina(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 18 — LÂMINA → MICROSCÓPIO
    if (itemDrop === 'lamina' && alvo === 'microscopio' && etapaAtual === 18) {
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
