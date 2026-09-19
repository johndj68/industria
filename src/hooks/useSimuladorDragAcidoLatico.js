import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragAcidoLatico — drag & drop para Determinação de Ácido Lático.
 * Etapas de clique (2, 7) e rack (3) tratadas no componente principal.
 */
export const useSimuladorDragAcidoLatico = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // Amostra / tubo
  setNivelAmostra, setTuboComAmostra, setCorTubo,
  // Tubo → centrifuga
  setTuboNaCentrifuga,
  // Pipeta
  tipIdx, pipetaCheia, setPipetaCheia, setNivelPipeta, setCorPipeta,
  // Fita
  setGotaNaFita, setFitaReagida,
  // Leitor
  setFitaNoLeitor,
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

    // ── ETAPA 0 — AMOSTRA → TUBO ──────────────────────────
    if (itemDrop === 'amostra' && alvo === 'tubo' && etapaAtual === 0) {
      setItemSegurado(null);
      setTuboComAmostra(true);
      setCorTubo('rgba(200,150,50,0.68)');
      setNivelAmostra(n => Math.max(n - 25, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 1 — TUBO → CENTRÍFUGA ───────────────────────
    if (itemDrop === 'tubo' && alvo === 'centrifuga' && etapaAtual === 1) {
      setItemSegurado(null);
      setTuboNaCentrifuga(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 4 — PIPETA → TUBO (aspirar sobrenadante) ───
    if (itemDrop === 'pipeta' && alvo === 'tubo' && etapaAtual === 4 && tipIdx !== null && !pipetaCheia) {
      setItemSegurado(null);
      setCorPipeta('rgba(230,215,180,0.80)');
      setPipetaCheia(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 5 — PIPETA → FITA (aplicar gota) ───────────
    if (itemDrop === 'pipeta' && alvo === 'fita' && etapaAtual === 5 && pipetaCheia) {
      setItemSegurado(null);
      setNivelPipeta(0);
      setPipetaCheia(false);
      setGotaNaFita(true);
      setTimeout(() => {
        setFitaReagida(true);
        setGotaNaFita(false);
      }, 800);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 6 — FITA → LEITOR ───────────────────────────
    if (itemDrop === 'fita' && alvo === 'leitor' && etapaAtual === 6) {
      setItemSegurado(null);
      setFitaNoLeitor(true);
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
