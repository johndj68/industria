/**
 * alcalinidadeCalculo.js — Cálculos de Alcalinidade Total
 *
 * Fonte: COR-IND-QUA-PO-07 — Página 24
 */

/**
 * Retorna o fator multiplicador conforme a normalidade do ácido.
 * 0,1 N → fator 100 · 0,02 N → fator 20
 */
export function fatorNormalidade(normalidade) {
  return normalidade === '0.1N' ? 100 : 20;
}

/**
 * Calcula a alcalinidade total em ppm como CaCO₃.
 * AT = V × fator
 */
export function calcAlcalinidade(volume, normalidade) {
  return (volume * fatorNormalidade(normalidade)).toFixed(1);
}
