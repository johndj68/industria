import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragSilicaBaixaMk — drag & drop para Sílica Baixa Faixa Kit Merck 114794.
 *
 * Drag steps: 2, 3, 4, 5, 6, 8, 9, 10, 12.
 * Clique (0, 1, 11, 13) e timer (7) tratados no componente.
 */
export const useSimuladorDragSilicaBaixaMk = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  setNivelAmostra, setNivelSB1, setNivelSB2, setNivelAguaDest,
  setNivelTubo, setCorTubo,
  setAmostraNoTubo, setSb1Adicionado, setSb2Adicionado,
  setTimerAtivo, setMicropipetaComAmostra,
  setMostrarGotas3, setGotasKey,
  setNivelCubeta, setCorCubeta,
  setNivelCubetaBranco, setCubetaBrancoPreparada,
  setCubetaNoSpectro, setEhBrancoNoSpectro,
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

  const handleDragEnd   = () => { setItemSegurado(null); encerrarOverlayDrag(); };
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

    // E2 — MICROPIPETA P1000 → AMOSTRA (aspirar 5,0 mL)
    if (itemDrop === 'micropipeta' && alvo === 'amostra' && etapaAtual === 2) {
      setItemSegurado(null);
      setMicropipetaComAmostra(true);
      setNivelAmostra(n => Math.max(n - 20, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E3 — MICROPIPETA P1000 → TUBO (dispensar 5,0 mL)
    if (itemDrop === 'micropipeta' && alvo === 'tubo_reacao' && etapaAtual === 3) {
      setItemSegurado(null);
      setMicropipetaComAmostra(false);
      setAmostraNoTubo(true);
      setNivelTubo(45);
      setCorTubo('rgba(185,215,250,0.65)');
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E4 — SB1 → TUBO (3 gotas)
    if (itemDrop === 'reagente_sb1' && alvo === 'tubo_reacao' && etapaAtual === 4) {
      setItemSegurado(null);
      setSb1Adicionado(true);
      setGotasKey(k => k + 1);
      setMostrarGotas3(true);
      setNivelTubo(49);
      setCorTubo('rgba(210,215,155,0.68)');
      setNivelSB1(n => Math.max(n - 10, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E5 — MICROPIPETA P1000 → SB2 (aspirar 0,50 mL)
    if (itemDrop === 'micropipeta' && alvo === 'reagente_sb2' && etapaAtual === 5) {
      setItemSegurado(null);
      setMicropipetaComAmostra(true);
      setNivelSB2(n => Math.max(n - 8, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E6 — MICROPIPETA P1000 → TUBO (dispensar SB2, 0,50 mL)
    if (itemDrop === 'micropipeta' && alvo === 'tubo_reacao' && etapaAtual === 6) {
      setItemSegurado(null);
      setMicropipetaComAmostra(false);
      setSb2Adicionado(true);
      setNivelTubo(54);
      setCorTubo('rgba(200,205,120,0.72)');
      setTimerAtivo(true);
      celebrarAcerto(); proximaEtapa(); // → step 7 (timer automático)
      return;
    }

    // E8 — TUBO → CUBETA (transferir amostra reagida)
    if (itemDrop === 'tubo_reacao' && alvo === 'cubeta' && etapaAtual === 8) {
      setItemSegurado(null);
      setNivelCubeta(72);
      setCorCubeta('rgba(45,90,200,0.88)');
      setNivelTubo(0);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E9 — ÁGUA DEST → CUBETA BRANCO
    if (itemDrop === 'agua_dest' && alvo === 'cubeta_branco' && etapaAtual === 9) {
      setItemSegurado(null);
      setNivelCubetaBranco(72);
      setCubetaBrancoPreparada(true);
      setNivelAguaDest(n => Math.max(n - 15, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E10 — CUBETA BRANCO → SPECTRO
    if (itemDrop === 'cubeta_branco' && alvo === 'spectro' && etapaAtual === 10) {
      setItemSegurado(null);
      setCubetaNoSpectro(true);
      setEhBrancoNoSpectro(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E12 — CUBETA AMOSTRA → SPECTRO
    if (itemDrop === 'cubeta' && alvo === 'spectro' && etapaAtual === 12) {
      setItemSegurado(null);
      setCubetaNoSpectro(true);
      setEhBrancoNoSpectro(false);
      celebrarAcerto(); proximaEtapa();
      return;
    }
  };

  return {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isAlvo, isItem, dropCls, itemCls,
  };
};
