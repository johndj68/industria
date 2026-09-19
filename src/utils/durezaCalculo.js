/**
 * durezaCalculo.js — Cálculos de Dureza Total Dissolvida
 *
 * Dureza Total (ppm como CaCO₃) = V × fator
 *   EDTA 0,01 M   → fator 20
 *   EDTA 0,0025 M → fator  5
 */

export function fatorEdta(molaridade) {
  return molaridade === '0.01M' ? 20 : 5;
}

export function calcDureza(volume, molaridade) {
  return (volume * fatorEdta(molaridade)).toFixed(1);
}
