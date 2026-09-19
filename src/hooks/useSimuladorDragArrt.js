import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

export const useSimuladorDragArrt = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // Funil / algodão
  funilAcoplado, setFunilAcoplado, setAlgodaoNoFunil,
  // Filtração (dispara timer via estado)
  setFiltrando,
  // Pipeta
  pipetaCheia, setPipetaCheia, setCorPipeta,
  // Béquer 150mL
  setNivelBequer150, setCorBequer150,
  // Timers / estados externos
  setBequerNoMicro1, setBequerNoMicro2,
  setFenolGotas,
  setTitulandoNaOH,
  // Vidro relógio
  setVidroRelogioAcoplado,
  // Titrino
  setBequerNoTitrino,
}) => {

  const isAlvo  = (id) => etapas[etapaAtual]?.alvo === id;
  const isItem  = (id) => etapas[etapaAtual]?.item === id;
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

  const handleDragEnd = () => { setItemSegurado(null); encerrarOverlayDrag(); };
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


    // ── ETAPA 0 — FUNIL → BÉQUER 400 mL ─────────────────
    if (itemDrop === 'funil' && alvo === 'bequer400' && etapaAtual === 0) {
      setItemSegurado(null); setFunilAcoplado(true); celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 1 — ALGODÃO → FUNIL (acoplado dentro do bequer400) ────
    if (itemDrop === 'algodao' && alvo === 'bequer400' && etapaAtual === 1 && funilAcoplado) {
      setItemSegurado(null); setAlgodaoNoFunil(true); celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 2 — AMOSTRA → BÉQUER 400 (filtração, timer) ─
    if (itemDrop === 'amostra' && alvo === 'bequer400' && etapaAtual === 2) {
      setItemSegurado(null); setFiltrando(true); return; // useEffect handles timer + proximaEtapa
    }

    // ── ETAPA 3 — PIPETA → BÉQUER 400 (aspirar amostra) ──
    if (itemDrop === 'pipeta' && alvo === 'bequer400' && etapaAtual === 3 && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(220,190,100,0.75)');
      setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 4 — PIPETA → BÉQUER 150 (transferir 15 mL) ─
    if (itemDrop === 'pipeta' && alvo === 'bequer150' && etapaAtual === 4 && pipetaCheia) {
      setItemSegurado(null);
      setNivelBequer150(25); setCorBequer150('rgba(220,190,100,0.55)');
      setPipetaCheia(false); setCorPipeta('rgba(140,200,240,0.65)');
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 5 — BÉQUER 150 → MICROONDAS (1ª vez, timer) ─
    if (itemDrop === 'bequer150' && alvo === 'microondas' && etapaAtual === 5) {
      setItemSegurado(null); setBequerNoMicro1(true); return;
    }

    // ── ETAPA 6 — PIPETA → HCl (aspirar) ─────────────────
    if (itemDrop === 'pipeta' && alvo === 'hcl' && etapaAtual === 6 && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(200,235,255,0.72)');
      setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 7 — PIPETA → BÉQUER 150 (adicionar HCl) ────
    if (itemDrop === 'pipeta' && alvo === 'bequer150' && etapaAtual === 7 && pipetaCheia) {
      setItemSegurado(null);
      setNivelBequer150(28); setCorBequer150('rgba(215,185,92,0.62)');
      setPipetaCheia(false); setCorPipeta('rgba(140,200,240,0.65)');
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 8 — FENOLFTALEÍNA → BÉQUER 150 (gotas, timer) ─
    if (itemDrop === 'fenol' && alvo === 'bequer150' && etapaAtual === 8) {
      setItemSegurado(null); setFenolGotas(true); return;
    }

    // ── ETAPA 9 — PIPETA → NaOH (aspirar) ────────────────
    if (itemDrop === 'pipeta' && alvo === 'naoh' && etapaAtual === 9 && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(245,245,255,0.72)');
      setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 10 — PIPETA → BÉQUER 150 (neutralizar com NaOH) ─
    if (itemDrop === 'pipeta' && alvo === 'bequer150' && etapaAtual === 10 && pipetaCheia) {
      setItemSegurado(null);
      setNivelBequer150(35); setCorBequer150('rgba(220,78,88,0.74)');
      setPipetaCheia(false); setCorPipeta('rgba(140,200,240,0.65)');
      setTitulandoNaOH(true); // animação de mistura/titulação
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 11 — PIPETA → FEHLING B (aspirar) ──────────
    if (itemDrop === 'pipeta' && alvo === 'fehlingb' && etapaAtual === 11 && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(0,50,180,0.72)');
      setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 12 — PIPETA → BÉQUER 150 (Fehling B) ───────
    if (itemDrop === 'pipeta' && alvo === 'bequer150' && etapaAtual === 12 && pipetaCheia) {
      setItemSegurado(null);
      setNivelBequer150(43); setCorBequer150('rgba(100,25,150,0.82)');
      setPipetaCheia(false); setCorPipeta('rgba(140,200,240,0.65)');
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 13 — PIPETA → FEHLING A (aspirar) ──────────
    if (itemDrop === 'pipeta' && alvo === 'fehlinga' && etapaAtual === 13 && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(10,40,160,0.72)');
      setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 14 — PIPETA → BÉQUER 150 (Fehling A) ───────
    if (itemDrop === 'pipeta' && alvo === 'bequer150' && etapaAtual === 14 && pipetaCheia) {
      setItemSegurado(null);
      setNivelBequer150(50); setCorBequer150('rgba(50,8,8,0.93)');
      setPipetaCheia(false); setCorPipeta('rgba(140,200,240,0.65)');
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 15 — VIDRO RELÓGIO → BÉQUER 150 (acoplar) ──
    if (itemDrop === 'vidrorel' && alvo === 'bequer150' && etapaAtual === 15) {
      setItemSegurado(null); setVidroRelogioAcoplado(true); celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 16 — BÉQUER 150 → MICROONDAS (2ª vez, timer) ─
    if (itemDrop === 'bequer150' && alvo === 'microondas' && etapaAtual === 16) {
      setItemSegurado(null); setBequerNoMicro2(true); return;
    }

    // ── ETAPA 17 — ÁGUA → BÉQUER 150 (35 mL) ─────────────
    if (itemDrop === 'agua' && alvo === 'bequer150' && etapaAtual === 17) {
      setItemSegurado(null);
      setNivelBequer150(74); setCorBequer150('rgba(55,10,10,0.78)');
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 18 — PIPETA → IODETO (aspirar) ─────────────
    if (itemDrop === 'pipeta' && alvo === 'iodeto' && etapaAtual === 18 && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(220,180,30,0.72)');
      setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 19 — PIPETA → BÉQUER 150 (iodeto) ──────────
    if (itemDrop === 'pipeta' && alvo === 'bequer150' && etapaAtual === 19 && pipetaCheia) {
      setItemSegurado(null);
      setNivelBequer150(82); setCorBequer150('rgba(80,20,5,0.86)');
      setPipetaCheia(false); setCorPipeta('rgba(140,200,240,0.65)');
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 20 — PIPETA → H₂SO₄ 25% (aspirar) ─────────
    if (itemDrop === 'pipeta' && alvo === 'sulfurico' && etapaAtual === 20 && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(210,235,255,0.72)');
      setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 21 — PIPETA → BÉQUER 150 (H₂SO₄) ──────────
    if (itemDrop === 'pipeta' && alvo === 'bequer150' && etapaAtual === 21 && pipetaCheia) {
      setItemSegurado(null);
      setNivelBequer150(88); setCorBequer150('rgba(90,25,5,0.90)');
      setPipetaCheia(false); setCorPipeta('rgba(140,200,240,0.65)');
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 22 — BÉQUER 150 → TITRINO ──────────────────
    if (itemDrop === 'bequer150' && alvo === 'titrino' && etapaAtual === 22) {
      setItemSegurado(null); setBequerNoTitrino(true); celebrarAcerto(); proximaEtapa(); return;
    }
  };

  return {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isAlvo, isItem, dropCls, itemCls,
  };
};
