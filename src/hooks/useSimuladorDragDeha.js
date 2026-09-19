import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragDeha — drag & drop para Determinação de DEHA.
 * Etapas de timer (8, 11, 18) e clique (14, 17) tratadas no componente principal.
 */
export const useSimuladorDragDeha = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // Proveta
  setNivelProveta, setProvetaCheia,
  // Frascos fonte
  setNivelAgua, setNivelAmostra,
  // Copo Branco
  setNivelBranco, setCorBranco,
  setDeha1Branco, setDeha2Branco, setBrancoNaCaixa,
  // Copo Amostra
  setNivelAmostraCopo, setCorAmostraCopo,
  setDeha1Amostra, setDeha2Amostra, setAmostraNaCaixa,
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
      setNivelProveta(50); // 25 mL marcados
      setProvetaCheia(true);
      setNivelAgua(n => Math.max(n - 20, 20));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 1 — PROVETA → COPO BRANCO ──────────────────
    if (itemDrop === 'proveta' && alvo === 'copobranco' && etapaAtual === 1) {
      setItemSegurado(null);
      setNivelBranco(52);
      setCorBranco('rgba(200,230,250,0.50)');
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
      setNivelAmostra(n => Math.max(n - 20, 20));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 3 — PROVETA → COPO AMOSTRA ─────────────────
    if (itemDrop === 'proveta' && alvo === 'copoamostra' && etapaAtual === 3) {
      setItemSegurado(null);
      setNivelAmostraCopo(52);
      setCorAmostraCopo('rgba(185,215,245,0.52)');
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 4 — DEHA 1 → COPO BRANCO ───────────────────
    if (itemDrop === 'deha1' && alvo === 'copobranco' && etapaAtual === 4) {
      setItemSegurado(null);
      setDeha1Branco(true);
      setNivelBranco(55);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 5 — DEHA 1 → COPO AMOSTRA ──────────────────
    if (itemDrop === 'deha1' && alvo === 'copoamostra' && etapaAtual === 5) {
      setItemSegurado(null);
      setDeha1Amostra(true);
      setNivelAmostraCopo(55);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 6 — DEHA 2 → COPO BRANCO ───────────────────
    if (itemDrop === 'deha2' && alvo === 'copobranco' && etapaAtual === 6) {
      setItemSegurado(null);
      setDeha2Branco(true);
      setNivelBranco(58);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 7 — DEHA 2 → COPO AMOSTRA ──────────────────
    if (itemDrop === 'deha2' && alvo === 'copoamostra' && etapaAtual === 7) {
      setItemSegurado(null);
      setDeha2Amostra(true);
      setNivelAmostraCopo(58);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 9 — COPO BRANCO → CAIXA ESCURA ─────────────
    if (itemDrop === 'copobranco' && alvo === 'caixaescura' && etapaAtual === 9) {
      setItemSegurado(null);
      setBrancoNaCaixa(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 10 — COPO AMOSTRA → CAIXA ESCURA ───────────
    if (itemDrop === 'copoamostra' && alvo === 'caixaescura' && etapaAtual === 10) {
      setItemSegurado(null);
      setAmostraNaCaixa(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 12 — COPO BRANCO → CUBETA ──────────────────
    if (itemDrop === 'copobranco' && alvo === 'cubeta' && etapaAtual === 12) {
      setItemSegurado(null);
      setNivelCubeta(72);
      setCorCubeta('rgba(255,182,193,0.70)'); // rosa claro
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 13 — CUBETA → FOTÔMETRO ────────────────────
    if (itemDrop === 'cubeta' && alvo === 'fotometro' && (etapaAtual === 13 || etapaAtual === 16)) {
      setItemSegurado(null);
      setCubetaNoFotometro(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 15 — COPO AMOSTRA → CUBETA ─────────────────
    if (itemDrop === 'copoamostra' && alvo === 'cubeta' && etapaAtual === 15) {
      setItemSegurado(null);
      setNivelCubeta(72);
      setCorCubeta('rgba(180,100,220,0.70)'); // roxo claro
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
