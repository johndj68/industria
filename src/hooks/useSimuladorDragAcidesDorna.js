import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragAcidesDorna — 15 passos · Acidez Sulfúrica — Cubas e Dornas.
 *
 * Drag steps: 0,1,2,3,4,6,7,8,9,10,11,12.
 * Clique (5, 13, 14) e timers (5-auto, 14-pontofinal) tratados no componente.
 */
export const useSimuladorDragAcidesDorna = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // Fontes
  setNivelVinho,
  // Proveta
  setNivelProveta, setProvetaCheia, setProvetaCom50,
  // Kitassato
  setNivelKitassato, setVinhoNoKitassato,
  setPeixinhoANoKit, setKitassatoNoAgi, setMangueiraConectada,
  // Béquer 100 mL
  setNivelBequer, setCorBequer, setAmostraNoBequer,
  setPeixinhoBNoBeq, setBequerNoAgi,
  // Eletrodo / bureta
  setEletrodoImergido,
  setNivelBureta, setBuretaPreenchida, setEndpointVolume,
  setBuretaPosicionada,
  setNivelNaohFrasco,
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

    // E0 — VINHO → PROVETA
    if (itemDrop === 'vinho' && alvo === 'proveta' && etapaAtual === 0) {
      setItemSegurado(null);
      setNivelProveta(100); setProvetaCheia(true);
      setNivelVinho(n => Math.max(n - 35, 12));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E1 — PROVETA → KITASSATO (~100 mL)
    if (itemDrop === 'proveta' && alvo === 'kitassato' && etapaAtual === 1) {
      setItemSegurado(null);
      setVinhoNoKitassato(true); setNivelKitassato(72);
      setNivelProveta(0); setProvetaCheia(false);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E2 — PEIXINHO A → KITASSATO
    if (itemDrop === 'peixinho_a' && alvo === 'kitassato' && etapaAtual === 2) {
      setItemSegurado(null);
      setPeixinhoANoKit(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E3 — KITASSATO → AGITADOR
    if (itemDrop === 'kitassato' && alvo === 'area_titulacao' && etapaAtual === 3) {
      setItemSegurado(null);
      setKitassatoNoAgi(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E4 — MANGUEIRA → AGITADOR (kitassato já está no agitador, conectar mangueira)
    if (itemDrop === 'mangueira' && alvo === 'area_titulacao' && etapaAtual === 4) {
      setItemSegurado(null);
      setMangueiraConectada(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E6 — KITASSATO → PROVETA (pipetar 50 mL)
    if (itemDrop === 'kitassato' && alvo === 'proveta' && etapaAtual === 6) {
      setItemSegurado(null);
      setNivelProveta(50); setProvetaCom50(true); setProvetaCheia(true);
      setNivelKitassato(n => Math.max(n - 28, 15)); // kitassato perde 50mL
      setKitassatoNoAgi(false);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E7 — PROVETA → BÉQUER 100 mL (50 mL)
    if (itemDrop === 'proveta' && alvo === 'bequer' && etapaAtual === 7) {
      setItemSegurado(null);
      setAmostraNoBequer(true); setNivelBequer(55);
      setCorBequer('rgba(140,45,20,0.70)');
      setNivelProveta(0); setProvetaCheia(false); setProvetaCom50(false);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E8 — PEIXINHO B → BÉQUER
    if (itemDrop === 'peixinho_b' && alvo === 'bequer' && etapaAtual === 8) {
      setItemSegurado(null);
      setPeixinhoBNoBeq(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E9 — BÉQUER → AGITADOR
    if (itemDrop === 'bequer' && alvo === 'area_titulacao' && etapaAtual === 9) {
      setItemSegurado(null);
      setBequerNoAgi(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E10 — ELETRODO → AGITADOR (béquer já está no agitador, imergir eletrodo)
    if (itemDrop === 'eletrodo' && alvo === 'area_titulacao' && etapaAtual === 10) {
      setItemSegurado(null);
      setEletrodoImergido(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E11 — NAOH → BURETA (auto-posiciona bureta acima do béquer)
    if (itemDrop === 'naoh' && alvo === 'bureta' && etapaAtual === 11) {
      setItemSegurado(null);
      setBuretaPreenchida(true); setNivelBureta(100);
      setBuretaPosicionada(true); // posicionamento automático
      const vEp = parseFloat((Math.random() * 5 + 3).toFixed(2)); // 3–8 mL
      setEndpointVolume(vEp);
      setNivelNaohFrasco(n => Math.max(n - 25, 15));
      celebrarAcerto(); proximaEtapa(); // → step 12 (ligar agitador)
      return;
    }
  };

  return {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isAlvo, isItem, dropCls, itemCls,
  };
};
