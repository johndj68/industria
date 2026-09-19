import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragArtAguas — drag & drop para ART em Águas — Método Antrona.
 *
 * Drag steps: 0,1,3,4,5,6,7,8,9,10,11,13,14,17,18,20,21.
 * Clique (2,12,15,19,22) e timers (16,23) tratados no componente.
 */
export const useSimuladorDragArtAguas = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // Fontes
  setNivelAmostra, setNivelAguaDesmin, setNivelAntrona,
  // Béquer A
  setNivelBequerA, setCorBequerA, setAmostraNoBequerA, setCeliteAdicionada,
  // Béquer B
  setFunilNoBqB, setPapelFiltroNoBqB, setFiltracaoAtiva,
  // Proveta
  setNivelProveta, setProvetaCheia, setProvetaComFiltrado,
  // Tubo Amostra
  setNivelTuboAmostra, setCorTuboAmostra, setFiltradoNoTuboA, setAntronaNaAmostra,
  // Tubo Branco
  setNivelTuboBranco, setCorTuboBranco, setBrancoNoTubo, setAntronaNoBranco,
  // Banho-maria
  setTuboBrancoNoBanho, setTuboAmostraNoBanho,
  // Cubeta
  setNivelCubeta, setCorCubeta,
  // Espectrofotômetro
  setCubetaNoEspectro, setEhBrancoNoEspectro,
  // Cor pós-aquecimento (closures que leem estado atual)
  getCorTuboAmostraAtual, getCorTuboBrancoAtual,
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

    // E0 — AMOSTRA → BÉQUER A
    if (itemDrop === 'amostra' && alvo === 'bequer_a' && etapaAtual === 0) {
      setItemSegurado(null);
      setAmostraNoBequerA(true);
      setNivelBequerA(65);
      setCorBequerA('rgba(155,200,235,0.72)');
      setNivelAmostra(n => Math.max(n - 30, 12));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E1 — CELITE → BÉQUER A
    if (itemDrop === 'celite' && alvo === 'bequer_a' && etapaAtual === 1) {
      setItemSegurado(null);
      setCeliteAdicionada(true);
      setNivelBequerA(68);
      setCorBequerA('rgba(185,198,210,0.82)');
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E3 — FUNIL → BÉQUER B
    if (itemDrop === 'funil' && alvo === 'bequer_b' && etapaAtual === 3) {
      setItemSegurado(null);
      setFunilNoBqB(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E4 — PAPEL FILTRO → BÉQUER B
    if (itemDrop === 'papel_filtro' && alvo === 'bequer_b' && etapaAtual === 4) {
      setItemSegurado(null);
      setPapelFiltroNoBqB(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E5 — BÉQUER A → BÉQUER B (filtração — timer no componente)
    if (itemDrop === 'bequer_a' && alvo === 'bequer_b' && etapaAtual === 5) {
      setItemSegurado(null);
      setFiltracaoAtiva(true); // componente cuida do timer + advance
      return;
    }

    // E6 — BÉQUER B → PROVETA (2 mL filtrado)
    if (itemDrop === 'bequer_b' && alvo === 'proveta' && etapaAtual === 6) {
      setItemSegurado(null);
      setNivelProveta(20);
      setProvetaCheia(true);
      setProvetaComFiltrado(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E7 — PROVETA → TUBO AMOSTRA
    if (itemDrop === 'proveta' && alvo === 'tubo_amostra' && etapaAtual === 7) {
      setItemSegurado(null);
      setFiltradoNoTuboA(true);
      setNivelTuboAmostra(20);
      setCorTuboAmostra('rgba(172,212,238,0.70)');
      setNivelProveta(0);
      setProvetaCheia(false);
      setProvetaComFiltrado(false);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E8 — ÁGUA DESMIN → PROVETA (2 mL branco)
    if (itemDrop === 'agua_desmin' && alvo === 'proveta' && etapaAtual === 8) {
      setItemSegurado(null);
      setNivelProveta(20);
      setProvetaCheia(true);
      setProvetaComFiltrado(false);
      setNivelAguaDesmin(n => Math.max(n - 15, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E9 — PROVETA → TUBO BRANCO
    if (itemDrop === 'proveta' && alvo === 'tubo_branco' && etapaAtual === 9) {
      setItemSegurado(null);
      setBrancoNoTubo(true);
      setNivelTuboBranco(20);
      setCorTuboBranco('rgba(200,230,255,0.65)');
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E10 — ANTRONA → TUBO AMOSTRA
    if (itemDrop === 'antrona' && alvo === 'tubo_amostra' && etapaAtual === 10) {
      setItemSegurado(null);
      setAntronaNaAmostra(true);
      setNivelTuboAmostra(82);
      setCorTuboAmostra('rgba(200,195,238,0.72)');
      setNivelAntrona(n => Math.max(n - 22, 12));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E11 — ANTRONA → TUBO BRANCO
    if (itemDrop === 'antrona' && alvo === 'tubo_branco' && etapaAtual === 11) {
      setItemSegurado(null);
      setAntronaNoBranco(true);
      setNivelTuboBranco(82);
      setCorTuboBranco('rgba(210,225,240,0.68)');
      setNivelAntrona(n => Math.max(n - 22, 12));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E13 — TUBO BRANCO → BANHO-MARIA
    if (itemDrop === 'tubo_branco' && alvo === 'banho_maria' && etapaAtual === 13) {
      setItemSegurado(null);
      setTuboBrancoNoBanho(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E14 — TUBO AMOSTRA → BANHO-MARIA
    if (itemDrop === 'tubo_amostra' && alvo === 'banho_maria' && etapaAtual === 14) {
      setItemSegurado(null);
      setTuboAmostraNoBanho(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E17 — TUBO BRANCO → CUBETA
    if (itemDrop === 'tubo_branco' && alvo === 'cubeta' && etapaAtual === 17) {
      setItemSegurado(null);
      setNivelCubeta(72);
      setCorCubeta(getCorTuboBrancoAtual());
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E18 / E21 — CUBETA → ESPECTROFOTÔMETRO
    if (itemDrop === 'cubeta' && alvo === 'espectrofotometro'
      && (etapaAtual === 18 || etapaAtual === 21)) {
      setItemSegurado(null);
      setCubetaNoEspectro(true);
      setEhBrancoNoEspectro(etapaAtual === 18);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E20 — TUBO AMOSTRA → CUBETA
    if (itemDrop === 'tubo_amostra' && alvo === 'cubeta' && etapaAtual === 20) {
      setItemSegurado(null);
      setNivelCubeta(72);
      setCorCubeta(getCorTuboAmostraAtual());
      celebrarAcerto(); proximaEtapa();
      return;
    }
  };

  return {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isAlvo, isItem, dropCls, itemCls,
  };
};
