import { iniciarOverlayDrag, encerrarOverlayDrag, IMAGEM_DRAG_VAZIA } from '../utils/drag';

/**
 * useSimuladorDragDureza — drag & drop para Determinação de Dureza Total.
 * Etapas de clique (7) e auto-timer (8) são tratadas no componente principal.
 */
export const useSimuladorDragDureza = (etapas, {
  etapaAtual, itemSegurado, setItemSegurado,
  celebrarAcerto, mostrarErroAcao, proximaEtapa,
  // Proveta
  setNivelProveta, setProvetaCheia,
  // Amostra
  setNivelAmostra,
  // Erlenmeyer
  setNivelErlenmeyer, setCorErlenmeyer,
  setErlenmeyerPrep, setTampaoAdicionado,
  // Espátula
  espatulaComIndicador, setEspatulaComIndicador,
  // Indicador
  setIndicadorAdicionado, setVibrarKey,
  // Titulação
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
      setNivelErlenmeyer(40);
      setCorErlenmeyer('rgba(185,215,240,0.52)');
      setErlenmeyerPrep(true);
      setNivelProveta(0);
      setProvetaCheia(false);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ETAPA 2 — TAMPÃO → ERLENMEYER (5 mL + leve homogeneização)
    if (itemDrop === 'tampao' && alvo === 'erlenmeyer' && etapaAtual === 2) {
      setItemSegurado(null);
      setNivelErlenmeyer(46);
      setCorErlenmeyer('rgba(185,215,240,0.58)');
      setTampaoAdicionado(true);
      setVibrarKey(k => k + 1);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ETAPA 3 — ESPÁTULA → NEGRO DE ERIOCROMO (coleta pó)
    if (itemDrop === 'espatula' && alvo === 'negro_eriocromo' && etapaAtual === 3) {
      setItemSegurado(null);
      setEspatulaComIndicador(true);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ETAPA 4 — ESPÁTULA → ERLENMEYER (adiciona indicador + vinho + vibração)
    if (itemDrop === 'espatula' && alvo === 'erlenmeyer' && etapaAtual === 4 && espatulaComIndicador) {
      setItemSegurado(null);
      setEspatulaComIndicador(false);
      setNivelErlenmeyer(48);
      setCorErlenmeyer('rgba(140,20,80,0.78)');  // vinho/arroxeado
      setIndicadorAdicionado(true);
      setVibrarKey(k => k + 1);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ETAPA 5 — EDTA → BURETA (preencher)
    if (itemDrop === 'edta' && alvo === 'bureta' && etapaAtual === 5) {
      setItemSegurado(null);
      setNivelBureta(100);
      celebrarAcerto();
      proximaEtapa();
      return;
    }

    // ETAPA 6 — ERLENMEYER → ÁREA DE TITULAÇÃO
    if (itemDrop === 'erlenmeyer' && alvo === 'areaTitulacao' && etapaAtual === 6) {
      setItemSegurado(null);
      setErlenmeyerNaTitulacao(true);
      const vol = parseFloat((Math.random() * 9 + 2).toFixed(1));
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
