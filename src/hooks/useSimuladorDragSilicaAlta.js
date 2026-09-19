import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragSilicaAlta — drag & drop para Sílica Alto Teor.
 *
 * Etapas de clique (8, 11, 15, 18, 21) e timers (12, 22) tratados no componente.
 */
export const useSimuladorDragSilicaAlta = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // Proveta
  setNivelProveta, setProvetaCheia,
  // Fontes
  setNivelAmostra, setNivelAgua,
  setNivelHcl, setNivelOxalico, setNivelMolibdato, setNivelSulfito,
  // Béquer Branco
  setNivelBranco, setCorBranco,
  setBrancoPrep, setHclBranco, setOxalicoBranco, setMolibdatoBranco, setSulfitoBranco,
  // Béquer Amostra
  setNivelAmostraBq, setCorAmostraBq,
  setAmostraBqPrep, setHclAmostra, setOxalicoAmostra, setMolibdatoAmostra, setSulfitoAmostra,
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
      mostrarErroAcao(`Este item não deve ser usado aqui neste momento.`);
      setItemSegurado(null);
      return;
    }

    // ── E0 — AMOSTRA → PROVETA ──────────────────────────────────────────
    if (itemDrop === 'amostra' && alvo === 'proveta' && etapaAtual === 0) {
      setItemSegurado(null);
      setNivelProveta(20); // 10 mL em proveta 50 mL = 20%
      setProvetaCheia(true);
      setNivelAmostra(n => Math.max(n - 20, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E1 — PROVETA → BÉQUER AMOSTRA ───────────────────────────────────
    if (itemDrop === 'proveta' && alvo === 'bequer_amostra' && etapaAtual === 1) {
      setItemSegurado(null);
      setNivelAmostraBq(25);
      setCorAmostraBq('rgba(175,215,250,0.65)');
      setAmostraBqPrep(true);
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E2 — ÁGUA → PROVETA ─────────────────────────────────────────────
    if (itemDrop === 'agua' && alvo === 'proveta' && etapaAtual === 2) {
      setItemSegurado(null);
      setNivelProveta(20);
      setProvetaCheia(true);
      setNivelAgua(n => Math.max(n - 20, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E3 — PROVETA → BÉQUER BRANCO ────────────────────────────────────
    if (itemDrop === 'proveta' && alvo === 'bequer_branco' && etapaAtual === 3) {
      setItemSegurado(null);
      setNivelBranco(25);
      setCorBranco('rgba(190,220,255,0.60)');
      setBrancoPrep(true);
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E4 — HCl → BÉQUER BRANCO (5 mL) ────────────────────────────────
    if (itemDrop === 'hcl' && alvo === 'bequer_branco' && etapaAtual === 4) {
      setItemSegurado(null);
      setNivelBranco(35);
      setCorBranco('rgba(195,222,255,0.62)');
      setHclBranco(true);
      setNivelHcl(n => Math.max(n - 18, 12));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E5 — HCl → BÉQUER AMOSTRA (5 mL) ───────────────────────────────
    if (itemDrop === 'hcl' && alvo === 'bequer_amostra' && etapaAtual === 5) {
      setItemSegurado(null);
      setNivelAmostraBq(35);
      setCorAmostraBq('rgba(180,217,250,0.66)');
      setHclAmostra(true);
      setNivelHcl(n => Math.max(n - 18, 12));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E6 — OXÁLICO → BÉQUER BRANCO (1 mL) ────────────────────────────
    if (itemDrop === 'oxalico' && alvo === 'bequer_branco' && etapaAtual === 6) {
      setItemSegurado(null);
      setNivelBranco(37);
      setCorBranco('rgba(196,223,255,0.63)');
      setOxalicoBranco(true);
      setNivelOxalico(n => Math.max(n - 8, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E7 — OXÁLICO → BÉQUER AMOSTRA (1 mL) ───────────────────────────
    if (itemDrop === 'oxalico' && alvo === 'bequer_amostra' && etapaAtual === 7) {
      setItemSegurado(null);
      setNivelAmostraBq(37);
      setCorAmostraBq('rgba(182,218,250,0.67)');
      setOxalicoAmostra(true);
      setNivelOxalico(n => Math.max(n - 8, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E9 — MOLIBDATO → BÉQUER BRANCO (5 mL) ──────────────────────────
    if (itemDrop === 'molibdato' && alvo === 'bequer_branco' && etapaAtual === 9) {
      setItemSegurado(null);
      setNivelBranco(48);
      setCorBranco('rgba(235,235,195,0.68)'); // leve amarelado
      setMolibdatoBranco(true);
      setNivelMolibdato(n => Math.max(n - 18, 12));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E10 — MOLIBDATO → BÉQUER AMOSTRA (5 mL) ────────────────────────
    if (itemDrop === 'molibdato' && alvo === 'bequer_amostra' && etapaAtual === 10) {
      setItemSegurado(null);
      setNivelAmostraBq(48);
      setCorAmostraBq('rgba(225,215,140,0.78)'); // amarelo silicomolibdato
      setMolibdatoAmostra(true);
      setNivelMolibdato(n => Math.max(n - 18, 12));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E13 — SULFITO → BÉQUER BRANCO (10 mL) ──────────────────────────
    if (itemDrop === 'sulfito' && alvo === 'bequer_branco' && etapaAtual === 13) {
      setItemSegurado(null);
      setNivelBranco(62);
      setCorBranco('rgba(218,232,218,0.72)'); // quase claro, levemente verde
      setSulfitoBranco(true);
      setNivelSulfito(n => Math.max(n - 22, 12));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E14 — SULFITO → BÉQUER AMOSTRA (10 mL) — reação azul ───────────
    if (itemDrop === 'sulfito' && alvo === 'bequer_amostra' && etapaAtual === 14) {
      setItemSegurado(null);
      setNivelAmostraBq(62);
      setCorAmostraBq('rgba(48,132,210,0.85)'); // azul heteropolimolibdato reduzido
      setSulfitoAmostra(true);
      setNivelSulfito(n => Math.max(n - 22, 12));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E16 — BÉQUER BRANCO → CUBETA (transfere branco) ─────────────────
    if (itemDrop === 'bequer_branco' && alvo === 'cubeta' && etapaAtual === 16) {
      setItemSegurado(null);
      setNivelCubeta(72);
      setCorCubeta('rgba(218,232,218,0.75)');
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E17 — CUBETA → FOTÔMETRO (branco) ───────────────────────────────
    if (itemDrop === 'cubeta' && alvo === 'fotometro' && etapaAtual === 17) {
      setItemSegurado(null);
      setCubetaNoFotometro(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E19 — BÉQUER AMOSTRA → CUBETA (transfere amostra) ───────────────
    if (itemDrop === 'bequer_amostra' && alvo === 'cubeta' && etapaAtual === 19) {
      setItemSegurado(null);
      setNivelCubeta(72);
      setCorCubeta('rgba(48,132,210,0.88)');
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ── E20 — CUBETA → FOTÔMETRO (amostra) ──────────────────────────────
    if (itemDrop === 'cubeta' && alvo === 'fotometro' && etapaAtual === 20) {
      setItemSegurado(null);
      setCubetaNoFotometro(true);
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
