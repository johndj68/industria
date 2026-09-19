import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragFerroHach — drag & drop para Ferro Total — Método HACH / FerroVer.
 *
 * Drag steps: 0, 1, 4, 6, 9.
 * Clique steps (2, 5, 7, 8, 10) e timers (3, 11) tratados no componente.
 */
export const useSimuladorDragFerroHach = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // Fonte
  setNivelAmostra,
  // Cubeta Amostra
  setNivelCubetaAmostra, setCorCubetaAmostra,
  setAmostraNaCubeta, setFerroverAdicionado,
  setMostrarPo, setPoKey,
  // Cubeta Branco
  setNivelCubetaBranco, setCorCubetaBranco,
  setBrancoPreparado,
  // Fotômetro
  setCubetaNoFotometro, setEhBrancoNoFoto,
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
      mostrarErroAcao('Este item não deve ser usado aqui neste momento.');
      setItemSegurado(null);
      return;
    }

    // ── E0 — AMOSTRA → CUBETA AMOSTRA ───────────────────────────────────
    if (itemDrop === 'amostra' && alvo === 'cubeta_amostra' && etapaAtual === 0) {
      setItemSegurado(null);
      setAmostraNaCubeta(true);
      setNivelCubetaAmostra(80);
      setCorCubetaAmostra('rgba(185,215,250,0.68)'); // água clara, levemente amarelada
      setNivelAmostra(n => Math.max(n - 28, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E1 — FerroVer → CUBETA AMOSTRA ──────────────────────────────────
    if (itemDrop === 'ferroVer' && alvo === 'cubeta_amostra' && etapaAtual === 1) {
      setItemSegurado(null);
      setFerroverAdicionado(true);
      setPoKey(k => k + 1);
      setMostrarPo(true);
      // Cor muda levemente (pó disperso na água)
      setCorCubetaAmostra('rgba(215,190,110,0.62)');
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E4 — AMOSTRA → CUBETA BRANCO ────────────────────────────────────
    if (itemDrop === 'amostra' && alvo === 'cubeta_branco' && etapaAtual === 4) {
      setItemSegurado(null);
      setBrancoPreparado(true);
      setNivelCubetaBranco(80);
      setCorCubetaBranco('rgba(185,215,250,0.66)'); // transparente, sem reagente
      setNivelAmostra(n => Math.max(n - 20, 12));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E6 — CUBETA BRANCO → FOTÔMETRO ──────────────────────────────────
    if (itemDrop === 'cubeta_branco' && alvo === 'fotometro' && etapaAtual === 6) {
      setItemSegurado(null);
      setCubetaNoFotometro(true);
      setEhBrancoNoFoto(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E9 — CUBETA AMOSTRA → FOTÔMETRO ─────────────────────────────────
    if (itemDrop === 'cubeta_amostra' && alvo === 'fotometro' && etapaAtual === 9) {
      setItemSegurado(null);
      setCubetaNoFotometro(true);
      setEhBrancoNoFoto(false);
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
