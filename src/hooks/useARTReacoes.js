import { useEffect } from 'react';

/**
 * useARTReacoes — animações de reações químicas (etapas 6–14).
 * Microondas, fenolftaleína, titulação HCl, EDTA, água até menisco.
 */
export const useARTReacoes = ({
  aquecendo, setTempoMicroondas, setAquecendo,
  setBalaoNoMicroondas, setBalaoPosicionado,
  setAmostraQuente, setMostrarAvisoResfriamento,
  adicionandoFenol, setGotasFenol, setAdicionandoFenol,
  pipetaHClCheia, setNivelPipetaHCl, nivelAlvoPipetaHCl,
  etapaAtual, nivelPipetaHCl, fehlingAAdicionado,
  titulando, setTitulando, setCorBalao, setAgitacao, setPipetaHClCheia,
  neutralizandoEDTA, setNeutralizandoEDTA,
  gotejandoEDTA, setGotasEDTA, setGotejandoEDTA,
  adicionandoAgua, nivelAlvoBalao, setNivelBalao, setAdicionandoAgua, setDiluindo,
  avancarEtapa,
}) => {

  // ── Microondas: conta regressiva 30s → 0 ─────────────
  useEffect(() => {
    if (!aquecendo) return;
    const intervalo = setInterval(() => {
      setTempoMicroondas((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          setAquecendo(false);
          setBalaoNoMicroondas(false);
          setBalaoPosicionado(false);
          setAmostraQuente(true);
          setMostrarAvisoResfriamento(true);
          setTimeout(() => {
            setAmostraQuente(false);
            setMostrarAvisoResfriamento(false);
          }, 4000);
          return 0;
        }
        return prev - 1;
      });
    }, 100);
    return () => clearInterval(intervalo);
  }, [aquecendo]);

  // ── Fenolftaleína: 3 gotas, 1/s ──────────────────────
  useEffect(() => {
    if (!adicionandoFenol) return;
    const intervalo = setInterval(() => {
      setGotasFenol((prev) => {
        if (prev >= 3) {
          clearInterval(intervalo);
          setAdicionandoFenol(false);
          avancarEtapa(9);
          return 3;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [adicionandoFenol, avancarEtapa]);

  // ── Pipeta HCl: enchimento até nível alvo ────────────
  useEffect(() => {
    if (!pipetaHClCheia) return;
    const intervalo = setInterval(() => {
      setNivelPipetaHCl((prev) => {
        if (prev >= nivelAlvoPipetaHCl) { clearInterval(intervalo); return nivelAlvoPipetaHCl; }
        return prev + 5;
      });
    }, 150);
    return () => clearInterval(intervalo);
  }, [pipetaHClCheia, nivelAlvoPipetaHCl]);

  // ── Etapa 10: auto-avança quando pipeta HCl cheia ────
  useEffect(() => {
    if (etapaAtual !== 10 || !pipetaHClCheia || nivelAlvoPipetaHCl !== 100 || nivelPipetaHCl < 100) return;
    const timeout = setTimeout(() => avancarEtapa(10), 350);
    return () => clearTimeout(timeout);
  }, [etapaAtual, pipetaHClCheia, nivelPipetaHCl, nivelAlvoPipetaHCl, avancarEtapa]);

  // ── Etapa 15: auto-avança após Fehling A ─────────────
  useEffect(() => {
    if (etapaAtual !== 15 || !fehlingAAdicionado) return;
    const timeout = setTimeout(() => avancarEtapa(15), 650);
    return () => clearTimeout(timeout);
  }, [etapaAtual, fehlingAAdicionado, avancarEtapa]);

  // ── Titulação HCl: muda cor do balão gradualmente ────
  useEffect(() => {
    if (!titulando) return;
    const cores = ['amber', 'orange', 'pink', 'rose', 'cherry'];
    let passo = 0;
    const intervalo = setInterval(() => {
      setNivelPipetaHCl((prev) => Math.max(prev - 2, 0));
      setCorBalao(cores[passo]);
      passo++;
      if (passo >= cores.length) {
        clearInterval(intervalo);
        setTitulando(false);
        setAgitacao(false);
        setPipetaHClCheia(false);
        avancarEtapa();
      }
    }, 800);
    return () => clearInterval(intervalo);
  }, [titulando, avancarEtapa]);

  // ── Neutralização EDTA: reversão de cor ──────────────
  useEffect(() => {
    if (!neutralizandoEDTA) return;
    const cores = ['rose', 'pink', 'orange', 'amber'];
    let passo = 0;
    const intervalo = setInterval(() => {
      setCorBalao(cores[passo]);
      passo++;
      if (passo >= cores.length) {
        clearInterval(intervalo);
        setNeutralizandoEDTA(false);
        setAgitacao(false);
        setPipetaHClCheia(false);
        avancarEtapa();
      }
    }, 700);
    return () => clearInterval(intervalo);
  }, [neutralizandoEDTA, avancarEtapa]);

  // ── Gotejamento EDTA: 3 gotas → inicia neutralização ─
  useEffect(() => {
    if (!gotejandoEDTA) return;
    const intervalo = setInterval(() => {
      setGotasEDTA((prev) => {
        const novaQtd = prev + 1;
        setNivelPipetaHCl((nivel) => Math.max(nivel - 8, 0));
        if (novaQtd >= 3) {
          clearInterval(intervalo);
          setGotejandoEDTA(false);
          setNeutralizandoEDTA(true);
        }
        return novaQtd;
      });
    }, 900);
    return () => clearInterval(intervalo);
  }, [gotejandoEDTA]);

  // ── Água: enche balão até o menisco ──────────────────
  useEffect(() => {
    if (!adicionandoAgua) return;
    const intervalo = setInterval(() => {
      setNivelBalao((prev) => {
        if (prev >= nivelAlvoBalao) {
          clearInterval(intervalo);
          setAdicionandoAgua(false);
          setDiluindo(false);
          avancarEtapa(14);
          return nivelAlvoBalao;
        }
        return prev + 2;
      });
    }, 120);
    return () => clearInterval(intervalo);
  }, [adicionandoAgua, nivelAlvoBalao, avancarEtapa]);
};
