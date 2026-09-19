import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragNaftol — drag & drop para Alfa Naftol (Açúcar em Águas).
 *
 * Etapas de clique (2, 4, 5) e timers (drops, acidoPour, step 6)
 * são tratados diretamente no componente Naftol.jsx.
 */
export const useSimuladorDragNaftol = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  setNivelAmostra,
  setNivelAlfaNaftol,
  setNivelAcido,
  setNivelTubo, setCorTubo,
  setAmostraNoTubo,
  setAlfaNaftolAdicionado,
  setAcidoPourando,
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
      mostrarErroAcao(`Este item não deve ser usado aqui neste momento.`);
      setItemSegurado(null);
      return;
    }

    // ── ETAPA 0 — AMOSTRA → TUBO ──────────────────────────────────
    if (itemDrop === 'amostra' && alvo === 'tubo' && etapaAtual === 0) {
      setItemSegurado(null);
      setAmostraNoTubo(true);
      setNivelTubo(50);
      setCorTubo('rgba(175,215,250,0.68)');
      setNivelAmostra(n => Math.max(n - 28, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 1 — ALFA NAFTOL → TUBO (3 gotas) ──────────────────
    if (itemDrop === 'alfaNaftol' && alvo === 'tubo' && etapaAtual === 1) {
      setItemSegurado(null);
      setAlfaNaftolAdicionado(true);
      // cor e nível atualizados via useEffect no componente (após animação drops)
      setNivelAlfaNaftol(n => Math.max(n - 14, 18));
      celebrarAcerto();
      proximaEtapa(); // → step 2 (agitar)
      return;
    }

    // ── ETAPA 3 — H₂SO₄ → TUBO (adição lenta) ──────────────────
    if (itemDrop === 'acido' && alvo === 'tubo' && etapaAtual === 3) {
      setItemSegurado(null);
      setAcidoPourando(true); // componente controla o timer/estado completo
      setNivelAcido(n => Math.max(n - 20, 12));
      return; // celebrarAcerto + proximaEtapa chamados no useEffect do componente
    }
  };

  return {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isAlvo, isItem, dropCls, itemCls,
  };
};
