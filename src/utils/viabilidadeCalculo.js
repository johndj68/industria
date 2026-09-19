/**
 * viabilidadeCalculo.js — Funções de cálculo de viabilidade celular
 *
 * Baseadas no protocolo de exclusão por Eritrosina 0,1% com
 * contagem em Câmara de Neubauer (volume: 0,1 mm³ por quadrante).
 *
 * Todas as funções são puras — sem efeitos colaterais.
 */

/**
 * Percentual de células viáveis na amostra.
 * Fórmula: CV / (CV + CM) × 100
 *
 * @param {number} vivas  - contagem de células vivas
 * @param {number} mortas - contagem de células mortas
 * @returns {number} viabilidade em %  (0–100), ou 0 se total = 0
 */
export function calcViabilidade(vivas, mortas) {
  const total = vivas + mortas;
  if (total === 0) return 0;
  return (vivas / total) * 100;
}

/**
 * Percentual de brotamento em relação às células vivas.
 * Fórmula: B / CV × 100
 *
 * @param {number} brotos - contagem de brotos
 * @param {number} vivas  - contagem de células vivas
 * @returns {number} taxa de brotamento em % (0–100), ou 0 se vivas = 0
 */
export function calcBrotamento(brotos, vivas) {
  if (vivas === 0) return 0;
  return (brotos / vivas) * 100;
}

/**
 * Concentração de células por mL na câmara (sem correção de diluição).
 * Fórmula padrão de Neubauer: N × 10⁴
 * (área do quadrante = 1 mm², profundidade = 0,1 mm → volume = 10⁻⁴ mL)
 *
 * @param {number} vivas - contagem de células vivas no quadrante
 * @returns {number} células/mL
 */
export function calcCelulasML(vivas) {
  return vivas * 10000;
}

/**
 * Concentração de leveduras viáveis por mL na amostra original,
 * corrigida pelo fator de diluição.
 * Fórmula padrão de Neubauer: N × 10⁴ × fatorDiluicao
 *
 * @param {number} vivas         - contagem de células vivas
 * @param {number} fatorDiluicao - fator de diluição aplicado (ex: 40 = 1:40)
 * @returns {number} leveduras viáveis/mL
 */
export function calcLevedurasML(vivas, fatorDiluicao) {
  return vivas * 10000 * fatorDiluicao;
}
