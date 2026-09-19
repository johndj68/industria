import { useEffect } from 'react';

/**
 * useARTTransferencias — animações de transferências de fluidos (etapas 0–8).
 * Filtração, pesagem, pipeta NaOH/açúcar, enchimento do balão.
 */
export const useARTTransferencias = ({
  filtrando, setFiltrando, setNivelColetor, setNivelAmostra, setFunilVoltando,
  funilVoltando, setFunilEncaixado, setFunilPosicionado,
  pesando, setPesando, setPeso,
  pipetaCheia, setNivelPipeta, setPipetaCheia,
  pipetaAcucarCheia, setNivelPipetaAcucar, setPipetaAcucarCheia,
  transferindoPipeta, setTransferindoPipeta, setNivelBalao,
  transferindo, setTransferindo, setBalaoEncaixado, setBalaoPosicionado,
  transferindoPipetaAcucar, setTransferindoPipetaAcucar,
}) => {

  // ── Filtração: enche coletor ──────────────────────────
  useEffect(() => {
    if (!filtrando) return;
    const intervalo = setInterval(() => {
      setNivelColetor((prev) => {
        if (prev >= 100) {
          clearInterval(intervalo);
          setFiltrando(false);
          setFunilVoltando(true);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    return () => clearInterval(intervalo);
  }, [filtrando]);

  // ── Filtração: esvazia amostra ────────────────────────
  useEffect(() => {
    if (!filtrando) return;
    const intervalo = setInterval(() => {
      setNivelAmostra((prev) => {
        if (prev <= 0) { clearInterval(intervalo); return 0; }
        return prev - 5;
      });
    }, 200);
    return () => clearInterval(intervalo);
  }, [filtrando]);

  // ── Funil volta para lateral após filtração ───────────
  useEffect(() => {
    if (!funilVoltando) return;
    setFunilEncaixado(false);
    setTimeout(() => {
      setFunilPosicionado(false);
      setFunilVoltando(false);
    }, 700);
  }, [funilVoltando]);

  // ── Pesagem: incrementa peso até 50g ─────────────────
  useEffect(() => {
    if (!pesando) return;
    let valor = 0;
    const intervalo = setInterval(() => {
      valor += 1;
      setPeso(valor);
      if (valor >= 50) { clearInterval(intervalo); setPesando(false); }
    }, 100);
    return () => clearInterval(intervalo);
  }, [pesando]);

  // ── Pipeta NaOH: enchimento visual ───────────────────
  useEffect(() => {
    if (!pipetaCheia) return;
    const intervalo = setInterval(() => {
      setNivelPipeta((prev) => {
        if (prev >= 100) { clearInterval(intervalo); return 100; }
        return prev + 5;
      });
    }, 150);
    return () => clearInterval(intervalo);
  }, [pipetaCheia]);

  // ── Pipeta açúcar: enchimento visual ─────────────────
  useEffect(() => {
    if (!pipetaAcucarCheia) return;
    const intervalo = setInterval(() => {
      setNivelPipetaAcucar((prev) => {
        if (prev >= 100) { clearInterval(intervalo); return 100; }
        return prev + 5;
      });
    }, 150);
    return () => clearInterval(intervalo);
  }, [pipetaAcucarCheia]);

  // ── Transferência pipeta NaOH → balão ────────────────
  useEffect(() => {
    if (!transferindoPipeta) return;
    const intervalo = setInterval(() => {
      setNivelPipeta((prev) => {
        if (prev <= 0) {
          clearInterval(intervalo);
          setTransferindoPipeta(false);
          setPipetaCheia(false);
          setNivelBalao((b) => Math.min(b + 12, 100));
          return 0;
        }
        return prev - 5;
      });
    }, 150);
    return () => clearInterval(intervalo);
  }, [transferindoPipeta]);

  // ── Coletor → balão (etapa 3) ─────────────────────────
  useEffect(() => {
    if (!transferindo) return;
    const intervalo = setInterval(() => {
      setNivelColetor((prev) => {
        if (prev <= 0) {
          clearInterval(intervalo);
          setTransferindo(false);
          setTimeout(() => {
            setBalaoEncaixado(false);
            setBalaoPosicionado(false);
          }, 600);
          return 0;
        }
        return prev - 5;
      });
      setNivelBalao((prev) => Math.min(prev + 5, 100));
    }, 260);
    return () => clearInterval(intervalo);
  }, [transferindo]);

  // ── Transferência pipeta açúcar → balão ──────────────
  useEffect(() => {
    if (!transferindoPipetaAcucar) return;
    const intervalo = setInterval(() => {
      setNivelPipetaAcucar((prev) => {
        if (prev <= 0) {
          clearInterval(intervalo);
          setTransferindoPipetaAcucar(false);
          setPipetaAcucarCheia(false);
          setNivelBalao((b) => Math.min(b + 10, 100));
          return 0;
        }
        return prev - 5;
      });
    }, 150);
    return () => clearInterval(intervalo);
  }, [transferindoPipetaAcucar]);
};
