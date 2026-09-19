import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragMosto — drag & drop para Acidez em Mosto.
 *
 * Drag steps: 0,1,2,3,4,5.
 * Clique (6, 7) e timer (7-pontofinal) tratados no componente.
 */
export const useSimuladorDragMosto = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // Fontes
  setNivelMosto,
  // Proveta
  setNivelProveta, setProvetaCheia,
  // Béquer 100 mL
  setNivelBequer, setCorBequer, setAmostraNoBequer,
  setPeixinhoNoBeq, setBequerNoAgi,
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

    // E0 — MOSTO → PROVETA (50 mL)
    if (itemDrop === 'mosto' && alvo === 'proveta' && etapaAtual === 0) {
      setItemSegurado(null);
      setNivelProveta(20); // 50mL em proveta 50mL = ~20% visual (escala 0-100)
      setProvetaCheia(true);
      setNivelMosto(n => Math.max(n - 22, 15));
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E1 — PROVETA → BÉQUER 100 mL (50 mL)
    if (itemDrop === 'proveta' && alvo === 'bequer' && etapaAtual === 1) {
      setItemSegurado(null);
      setAmostraNoBequer(true);
      setNivelBequer(55);
      setCorBequer('rgba(210,155,25,0.78)'); // mosto — âmbar dourado
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E2 — PEIXINHO → BÉQUER
    if (itemDrop === 'peixinho' && alvo === 'bequer' && etapaAtual === 2) {
      setItemSegurado(null);
      setPeixinhoNoBeq(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E3 — BÉQUER → AREA_TITULACAO (agitador)
    if (itemDrop === 'bequer' && alvo === 'area_titulacao' && etapaAtual === 3) {
      setItemSegurado(null);
      setBequerNoAgi(true);
      celebrarAcerto(); proximaEtapa();
      return;
    }

    // E4 — ELETRODO → AREA_TITULACAO
    if (itemDrop === 'eletrodo' && alvo === 'area_titulacao' && etapaAtual === 4) {
      setItemSegurado(null);
      setEletrodoImergido(true);
      celebrarAcerto(); proximaEtapa(); // → step 5
      return;
    }

    // E5 — NAOH → BURETA (auto-posiciona bureta)
    if (itemDrop === 'naoh' && alvo === 'bureta' && etapaAtual === 5) {
      setItemSegurado(null);
      setBuretaPreenchida(true);
      setNivelBureta(100);
      setBuretaPosicionada(true);
      const vEp = parseFloat((Math.random() * 5 + 3).toFixed(2)); // 3–8 mL
      setEndpointVolume(vEp);
      setNivelNaohFrasco(n => Math.max(n - 25, 15));
      celebrarAcerto(); proximaEtapa(); // → step 6 (ligar agitador)
      return;
    }
  };

  return {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isAlvo, isItem, dropCls, itemCls,
  };
};
