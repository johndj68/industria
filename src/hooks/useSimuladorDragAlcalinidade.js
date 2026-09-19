import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

export const useSimuladorDragAlcalinidade = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  setNivelProveta, setProvetaCheia,
  setNivelAmostra,
  setNivelErlenmeyer, setCorErlenmeyer,
  setErlenmeyerPrep, setIndicadorAdicionado,
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

    // ETAPA 1 — PROVETA → ERLENMEYER (transferir 50 mL)
    if (itemDrop === 'proveta' && alvo === 'erlenmeyer' && etapaAtual === 1) {
      setItemSegurado(null);
      setNivelErlenmeyer(42);
      setCorErlenmeyer('rgba(140,205,245,0.58)');
      setErlenmeyerPrep(true);
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ETAPA 2 — ALARANJADO → ERLENMEYER (adicionar indicador)
    if (itemDrop === 'alaranjado' && alvo === 'erlenmeyer' && etapaAtual === 2) {
      setItemSegurado(null);
      setCorErlenmeyer('rgba(232,108,12,0.80)');
      setIndicadorAdicionado(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ETAPA 3 — ÁCIDO SULFÚRICO → BURETA (preencher bureta)
    if (itemDrop === 'acido' && alvo === 'bureta' && etapaAtual === 3) {
      setItemSegurado(null);
      setNivelBureta(100);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ETAPA 4 — ERLENMEYER → ÁREA DE TITULAÇÃO
    if (itemDrop === 'erlenmeyer' && alvo === 'areaTitulacao' && etapaAtual === 4) {
      setItemSegurado(null);
      setErlenmeyerNaTitulacao(true);
      // Gera endpoint aleatório: 1,0–8,0 mL (100–800 ppm com 0,1 N)
      const vol = parseFloat((Math.random() * 7 + 1).toFixed(1));
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
