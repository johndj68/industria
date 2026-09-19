import { useState, useEffect } from 'react';

export const useVortex = () => {
  const [vortexLigado,   setVortexLigado]   = useState(false);
  const [vortexAng,      setVortexAng]      = useState(0);
  const [homogeneizado,  setHomogeneizado]  = useState(false);
  const [tuboNoVortex,   setTuboNoVortex]   = useState(false);
  const [tipoTuboVortex, setTipoTuboVortex] = useState(null);

  useEffect(() => {
    if (!vortexLigado) return;
    let id;
    const tick = () => { setVortexAng(a => a + 18); id = requestAnimationFrame(tick); };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [vortexLigado]);

  return {
    vortexLigado,   setVortexLigado,
    vortexAng,      setVortexAng,
    homogeneizado,  setHomogeneizado,
    tuboNoVortex,   setTuboNoVortex,
    tipoTuboVortex, setTipoTuboVortex,
  };
};
