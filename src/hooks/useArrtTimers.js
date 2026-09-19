import { useEffect } from 'react';

/**
 * useArrtTimers — 5 timers de processo do simulador ARRT.
 *
 * Filtração (3,2s) · NaOH reset (1,8s) · Fenol (2,2s)
 * Micro-ondas 1 (4s) · Micro-ondas 2 (4s)
 */
export const useArrtTimers = ({
  filtrando, setFiltrando, setAmostraFiltrada, setFunilAcoplado, setNivelBequer400,
  titulandoNaOH, setTitulandoNaOH,
  fenolGotas, setFenolGotas, setCorBequer150,
  bequerNoMicro1, setBequerNoMicro1,
  bequerNoMicro2, setBequerNoMicro2, setVidroRelogioAcoplado,
  celebrarAcerto, proximaEtapa,
}) => {

  // ── TIMER: filtração (etapa 2) ────────────────────────
  useEffect(() => {
    if (!filtrando) return;
    const id = setTimeout(() => {
      setFiltrando(false);
      setAmostraFiltrada(true);
      setFunilAcoplado(false);  // funil desacopla após filtração
      setNivelBequer400(58);
      celebrarAcerto();
      proximaEtapa();
    }, 3200);
    return () => clearTimeout(id);
  }, [filtrando]);

  // ── TIMER: animação NaOH — reset após 1.8s ───────────
  useEffect(() => {
    if (!titulandoNaOH) return;
    const id = setTimeout(() => setTitulandoNaOH(false), 1800);
    return () => clearTimeout(id);
  }, [titulandoNaOH]);

  // ── TIMER: fenolftaleína gotas (etapa 8) ──────────────
  useEffect(() => {
    if (!fenolGotas) return;
    const id = setTimeout(() => {
      setFenolGotas(false);
      setCorBequer150('rgba(218,175,88,0.64)');
      celebrarAcerto();
      proximaEtapa();
    }, 2200);
    return () => clearTimeout(id);
  }, [fenolGotas]);

  // ── TIMER: micro-ondas 1ª vez (etapa 5) ──────────────
  useEffect(() => {
    if (!bequerNoMicro1) return;
    const id = setTimeout(() => {
      setBequerNoMicro1(false);
      celebrarAcerto(100);
      proximaEtapa();
    }, 4000);
    return () => clearTimeout(id);
  }, [bequerNoMicro1]);

  // ── TIMER: micro-ondas 2ª vez (etapa 16) ─────────────
  useEffect(() => {
    if (!bequerNoMicro2) return;
    const id = setTimeout(() => {
      setBequerNoMicro2(false);
      setVidroRelogioAcoplado(false); // desacopla vidro relógio
      celebrarAcerto(100);
      proximaEtapa();
    }, 4000);
    return () => clearTimeout(id);
  }, [bequerNoMicro2]);
};
