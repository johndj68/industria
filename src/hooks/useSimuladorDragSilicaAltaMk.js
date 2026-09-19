import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragSilicaAltaMk — drag & drop para Sílica Alta Faixa Kit Merck 100857.
 *
 * Drag steps: 2, 3, 4, 6, 7, 8, 9, 10, 12.
 * Clique (0, 1, 5, 11, 13) tratados no componente.
 * Timers (Reação 1 + Reação 2) disparam após E7 e rodam enquanto step=8 bloqueia tuboDraggable.
 */
export const useSimuladorDragSilicaAltaMk = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  setNivelAmostra, setNivelSI1, setNivelSI2, setNivelAguaDest,
  setNivelProveta, setAmostraNoProveta,
  setNivelTubo, setCorTubo,
  setAmostraNoTubo, setSi1Adicionado, setSi2Adicionado,
  setTimer1Ativo,
  setMostrarGotasSi1, setGotasKey,
  setMicropipetaComSI2,
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

    // E2 — AMOSTRA → PROVETA (coletar 4,0 mL)
    if (itemDrop === 'amostra' && alvo === 'proveta' && etapaAtual === 2) {
      setItemSegurado(null);
      setNivelProveta(40); // 4,0 mL num cilindro de 10 mL → 40%
      setAmostraNoProveta(true);
      setNivelAmostra(n => Math.max(n - 18, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E3 — PROVETA → TUBO_REACAO (transferir 4,0 mL)
    if (itemDrop === 'proveta' && alvo === 'tubo_reacao' && etapaAtual === 3) {
      setItemSegurado(null);
      setAmostraNoTubo(true);
      setNivelTubo(38);
      setCorTubo('rgba(185,215,250,0.65)');
      setAmostraNoProveta(false);
      setNivelProveta(0);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E4 — SI-1 → TUBO (4 gotas)
    if (itemDrop === 'reagente_si1' && alvo === 'tubo_reacao' && etapaAtual === 4) {
      setItemSegurado(null);
      setSi1Adicionado(true);
      setGotasKey(k => k + 1);
      setMostrarGotasSi1(true);
      setNivelTubo(42);
      setCorTubo('rgba(215,218,145,0.68)');
      setNivelSI1(n => Math.max(n - 10, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E5 — CLICK PONTEIRA (handled in component)

    // E6 — MICROPIPETA → SI-2 (aspirar 2,0 mL)
    if (itemDrop === 'micropipeta' && alvo === 'reagente_si2' && etapaAtual === 6) {
      setItemSegurado(null);
      setMicropipetaComSI2(true);
      setNivelSI2(n => Math.max(n - 18, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E7 — MICROPIPETA → TUBO (dispensar Si-2; timers iniciam automaticamente)
    if (itemDrop === 'micropipeta' && alvo === 'tubo_reacao' && etapaAtual === 7) {
      setItemSegurado(null);
      setSi2Adicionado(true);
      setNivelTubo(58);
      setCorTubo('rgba(200,195,110,0.72)');
      setMicropipetaComSI2(false);
      setTimer1Ativo(true);
      celebrarAcerto();
      proximaEtapa(); // → step 8; tuboDraggable bloqueado por timerAtivo
      return;
    }

    // E8 — TUBO → CUBETA (só após timers concluídos)
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
