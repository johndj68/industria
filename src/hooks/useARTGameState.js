import { useState, useCallback } from 'react';
import { gerarVolumeART, calcART } from '../utils/artCalculo';

/**
 * useARTGameState — estado do jogo e navegação de etapas para SimuladorART.
 *
 * Params:
 *   totalEtapas — número total de etapas (de etapasART.length)
 */
export const useARTGameState = (totalEtapas) => {
  const [pontuacao,     setPontuacao]     = useState(0);
  const [etapaAtual,    setEtapaAtual]    = useState(0);
  const [itemSegurado,  setItemSegurado]  = useState(null);
  const [mostrarParabens, setMostrarParabens] = useState(false);
  const [concluido,     setConcluido]     = useState(false);
  const [volumeGasto,   setVolumeGasto]   = useState(null);
  const [artPercentual, setArtPercentual] = useState(null);
  const [estrelas] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id:    i,
      left:  `${Math.random() * 100}%`,
      top:   `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.5}s`,
    }))
  );

  // Avança etapa com pontuação. etapaEsperada previne double-advance.
  const avancarEtapa = useCallback((etapaEsperada = null) => {
    setEtapaAtual((prev) => {
      if (etapaEsperada !== null && prev !== etapaEsperada) return prev;
      if (prev >= totalEtapas - 1) return prev;
      setPontuacao((pontos) => pontos + 100);
      setMostrarParabens(true);
      setTimeout(() => setMostrarParabens(false), 2000);
      return prev + 1;
    });
  }, [totalEtapas]);

  const finalizarAnalise = useCallback(() => {
    if (concluido) return;
    const volumeCalculado = gerarVolumeART();
    const artCalculado    = calcART(volumeCalculado);
    setVolumeGasto(volumeCalculado);
    setArtPercentual(artCalculado);
    setConcluido(true);
    setPontuacao((pontos) => pontos + 100);
    setMostrarParabens(true);
    setTimeout(() => setMostrarParabens(false), 2000);
  }, [concluido]);

  return {
    pontuacao,
    etapaAtual,
    itemSegurado,   setItemSegurado,
    mostrarParabens,
    concluido,
    volumeGasto,
    artPercentual,
    estrelas,
    avancarEtapa,
    finalizarAnalise,
  };
};
