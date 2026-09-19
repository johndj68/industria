import { useState } from 'react';

/**
 * useFotometro — estado e handlers do fotômetro HACH DR900.
 *
 * Params:
 *   etapaAtual, cubetaNoFotometro, setCubetaNoFotometro,
 *   setNivelCubeta, setCorCubeta, celebrarAcerto, proximaEtapa
 */
export const useFotometro = ({
  etapaAtual,
  cubetaNoFotometro,
  setCubetaNoFotometro,
  setNivelCubeta,
  setCorCubeta,
  celebrarAcerto,
  proximaEtapa,
}) => {
  const [zerando,   setZerando]   = useState(false);
  const [zerado,    setZerado]    = useState(false);
  const [lendo,     setLendo]     = useState(false);
  const [resultado, setResultado] = useState(null);

  // ── Clique ZERO ───────────────────────────────────────
  const handleZero = () => {
    if (etapaAtual !== 22 || !cubetaNoFotometro || zerando || zerado) return;
    setZerando(true);
    setTimeout(() => {
      setZerando(false);
      setZerado(true);
      setCubetaNoFotometro(false);
      setNivelCubeta(0);
      setCorCubeta('rgba(220,235,255,0.08)');
      celebrarAcerto(150);
      proximaEtapa();
    }, 2200);
  };

  // ── Clique LER ────────────────────────────────────────
  const handleLer = () => {
    if (etapaAtual !== 25 || !cubetaNoFotometro || lendo || resultado) return;
    setLendo(true);
    setTimeout(() => {
      const val = (Math.random() * 1.35 + 0.05).toFixed(2);
      setResultado(val);
      setLendo(false);
      celebrarAcerto(200);
      proximaEtapa();
    }, 3000);
  };

  return { zerando, zerado, lendo, resultado, handleZero, handleLer };
};
