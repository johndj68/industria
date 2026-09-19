import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragCloreto — drag & drop para Determinação de Cloretos.
 * Etapas de clique (8) e auto-timer (9) tratadas no componente principal.
 */
export const useSimuladorDragCloreto = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // Proveta
  setNivelProveta, setProvetaCheia,
  // Frascos fonte
  setNivelAmostra, setNivelAgua,
  // Erlenmeyer Branco
  setNivelErlBranco, setCorErlBranco, setBrancoPreparado,
  // Erlenmeyer Amostra
  setNivelErlAmostra, setCorErlAmostra, setErlAmostraPrep,
  // Indicadores / reagentes
  setFenolGotas,         // dispara timer para avançar etapa
  setCromatoAdicionado, setVibrarKey,
  // Titulação
  setErlenmeyerNaTitulacao, setEndpointVolume,
  setNivelBureta,
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

    // ── ETAPA 0 — AMOSTRA → PROVETA ──────────────────────
    if (itemDrop === 'amostra' && alvo === 'proveta' && etapaAtual === 0) {
      setItemSegurado(null);
      setNivelProveta(100);
      setProvetaCheia(true);
      setNivelAmostra(n => Math.max(n - 30, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 1 — PROVETA → ERLENMEYER BRANCO ────────────
    if (itemDrop === 'proveta' && alvo === 'erlenmeyer_branco' && etapaAtual === 1) {
      setItemSegurado(null);
      setNivelErlBranco(42);
      setCorErlBranco('rgba(190,225,245,0.52)');
      setBrancoPreparado(true);
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 2 — ÁGUA → PROVETA ─────────────────────────
    if (itemDrop === 'agua' && alvo === 'proveta' && etapaAtual === 2) {
      setItemSegurado(null);
      setNivelProveta(100);
      setProvetaCheia(true);
      setNivelAgua(n => Math.max(n - 25, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 3 — PROVETA → ERLENMEYER AMOSTRA ───────────
    if (itemDrop === 'proveta' && alvo === 'erlenmeyer_amostra' && etapaAtual === 3) {
      setItemSegurado(null);
      setNivelErlAmostra(42);
      setCorErlAmostra('rgba(190,225,245,0.52)');
      setErlAmostraPrep(true);
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 4 — FENOLFTALEÍNA → ERLENMEYER AMOSTRA (gotas, timer) ─
    if (itemDrop === 'fenol' && alvo === 'erlenmeyer_amostra' && etapaAtual === 4) {
      setItemSegurado(null);
      setFenolGotas(true); // timer no componente avança a etapa
      return;
    }

    // ── ETAPA 5 — CROMATO → ERLENMEYER AMOSTRA (amarelo vivo) ──
    if (itemDrop === 'cromato' && alvo === 'erlenmeyer_amostra' && etapaAtual === 5) {
      setItemSegurado(null);
      setCorErlAmostra('rgba(255,215,0,0.85)');  // amarelo vivo
      setCromatoAdicionado(true);
      setVibrarKey(k => k + 1);                  // dispara animação de homogeneização
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 6 — NITRATO DE PRATA → BURETA ──────────────
    if (itemDrop === 'nitrato' && alvo === 'bureta' && etapaAtual === 6) {
      setItemSegurado(null);
      setNivelBureta(100);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── ETAPA 7 — ERLENMEYER AMOSTRA → ÁREA TITULAÇÃO ────
    if (itemDrop === 'erlenmeyer_amostra' && alvo === 'areaTitulacao' && etapaAtual === 7) {
      setItemSegurado(null);
      setErlenmeyerNaTitulacao(true);
      const vol = parseFloat((Math.random() * 7 + 1.5).toFixed(1));
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
