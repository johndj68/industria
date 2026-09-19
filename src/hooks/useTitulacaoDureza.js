import { useState, useMemo } from 'react';
import { calcDureza, fatorEdta } from '../utils/durezaCalculo';

/**
 * useTitulacaoDureza — estado e lógica da titulação com EDTA para Dureza Total.
 *
 * Viragem: vinho/arroxeado → azul
 * Etapa de titulação: 7
 */
export const useTitulacaoDureza = ({
  etapaAtual,
  erlenmeyerNaTitulacao,
  indicadorAdicionado,
  corErlenmeyer,
  celebrarAcerto,
  proximaEtapa,
}) => {
  const [molaridade,     setMolaridade]     = useState('0.01M');
  const [volumeGasto,    setVolumeGasto]    = useState(0);
  const [endpointVolume, setEndpointVolume] = useState(0);
  const [pontoFinal,     setPontoFinal]     = useState(false);
  const [gotejando,      setGotejando]      = useState(false);
  const [nivelBureta,    setNivelBureta]    = useState(0);
  const [hitKey,         setHitKey]         = useState(0);

  // ── Cor interpolada: vinho → azul ────────────────────
  const corSolucao = useMemo(() => {
    if (!indicadorAdicionado) return corErlenmeyer;
    if (!erlenmeyerNaTitulacao || endpointVolume === 0) return corErlenmeyer;
    if (pontoFinal) return 'rgba(20,90,210,0.88)';
    const p = Math.min(volumeGasto / endpointVolume, 1);
    const r = Math.round(140 - 120 * p);  // 140 → 20
    const g = Math.round(20  +  70 * p);  // 20  → 90
    const b = Math.round(80  + 130 * p);  // 80  → 210
    return `rgba(${r},${g},${b},${(0.76 + 0.12 * p).toFixed(2)})`;
  }, [indicadorAdicionado, erlenmeyerNaTitulacao, pontoFinal, volumeGasto, endpointVolume, corErlenmeyer]);

  // ── Clique na torneira ────────────────────────────────
  const handleClicarBureta = () => {
    if (etapaAtual !== 7 || !erlenmeyerNaTitulacao || pontoFinal) return;

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

  const fator = fatorEdta(molaridade);
  const resultadoDureza = pontoFinal ? calcDureza(endpointVolume, molaridade) : null;

  return {
    molaridade, setMolaridade,
    volumeGasto,
    endpointVolume, setEndpointVolume,
    pontoFinal,
    gotejando,
    nivelBureta, setNivelBureta,
    hitKey,
    corSolucao,
    handleClicarBureta,
    fator,
    resultadoDureza,
  };
};
