import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

export const useSimuladorDragGlCo2 = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  setNivelAmostra, setNivelProveta, setProvetaCheia,
  setAmostraNoMicro, setBalaoAcoplado, setBalaoNoDensimetro,
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

  const handleDragEnd = () => {
    setItemSegurado(null);
    encerrarOverlayDrag();
  };

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

    // ETAPA 0 — AMOSTRA → PROVETA (medir 50 mL)
    if (itemDrop === 'amostra' && alvo === 'proveta' && etapaAtual === 0) {
      setItemSegurado(null);
      setNivelProveta(100);
      setProvetaCheia(true);
      setNivelAmostra(n => Math.max(n - 30, 15));
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ETAPA 2 — PROVETA → MICRODESTILADOR (transferir amostra)
    if (itemDrop === 'proveta' && alvo === 'microdestilador' && etapaAtual === 2) {
      setItemSegurado(null);
      setNivelProveta(0);
      setProvetaCheia(false);
      setAmostraNoMicro(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ETAPA 3 — BALÃO → MICRODESTILADOR (acoplar condensador)
    if (itemDrop === 'balao' && alvo === 'microdestilador' && etapaAtual === 3) {
      setItemSegurado(null);
      setBalaoAcoplado(true);
      celebrarAcerto();
      proximaEtapa(); // etapa 4: destilação (timer)
      return;
    }

    // ETAPA 5 — BALÃO → DENSÍMETRO
    if (itemDrop === 'balao' && alvo === 'densimetro' && etapaAtual === 5) {
      setItemSegurado(null);
      setBalaoNoDensimetro(true);
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
