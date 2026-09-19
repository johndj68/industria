import { useState, useCallback } from 'react';

export const useGameState = (totalEtapas) => {
  const [pontuacao,         setPontuacao]         = useState(0);
  const [etapaAtual,        setEtapaAtual]        = useState(0);
  const [itemSegurado,      setItemSegurado]      = useState(null);
  const [mostrarParabens,   setMostrarParabens]   = useState(false);
  const [concluido,         setConcluido]         = useState(false);
  const [mostrarErroEtapa,  setMostrarErroEtapa]  = useState(false);
  const [mensagemErroEtapa, setMensagemErroEtapa] = useState('');

  const celebrarAcerto = useCallback((bonus = 100) => {
    setPontuacao(p => p + bonus);
    setMostrarParabens(true);
    setTimeout(() => setMostrarParabens(false), 1200);
  }, []);

  const mostrarErroAcao = useCallback((mensagem = 'Ação incorreta para esta etapa.') => {
    setMensagemErroEtapa(mensagem);
    setMostrarErroEtapa(true);
    setTimeout(() => setMostrarErroEtapa(false), 1800);
  }, []);

  const proximaEtapa = useCallback(() => {
    setEtapaAtual(e => {
      if (e >= totalEtapas - 1) {
        setConcluido(true);
        return e;
      }
      return e + 1;
    });
  }, [totalEtapas]);

  return {
    pontuacao, setPontuacao,
    etapaAtual, setEtapaAtual,
    itemSegurado, setItemSegurado,
    mostrarParabens,
    concluido, setConcluido,
    mostrarErroEtapa,
    mensagemErroEtapa,
    celebrarAcerto,
    mostrarErroAcao,
    proximaEtapa,
  };
};
