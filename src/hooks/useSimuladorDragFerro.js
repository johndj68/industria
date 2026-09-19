import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragFerro — drag & drop para Ferro Total (Ferrozine).
 * Etapas de clique (8, 14, 17) e timers (9, 18) tratadas no componente.
 */
export const useSimuladorDragFerro = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // Proveta
  setNivelProveta, setProvetaCheia,
  // Fontes
  setNivelAgua, setNivelAmostra,
  // Erlenmeyer Branco
  setNivelBranco, setCorBranco,
  setBrancoPrep, setFerrozineBranco, setBrancoNaChapa,
  // Erlenmeyer Amostra
  setNivelAmostraCopo, setCorAmostraCopo,
  setAmostraPrep, setFerrozineAmostra, setAmostraNaChapa,
  // Cubeta
  setNivelCubeta, setCorCubeta,
  // Fotômetro
  setCubetaNoFotometro,
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

    // ── ETAPA 0 — ÁGUA → PROVETA ──────────────────────────
    if (itemDrop === 'agua' && alvo === 'proveta' && etapaAtual === 0) {
      setItemSegurado(null);
      setNivelProveta(50);
      setProvetaCheia(true);
      setNivelAgua(n => Math.max(n - 22, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 1 — PROVETA → ERLENMEYER BRANCO ────────────
    if (itemDrop === 'proveta' && alvo === 'erlenmeyer_branco' && etapaAtual === 1) {
      setItemSegurado(null);
      setNivelBranco(44);
      setCorBranco('rgba(195,225,250,0.52)');
      setBrancoPrep(true);
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 2 — AMOSTRA → PROVETA ───────────────────────
    if (itemDrop === 'amostra' && alvo === 'proveta' && etapaAtual === 2) {
      setItemSegurado(null);
      setNivelProveta(50);
      setProvetaCheia(true);
      setNivelAmostra(n => Math.max(n - 22, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 3 — PROVETA → ERLENMEYER AMOSTRA ───────────
    if (itemDrop === 'proveta' && alvo === 'erlenmeyer_amostra' && etapaAtual === 3) {
      setItemSegurado(null);
      setNivelAmostraCopo(44);
      setCorAmostraCopo('rgba(210,185,130,0.58)'); // amostra levemente amarelada
      setAmostraPrep(true);
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 4 — FERROZINE → BRANCO ─────────────────────
    if (itemDrop === 'ferrozine' && alvo === 'erlenmeyer_branco' && etapaAtual === 4) {
      setItemSegurado(null);
      setFerrozineBranco(true);
      setCorBranco('rgba(255,205,195,0.55)'); // leve rosado branco
      setNivelBranco(48);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 5 — FERROZINE → AMOSTRA ────────────────────
    if (itemDrop === 'ferrozine' && alvo === 'erlenmeyer_amostra' && etapaAtual === 5) {
      setItemSegurado(null);
      setFerrozineAmostra(true);
      setCorAmostraCopo('rgba(215,95,50,0.70)'); // laranja-avermelhado (ferro + ferrozine)
      setNivelAmostraCopo(48);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 6 — ERLENMEYER BRANCO → CHAPA ──────────────
    if (itemDrop === 'erlenmeyer_branco' && alvo === 'chapa' && etapaAtual === 6) {
      setItemSegurado(null);
      setBrancoNaChapa(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 7 — ERLENMEYER AMOSTRA → CHAPA ─────────────
    if (itemDrop === 'erlenmeyer_amostra' && alvo === 'chapa' && etapaAtual === 7) {
      setItemSegurado(null);
      setAmostraNaChapa(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 10 — ÁGUA → ERLENMEYER BRANCO (completar) ──
    if (itemDrop === 'agua' && alvo === 'erlenmeyer_branco' && etapaAtual === 10) {
      setItemSegurado(null);
      setNivelBranco(52);
      setNivelAgua(n => Math.max(n - 15, 10));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 11 — ÁGUA → ERLENMEYER AMOSTRA (completar) ─
    if (itemDrop === 'agua' && alvo === 'erlenmeyer_amostra' && etapaAtual === 11) {
      setItemSegurado(null);
      setNivelAmostraCopo(52);
      setNivelAgua(n => Math.max(n - 15, 10));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 12 — ERLENMEYER BRANCO → CUBETA ────────────
    if (itemDrop === 'erlenmeyer_branco' && alvo === 'cubeta' && etapaAtual === 12) {
      setItemSegurado(null);
      setNivelCubeta(70);
      setCorCubeta('rgba(255,205,195,0.68)'); // branco rosado claro
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPAS 13,16 — CUBETA → FOTÔMETRO ────────────────
    if (itemDrop === 'cubeta' && alvo === 'fotometro' && (etapaAtual === 13 || etapaAtual === 16)) {
      setItemSegurado(null);
      setCubetaNoFotometro(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 15 — ERLENMEYER AMOSTRA → CUBETA ───────────
    if (itemDrop === 'erlenmeyer_amostra' && alvo === 'cubeta' && etapaAtual === 15) {
      setItemSegurado(null);
      setNivelCubeta(70);
      setCorCubeta('rgba(200,78,40,0.78)'); // laranja-avermelhado da amostra
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
