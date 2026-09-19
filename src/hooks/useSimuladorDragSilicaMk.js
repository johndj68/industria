import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragSilicaMk — drag & drop para Silicato Kit Merck 100857.
 *
 * Drag steps: 1,2,3,4,6,8,9,10,12.
 * Clique (0,11,13) e timers (5,7) tratados no componente.
 */
export const useSimuladorDragSilicaMk = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // Fontes
  setNivelAmostra, setNivelR1, setNivelR2, setNivelR3, setNivelR4, setNivelAguaDest,
  // Tubo de reação
  setNivelTubo, setCorTubo,
  setAmostraNoTubo, setR1Adicionado, setR2Adicionado, setR3Adicionado, setR4Adicionado,
  // Timer triggers
  setTimer1Ativo, setTimer2Ativo,
  // Gotas animation
  setMostrarGotas2, setMostrarGotas4, setGotasKey,
  // Cubeta amostra
  setNivelCubeta, setCorCubeta,
  // Cubeta branco
  setNivelCubetaBranco, setCubetaBrancoPreparada,
  // Spectro
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

    // E1 — AMOSTRA → TUBO (5,0 mL)
    if (itemDrop === 'amostra' && alvo === 'tubo_reacao' && etapaAtual === 1) {
      setItemSegurado(null);
      setAmostraNoTubo(true);
      setNivelTubo(45);
      setCorTubo('rgba(185,215,250,0.65)');
      setNivelAmostra(n => Math.max(n - 20, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E2 — REAGENTE 1 → TUBO (0,5 mL)
    if (itemDrop === 'reagente1' && alvo === 'tubo_reacao' && etapaAtual === 2) {
      setItemSegurado(null);
      setR1Adicionado(true);
      setNivelTubo(49);
      setCorTubo('rgba(240,235,115,0.62)');
      setNivelR1(n => Math.max(n - 10, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E3 — REAGENTE 2 → TUBO (4 gotas) — timer de gotas no componente
    if (itemDrop === 'reagente2' && alvo === 'tubo_reacao' && etapaAtual === 3) {
      setItemSegurado(null);
      setR2Adicionado(true);
      setGotasKey(k => k + 1);
      setMostrarGotas2(true);
      setNivelTubo(52);
      setCorTubo('rgba(235,225,85,0.68)');
      setNivelR2(n => Math.max(n - 8, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E4 — REAGENTE 3 → TUBO (2,0 mL)
    if (itemDrop === 'reagente3' && alvo === 'tubo_reacao' && etapaAtual === 4) {
      setItemSegurado(null);
      setR3Adicionado(true);
      setNivelTubo(58);
      setCorTubo('rgba(215,195,65,0.75)');
      setNivelR3(n => Math.max(n - 18, 15));
      // Inicia timer 1 via componente
      setTimer1Ativo(true);
      celebrarAcerto(); proximaEtapa(); // → step 5 (timer)
      return;
    }

    // E6 — REAGENTE 4 → TUBO (4 gotas — reagente redutor)
    if (itemDrop === 'reagente4' && alvo === 'tubo_reacao' && etapaAtual === 6) {
      setItemSegurado(null);
      setR4Adicionado(true);
      setGotasKey(k => k + 1);
      setMostrarGotas4(true);
      setNivelTubo(62);
      setCorTubo('rgba(75,115,205,0.80)');
      setNivelR4(n => Math.max(n - 8, 15));
      setTimer2Ativo(true);
      celebrarAcerto(); proximaEtapa(); // → step 7 (timer)
      return;
    }

    // E8 — TUBO DE REAÇÃO → CUBETA (transferir amostra reagida)
    if (itemDrop === 'tubo_reacao' && alvo === 'cubeta' && etapaAtual === 8) {
      setItemSegurado(null);
      setNivelCubeta(72);
      setCorCubeta('rgba(45,90,200,0.88)'); // azul molibdênio
      setNivelTubo(0);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E9 — ÁGUA DESTILADA → CUBETA BRANCO
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
