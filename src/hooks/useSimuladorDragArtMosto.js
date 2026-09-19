import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragArtMosto — drag & drop para ART no Mosto/Caldos (28 etapas).
 * Etapas de clique (4, 20, 24, 26) e timers são tratados no componente principal.
 */
export const useSimuladorDragArtMosto = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // Filtração
  funilAcoplado, setFunilAcoplado, setAlgodaoNoFunil, setFiltrando,
  // Balança
  setBalao200NaBalanca, setBalancaZerada, balancaZerada, setPesando,
  // Pipeta
  pipetaCheia, setPipetaCheia, setCorPipeta,
  // Balão 200 #1
  setNivelBalao200, setBalao200Completo,
  // Balão 200 #2
  setNivelBalao200Dois, setCorBalao200Dois,
  setBalao200DoisComAgua, setBalao200DoisCompleto,
  // Micro-ondas / termômetro
  setBalaoNoMicro, setTermometroInserido,
  // Reações
  setHclAdicionado, setFenolGotas,
  setNaohTitulando, setEdtaAdicionado,
  // TE-088
  fehlingAAdicionado, setFehlingAAdicionado,
  setNivelCaldeira, setCorCaldeira,
  setNivelBuretaTE, setCorBuretaTE, setBuretaTE088Cheia,
  setGotejandoAzul, setPosicaoGotasAzul,
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

    // ── ETAPA 0 — FUNIL → BÉQUER 400 ─────────────────────
    if (itemDrop === 'funil' && alvo === 'bequer400' && etapaAtual === 0) {
      setItemSegurado(null); setFunilAcoplado(true); celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 1 — ALGODÃO → BÉQUER (funil) ───────────────
    if (itemDrop === 'algodao' && alvo === 'bequer400' && etapaAtual === 1 && funilAcoplado) {
      setItemSegurado(null); setAlgodaoNoFunil(true); celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 2 — AMOSTRA → BÉQUER (filtração, timer) ────
    if (itemDrop === 'amostra' && alvo === 'bequer400' && etapaAtual === 2) {
      setItemSegurado(null); setFiltrando(true); return;
    }

    // ── ETAPA 3 — BALÃO 200 → BALANÇA (coloca + tara automaticamente) ─
    if (itemDrop === 'balao200' && alvo === 'balanca' && etapaAtual === 3) {
      setItemSegurado(null);
      setBalao200NaBalanca(true);
      setBalancaZerada(true); // auto-tara ao colocar o balão
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 5 — BÉQUER → BALANÇA (inicia pesagem ao soltar) ──────────
    if (itemDrop === 'bequer400' && alvo === 'balanca' && etapaAtual === 5 && balancaZerada) {
      setItemSegurado(null);
      setPesando(true); // peso só sobe após arrastar o béquer
      return;
    }

    // ── ETAPA 6 — ÁGUA → BALÃO 200 (menisco) ─────────────
    if (itemDrop === 'agua' && alvo === 'balao200' && etapaAtual === 6) {
      setItemSegurado(null);
      setNivelBalao200(100);
      setBalao200Completo(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 7 — PIPETA → BALÃO 200 (aspirar 10 mL) ─────
    if (itemDrop === 'pipeta' && alvo === 'balao200' && etapaAtual === 7 && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(210,175,75,0.75)');
      setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 8 — PIPETA → BALÃO 200Dois (alíquota) ──────
    if (itemDrop === 'pipeta' && alvo === 'balao200dois' && etapaAtual === 8 && pipetaCheia) {
      setItemSegurado(null);
      setNivelBalao200Dois(30); setCorBalao200Dois('rgba(210,175,75,0.58)');
      setPipetaCheia(false); setCorPipeta('rgba(140,200,240,0.65)');
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 9 — ÁGUA → BALÃO 200Dois ───────────────────
    if (itemDrop === 'agua' && alvo === 'balao200dois' && etapaAtual === 9) {
      setItemSegurado(null);
      setNivelBalao200Dois(48); setBalao200DoisComAgua(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 10 — BALÃO 200Dois → MICRO-ONDAS (timer) ───
    if (itemDrop === 'balao200dois' && alvo === 'microondas' && etapaAtual === 10) {
      setItemSegurado(null); setBalaoNoMicro(true); return;
    }

    // ── ETAPA 11 — TERMÔMETRO → BALÃO 200Dois (timer) ────
    if (itemDrop === 'termometro' && alvo === 'balao200dois' && etapaAtual === 11) {
      setItemSegurado(null); setTermometroInserido(true); return;
    }

    // ── ETAPA 12 — PIPETA → HCl (aspirar) ────────────────
    if (itemDrop === 'pipeta' && alvo === 'hcl' && etapaAtual === 12 && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(200,235,255,0.72)');
      setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 13 — PIPETA → BALÃO 200Dois (HCl) ──────────
    if (itemDrop === 'pipeta' && alvo === 'balao200dois' && etapaAtual === 13 && pipetaCheia) {
      setItemSegurado(null);
      setNivelBalao200Dois(52); setCorBalao200Dois('rgba(200,168,62,0.62)');
      setPipetaCheia(false); setCorPipeta('rgba(140,200,240,0.65)');
      setHclAdicionado(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 14 — FENOL → BALÃO 200Dois (gotas, timer) ──
    if (itemDrop === 'fenol' && alvo === 'balao200dois' && etapaAtual === 14) {
      setItemSegurado(null); setFenolGotas(true); return;
    }

    // ── ETAPA 15 — PIPETA → NaOH (aspirar) ───────────────
    if (itemDrop === 'pipeta' && alvo === 'naoh' && etapaAtual === 15 && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(245,245,255,0.72)');
      setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 16 — PIPETA → BALÃO 200Dois (NaOH, neutralizar) ─
    if (itemDrop === 'pipeta' && alvo === 'balao200dois' && etapaAtual === 16 && pipetaCheia) {
      setItemSegurado(null);
      setPipetaCheia(false); setCorPipeta('rgba(140,200,240,0.65)');
      setNaohTitulando(true); return; // timer handles cor change + proximaEtapa
    }

    // ── ETAPA 17 — PIPETA → EDTA (aspirar) ───────────────
    if (itemDrop === 'pipeta' && alvo === 'edta' && etapaAtual === 17 && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(180,100,220,0.72)');
      setPipetaCheia(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 18 — PIPETA → BALÃO 200Dois (EDTA, eliminar rosa) ─
    if (itemDrop === 'pipeta' && alvo === 'balao200dois' && etapaAtual === 18 && pipetaCheia) {
      setItemSegurado(null);
      setNivelBalao200Dois(58); setCorBalao200Dois('rgba(202,162,60,0.62)');
      setPipetaCheia(false); setCorPipeta('rgba(140,200,240,0.65)');
      setEdtaAdicionado(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 19 — ÁGUA → BALÃO 200Dois (menisco) ────────
    if (itemDrop === 'agua' && alvo === 'balao200dois' && etapaAtual === 19) {
      setItemSegurado(null);
      setNivelBalao200Dois(100); setBalao200DoisCompleto(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 21 — FEHLING A → TE-088 ────────────────────
    if (itemDrop === 'fehlinga' && alvo === 'te088' && etapaAtual === 21) {
      setItemSegurado(null);
      setFehlingAAdicionado(true);
      setNivelCaldeira(15); setCorCaldeira('rgba(20,45,185,0.55)');
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 22 — FEHLING B → TE-088 ────────────────────
    if (itemDrop === 'fehlingb' && alvo === 'te088' && etapaAtual === 22 && fehlingAAdicionado) {
      setItemSegurado(null);
      setNivelCaldeira(30); setCorCaldeira('rgba(0,22,162,0.72)');
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 23 — BALÃO 200Dois → TE-088 (encher bureta) ─
    if (itemDrop === 'balao200dois' && alvo === 'te088' && etapaAtual === 23) {
      setItemSegurado(null);
      setNivelBuretaTE(100); setCorBuretaTE('rgba(210,175,75,0.78)');
      setBuretaTE088Cheia(true);
      celebrarAcerto(); proximaEtapa(); return;
    }

    // ── ETAPA 25 — AZUL METILENO → TE-088 (gotas) ────────
    if (itemDrop === 'azulmetileno' && alvo === 'te088' && etapaAtual === 25) {
      setItemSegurado(null);
      setPosicaoGotasAzul([]);
      setGotejandoAzul(true);
      return; // timer handles gotas + proximaEtapa via useARTTE088 pattern
    }
  };

  return {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isAlvo, isItem, dropCls, itemCls,
  };
};
