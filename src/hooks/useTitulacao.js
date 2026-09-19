import { useState, useMemo } from 'react';
import { calcAlcalinidade, fatorNormalidade } from '../utils/alcalinidadeCalculo';

/**
 * useTitulacao — estado e lógica da etapa de titulação ácido-base.
 *
 * Params:
 *   etapaAtual, erlenmeyerNaTitulacao, indicadorAdicionado,
 *   corErlenmeyer, celebrarAcerto, proximaEtapa
 *
 * Returns estado, setters (setEndpointVolume, setNivelBureta) expostos para
 * o hook de drag, handler de clique e valores calculados.
 */
export const useTitulacao = ({
  etapaAtual,
  erlenmeyerNaTitulacao,
  indicadorAdicionado,
  corErlenmeyer,
  celebrarAcerto,
  proximaEtapa,
}) => {
  const [normalidade,    setNormalidade]    = useState('0.1N');
  const [volumeGasto,    setVolumeGasto]    = useState(0);
  const [endpointVolume, setEndpointVolume] = useState(0);
  const [pontoFinal,     setPontoFinal]     = useState(false);
  const [gotejando,      setGotejando]      = useState(false);
  const [nivelBureta,    setNivelBureta]    = useState(0);  // começa vazia
  const [hitKey,         setHitKey]         = useState(0);  // força re-mount da animação

  // ── Cor interpolada da solução durante titulação ──────
  const corSolucao = useMemo(() => {
    if (!indicadorAdicionado) return corErlenmeyer;
    if (!erlenmeyerNaTitulacao || endpointVolume === 0) return corErlenmeyer;
    if (pontoFinal) return 'rgba(255,162,124,0.90)';
    const p = Math.min(volumeGasto / endpointVolume, 1);
    const r = Math.round(232 + (255 - 232) * p);
    const g = Math.round(108 + (162 - 108) * p);
    const b = Math.round(12  + (124 - 12)  * p);
    return `rgba(${r},${g},${b},0.86)`;
  }, [indicadorAdicionado, erlenmeyerNaTitulacao, pontoFinal, volumeGasto, endpointVolume, corErlenmeyer]);

  // ── Clique na torneira ────────────────────────────────
  const handleClicarBureta = () => {
    if (etapaAtual !== 5 || !erlenmeyerNaTitulacao || pontoFinal) return;

    const novo = parseFloat((volumeGasto + 0.2).toFixed(1));
    setVolumeGasto(novo);
    setGotejando(true);
    setHitKey(k => k + 1);
    setTimeout(() => setGotejando(false), 660);

    setNivelBureta(prev => Math.max(prev - (0.2 / 50) * 100, 0));

    if (novo >= endpointVolume) {
      setPontoFinal(true);
      setTimeout(() => { celebrarAcerto(200); proximaEtapa(); }, 1600);
    }
  };

  const fator = fatorNormalidade(normalidade);
  const resultadoAlcalinidade = pontoFinal ? calcAlcalinidade(endpointVolume, normalidade) : null;

  return {
    normalidade, setNormalidade,
    volumeGasto,
    endpointVolume, setEndpointVolume,
    pontoFinal,
    gotejando,
    nivelBureta, setNivelBureta,
    hitKey,
    corSolucao,
    handleClicarBureta,
    fator,
    resultadoAlcalinidade,
  };
};
