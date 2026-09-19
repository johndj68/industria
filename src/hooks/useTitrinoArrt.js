import { useState } from 'react';
import { gerarResultadoArrt } from '../utils/arrtCalculo';

/**
 * useTitrinoArrt — estado e lógica de clique do Titrino Plus (etapa 23).
 *
 * Retorna setBequerNoTitrino para ser passado ao hook de drag.
 */
export const useTitrinoArrt = ({ etapaAtual, celebrarAcerto, proximaEtapa }) => {
  const [bequerNoTitrino, setBequerNoTitrino] = useState(false);
  const [titrinoLendo,    setTitrinoLendo]    = useState(false);
  const [curvaFinalizada, setCurvaFinalizada] = useState(false);
  const [resultadoArrt,   setResultadoArrt]   = useState(null);

  const handleClickTitrino = () => {
    if (etapaAtual !== 23 || !bequerNoTitrino || titrinoLendo || curvaFinalizada) return;
    setTitrinoLendo(true);
    setTimeout(() => {
      setResultadoArrt(gerarResultadoArrt());
      setCurvaFinalizada(true);
      setTitrinoLendo(false);
      celebrarAcerto(200);
      proximaEtapa();
    }, 4000);
  };

  return {
    bequerNoTitrino, setBequerNoTitrino,
    titrinoLendo,
    curvaFinalizada,
    resultadoArrt,
    handleClickTitrino,
  };
};
