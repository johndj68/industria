import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragAcAlcoo — drag & drop para Acidez Total em Álcool Etílico.
 *
 * Etapas de clique (5, 11) e timers (6, 12) são tratadas no componente principal.
 */
export const useSimuladorDragAcAlcoo = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // Proveta
  setNivelProveta, setProvetaCheia,
  // Fontes
  setNivelAgua, setNivelAlcool,
  // Erlenmeyer
  setNivelErlenmeyer, setCorErlenmeyer,
  setAguaNoErl, setAlcoolNoErl,
  // Indicador (dispara timer de gotas)
  setAlfaNaftolGotas,
  // Bureta
  setNivelBureta,
  // Titulação
  setErlenmeyerNaTitulacao, setEndpointVolume,
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

    // ── ETAPA 0 — ÁGUA DEIONIZADA → PROVETA ──────────────
    if (itemDrop === 'agua' && alvo === 'proveta' && etapaAtual === 0) {
      setItemSegurado(null);
      setNivelProveta(50); // 50 mL marcados
      setProvetaCheia(true);
      setNivelAgua(n => Math.max(n - 28, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 1 — PROVETA → ERLENMEYER (água) ────────────
    if (itemDrop === 'proveta' && alvo === 'erlenmeyer' && etapaAtual === 1) {
      setItemSegurado(null);
      setNivelErlenmeyer(42);
      setCorErlenmeyer('rgba(195,225,248,0.52)'); // água clara
      setAguaNoErl(true);
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 2 — ALFA-NAFTOL → ERLENMEYER (dispara timer de gotas) ─
    if (itemDrop === 'alfanaftol' && alvo === 'erlenmeyer' && etapaAtual === 2) {
      setItemSegurado(null);
      setAlfaNaftolGotas(true); // timer no componente avança a etapa
      return;
    }

    // ── ETAPA 3 — NaOH → BURETA (carregar) ───────────────
    if (itemDrop === 'naoh' && alvo === 'bureta' && etapaAtual === 3) {
      setItemSegurado(null);
      setNivelBureta(100);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 4 — ERLENMEYER → ÁREA TITULAÇÃO (branco) ───
    if (itemDrop === 'erlenmeyer' && alvo === 'areaTitulacao' && etapaAtual === 4) {
      setItemSegurado(null);
      setErlenmeyerNaTitulacao(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 7 — ÁLCOOL HIDRATADO → PROVETA ─────────────
    if (itemDrop === 'alcool' && alvo === 'proveta' && etapaAtual === 7) {
      setItemSegurado(null);
      setNivelProveta(50);
      setProvetaCheia(true);
      setNivelAlcool(n => Math.max(n - 28, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 8 — PROVETA → ERLENMEYER (álcool, incolor) ─
    if (itemDrop === 'proveta' && alvo === 'erlenmeyer' && etapaAtual === 8) {
      setItemSegurado(null);
      setNivelErlenmeyer(78);
      setCorErlenmeyer('rgba(195,225,248,0.52)'); // azul some, fica incolor
      setAlcoolNoErl(true);
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 9 — NaOH → BURETA (recarregar) ─────────────
    if (itemDrop === 'naoh' && alvo === 'bureta' && etapaAtual === 9) {
      setItemSegurado(null);
      setNivelBureta(100);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 10 — ERLENMEYER → ÁREA TITULAÇÃO (amostra) ─
    if (itemDrop === 'erlenmeyer' && alvo === 'areaTitulacao' && etapaAtual === 10) {
      setItemSegurado(null);
      setErlenmeyerNaTitulacao(true);
      const vol = parseFloat((Math.random() * 4 + 0.8).toFixed(1)); // 0.8–4.8 mL
      setEndpointVolume(vol);
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
