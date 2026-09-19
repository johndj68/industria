import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragPhAlcool — drag & drop para Determinação de pH em Álcool.
 *
 * Drag steps: 0 (amostra→bequer), 2 (eletrodo→bequer).
 * Clique (1, 4) e timers (3, 5) tratados no componente.
 */
export const useSimuladorDragPhAlcool = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  setNivelAmostra,
  setNivelBequer, setCorBequer, setAmostraNoBequer,
  setEletrodoImergido, setEstabilizando,
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

    // E0 — AMOSTRA DE ÁLCOOL → BÉQUER 50 mL
    if (itemDrop === 'amostra' && alvo === 'bequer' && etapaAtual === 0) {
      setItemSegurado(null);
      setAmostraNoBequer(true);
      setNivelBequer(60);
      setCorBequer('rgba(240,230,180,0.72)'); // álcool — levemente amarelado
      setNivelAmostra(n => Math.max(n - 30, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // E2 — ELETRODO → BÉQUER (imergir bulbo de vidro)
    if (itemDrop === 'eletrodo' && alvo === 'bequer' && etapaAtual === 2) {
      setItemSegurado(null);
      setEletrodoImergido(true);
      setEstabilizando(true);
      celebrarAcerto();
      proximaEtapa(); // → step 3 (auto stabilization)
      return;
    }
  };

  return {
    handleDragStart, handleDragEnd, handleDragOver, handleDragEnter, handleDrop,
    isAlvo, isItem, dropCls, itemCls,
  };
};
