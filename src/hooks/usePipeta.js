import { useState, useEffect } from 'react';

export const usePipeta = () => {
  const [nivelPipeta,  setNivelPipeta]  = useState(0);
  const [corPipeta,    setCorPipeta]    = useState('#93c5fd');
  const [pipetaCheia,  setPipetaCheia]  = useState(false);
  const [volumePipeta, setVolumePipeta] = useState(20);
  const [tipIdx,       setTipIdx]       = useState(null);
  const [tips,         setTips]         = useState(Array(12).fill(true));

  useEffect(() => {
    if (!pipetaCheia) return;
    let v = 0;
    const intervalo = setInterval(() => {
      v += 5;
      setNivelPipeta(Math.min(v, 100));
      if (v >= 100) clearInterval(intervalo);
    }, 70);
    return () => clearInterval(intervalo);
  }, [pipetaCheia]);

  return {
    nivelPipeta,  setNivelPipeta,
    corPipeta,    setCorPipeta,
    pipetaCheia,  setPipetaCheia,
    volumePipeta, setVolumePipeta,
    tipIdx,       setTipIdx,
    tips,         setTips,
  };
};
