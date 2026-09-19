/**
 * artCalculo.js — Cálculo de ART (Açúcares Redutores Totais)
 *
 * Método Fehling · TE-088
 * Fonte: Procedimento interno TE-088
 */

/** Gera volume simulado dentro da faixa esperada (47,1–50,9 mL). */
export function gerarVolumeART() {
  return Number((47.1 + Math.random() * 3.8).toFixed(1));
}

/**
 * Calcula %ART a partir do volume gasto na bureta.
 * %ART = V × 0,0215
 */
export function calcART(volume) {
  return Number((volume * 0.0215).toFixed(2));
}
