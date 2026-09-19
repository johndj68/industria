import { useEffect } from 'react';

/**
 * useARTTE088 — animações do TE-088 (etapas 18–21).
 * Pipeta azul, gotas, transferência bureta, titulação final.
 */
export const useARTTE088 = ({
  pipetaAzulCheia, setNivelPipetaAzul,
  gotejandoAzul, setGotejandoAzul, setPosicaoGotasAzul,
  posicaoGotasAzul, nivelErlenmeyerTE, setCorErlenmeyerDireitoFinal,
  transferindoBalaoParaBureta, setTransferindoBalaoParaBureta,
  setNivelBalao, setNivelBuretaDireita,
  gotejandoBuretaDireita, setGotejandoBuretaDireita, setPosicaoGotasBureta,
  avancarEtapa, finalizarAnalise,
}) => {

  // ── Pipeta azul de metileno: enchimento ──────────────
  useEffect(() => {
    if (!pipetaAzulCheia) return;
    const intervalo = setInterval(() => {
      setNivelPipetaAzul((prev) => {
        if (prev >= 100) { clearInterval(intervalo); return 100; }
        return prev + 5;
      });
    }, 120);
    return () => clearInterval(intervalo);
  }, [pipetaAzulCheia]);

  // ── Gotas azuis caindo para o erlenmeyer ─────────────
  useEffect(() => {
    if (!gotejandoAzul) return;
    const intervalo = setInterval(() => {
      setPosicaoGotasAzul((prev) => {
        const novas = [...prev];
        if (novas.length < 3) novas.push(230);
        return novas.map((y) => y + 6);
      });
    }, 80);
    return () => clearInterval(intervalo);
  }, [gotejandoAzul]);

  // ── Gotas azuis absorvidas pelo líquido ──────────────
  useEffect(() => {
    const yLiquido = 320 - nivelErlenmeyerTE;
    const todasAbsorvidas =
      posicaoGotasAzul.length === 3 &&
      posicaoGotasAzul.every((y) => y >= yLiquido);

    if (todasAbsorvidas) {
      setGotejandoAzul(false);
      setPosicaoGotasAzul([]);
      setCorErlenmeyerDireitoFinal('#2563eb');
      setTimeout(() => avancarEtapa(), 400);
    }
  }, [posicaoGotasAzul, nivelErlenmeyerTE, avancarEtapa]);

  // ── Transferência balão → bureta ─────────────────────
  useEffect(() => {
    if (!transferindoBalaoParaBureta) return;
    const intervalo = setInterval(() => {
      setNivelBalao((prev) => {
        if (prev <= 50) {
          clearInterval(intervalo);
          setTransferindoBalaoParaBureta(false);
          setNivelBuretaDireita(100);
          avancarEtapa();
          return 50;
        }
        return prev - 2;
      });
      setNivelBuretaDireita((prev) => Math.min(prev + 2, 100));
    }, 120);
    return () => clearInterval(intervalo);
  }, [transferindoBalaoParaBureta, avancarEtapa]);

  // ── Bureta drenar durante titulação ──────────────────
  useEffect(() => {
    if (!gotejandoBuretaDireita) return;
    const intervalo = setInterval(() => {
      setNivelBuretaDireita((prev) => {
        const novoNivel = prev - 1;
        if (novoNivel <= 10) {
          clearInterval(intervalo);
          setGotejandoBuretaDireita(false);
          setCorErlenmeyerDireitoFinal('#b91c1c');
          finalizarAnalise();
          return 10;
        }
        return novoNivel;
      });
    }, 120);
    return () => clearInterval(intervalo);
  }, [gotejandoBuretaDireita, finalizarAnalise]);

  // ── Gotas da bureta caindo ────────────────────────────
  useEffect(() => {
    if (!gotejandoBuretaDireita) return;
    const intervalo = setInterval(() => {
      setPosicaoGotasBureta((prev) => {
        const novas = [...prev];
        if (novas.length < 1) novas.push(200);
        const yLiquido = 320 - nivelErlenmeyerTE;
        const atualizadas = novas.map((y) => y + 10);
        if (atualizadas.some((y) => y >= yLiquido)) return [];
        return atualizadas;
      });
    }, 60);
    return () => clearInterval(intervalo);
  }, [gotejandoBuretaDireita, nivelErlenmeyerTE]);
};
