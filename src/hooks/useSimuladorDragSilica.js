import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

export const useSimuladorDragSilica = (etapas, {
  // game
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // proveta
  setNivelProveta, setProvetaCheia,
  // amostra
  setNivelAmostra,
  // pipeta
  tipIdx, pipetaCheia,
  setCorPipeta, setPipetaCheia, setNivelPipeta, setTipIdx,
  // copos
  setNivelCopoA, setCorCopoA,
  setNivelBranco, setCorBranco,
  // cubeta
  setNivelCubeta, setCorCubeta,
  // fotometro
  setCubetaNoFotometro,
  // reagentes
  setMolibdatoBranco, setMolibdatoA,
  setCitricoBranco, setCitricoA,
  setAminoA,
}) => {

  const isAlvo = (id) => etapas[etapaAtual]?.alvo === id;
  const isItem = (id) => etapas[etapaAtual]?.item === id;
  const dropCls = (id) => isAlvo(id) ? 'drop-target' : '';
  const itemCls = (id) => isItem(id) ? 'pulse-item'  : '';

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

  const handleDragOver  = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDragEnter = (e) => { e.preventDefault(); };

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

    // ── Fase 1: distribuição da amostra ──────────────────────────────────

    // 🔹 ETAPAS 0 e 2 — AMOSTRA → PROVETA
    if (itemDrop === 'amostra' && alvo === 'proveta' && (etapaAtual === 0 || etapaAtual === 2)) {
      setItemSegurado(null);
      setNivelProveta(50); // 25mL = 50% de 50mL
      setProvetaCheia(true);
      setNivelAmostra(n => Math.max(n - 20, 20));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 1 — PROVETA → COPO BRANCO
    if (itemDrop === 'proveta' && alvo === 'copobranco' && etapaAtual === 1) {
      setItemSegurado(null);
      setNivelBranco(55);
      setCorBranco('rgba(140,200,240,0.52)');
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 3 — PROVETA → COPO A
    if (itemDrop === 'proveta' && alvo === 'copoA' && etapaAtual === 3) {
      setItemSegurado(null);
      setNivelCopoA(55);
      setCorCopoA('rgba(140,200,240,0.58)');
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── Fase 2: Molybdate 3 ───────────────────────────────────────────────

    // 🔹 ETAPAS 5 e 7 — PIPETA → MOLIBDATO (aspirar)
    if (itemDrop === 'pipeta' && alvo === 'molibdato' &&
        (etapaAtual === 5 || etapaAtual === 7) && tipIdx !== null && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(220,155,35,0.85)');
      setPipetaCheia(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 6 — PIPETA → COPO BRANCO (dispensar Molybdate)
    if (itemDrop === 'pipeta' && alvo === 'copobranco' && etapaAtual === 6 && pipetaCheia) {
      setItemSegurado(null);
      setNivelBranco(68);
      setCorBranco('rgba(235,215,55,0.55)');
      setMolibdatoBranco(true);
      setNivelPipeta(0);
      setPipetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 8 — PIPETA → COPO A (dispensar Molybdate)
    if (itemDrop === 'pipeta' && alvo === 'copoA' && etapaAtual === 8 && pipetaCheia) {
      setItemSegurado(null);
      setNivelCopoA(68);
      setCorCopoA('rgba(235,215,55,0.68)');
      setMolibdatoA(true);
      setNivelPipeta(0);
      setPipetaCheia(false);
      setTipIdx(null); // força nova ponteira na etapa 10
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── Fase 4: Citric Acid ───────────────────────────────────────────────

    // 🔹 ETAPAS 11 e 13 — PIPETA → CITRICO (aspirar)
    if (itemDrop === 'pipeta' && alvo === 'citrico' &&
        (etapaAtual === 11 || etapaAtual === 13) && tipIdx !== null && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(90,200,70,0.85)');
      setPipetaCheia(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 12 — PIPETA → COPO BRANCO (dispensar Citric Acid)
    if (itemDrop === 'pipeta' && alvo === 'copobranco' && etapaAtual === 12 && pipetaCheia) {
      setItemSegurado(null);
      setNivelBranco(75);
      setCorBranco('rgba(222,210,52,0.52)');
      setCitricoBranco(true);
      setNivelPipeta(0);
      setPipetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 14 — PIPETA → COPO A (dispensar Citric Acid)
    if (itemDrop === 'pipeta' && alvo === 'copoA' && etapaAtual === 14 && pipetaCheia) {
      setItemSegurado(null);
      setNivelCopoA(75);
      setCorCopoA('rgba(222,208,48,0.65)');
      setCitricoA(true);
      setNivelPipeta(0);
      setPipetaCheia(false);
      setTipIdx(null); // força nova ponteira na etapa 16
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── Fase 6: Amino Acid F ──────────────────────────────────────────────

    // 🔹 ETAPA 17 — PIPETA → AMINO (aspirar)
    if (itemDrop === 'pipeta' && alvo === 'amino' && etapaAtual === 17 && tipIdx !== null && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(40,80,220,0.85)');
      setPipetaCheia(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPA 18 — PIPETA → COPO A (dispensar Amino Acid F — SOMENTE!)
    if (itemDrop === 'pipeta' && alvo === 'copoA' && etapaAtual === 18 && pipetaCheia) {
      setItemSegurado(null);
      setNivelCopoA(82);
      setCorCopoA('rgba(25,90,198,0.78)');
      setAminoA(true);
      setNivelPipeta(0);
      setPipetaCheia(false);
      celebrarAcerto(150);
      proximaEtapa();
      return;
    }

    // ── Fase 8: Fotometria — branco ───────────────────────────────────────

    // 🔹 ETAPA 20 — COPO BRANCO → CUBETA
    if (itemDrop === 'copobranco' && alvo === 'cubeta' && etapaAtual === 20) {
      setItemSegurado(null);
      setNivelCubeta(72);
      setCorCubeta('rgba(222,210,52,0.52)');
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // 🔹 ETAPAS 21 e 24 — CUBETA → FOTÔMETRO
    if (itemDrop === 'cubeta' && alvo === 'fotometro' && (etapaAtual === 21 || etapaAtual === 24)) {
      setItemSegurado(null);
      setCubetaNoFotometro(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── Fase 9: Fotometria — amostra ─────────────────────────────────────

    // 🔹 ETAPA 23 — COPO A → CUBETA
    if (itemDrop === 'copoA' && alvo === 'cubeta' && etapaAtual === 23) {
      setItemSegurado(null);
      setNivelCubeta(72);
      setCorCubeta('rgba(25,90,198,0.80)');
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
