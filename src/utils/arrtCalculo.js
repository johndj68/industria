/**
 * arrtCalculo.js — Cálculo de ARRT (Açúcares Redutores Residuais Totais)
 *
 * Método Titrino com Micro-ondas · Método Dorna
 * Faixa esperada: 0,12 – 0,50 %
 */

/** Gera resultado simulado de ARRT dentro da faixa esperada. */
export function gerarResultadoArrt() {
  return parseFloat((Math.random() * 0.38 + 0.12).toFixed(2));
}
