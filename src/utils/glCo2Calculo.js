/**
 * glCo2Calculo.js — Cálculo de Teor Alcoólico (°GL) — Coluna de CO₂
 *
 * Método: Microdestilação + Densimetria
 * °GL = leitura densímetro ÷ 5
 * Fonte: ATV-OPE-GQI-PR-002 — Página 138
 */

/** Gera leitura bruta simulada do densímetro (faixa realista: 1,00 – 6,50 %). */
export function gerarLeituraGlCo2() {
  return parseFloat((Math.random() * 5.5 + 1.0).toFixed(2));
}

/**
 * Calcula °GL a partir da leitura bruta do densímetro.
 * °GL = leituraRaw / 5
 */
export function calcGlCo2(leituraRaw) {
  return parseFloat((leituraRaw / 5).toFixed(2));
}
