/**
 * etapasMosto.js — Determinação de Acidez em Mosto
 *
 * 8 etapas · NaOH 1 mol/L · Bureta · Ponto final pH 8,7
 * Resultado em g H₂SO₄ / L
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Pipetar 50 mL de Mosto na Proveta',
    descricao: 'Arraste o frasco de mosto até a proveta para pipetar exatamente 50 mL da amostra homogeneizada.',
    item: 'mosto',
    alvo: 'proveta',
  },
  {
    id: 1,
    titulo: 'Transferir Proveta → Béquer 100 mL',
    descricao: 'Arraste a proveta com 50 mL até o béquer de 100 mL para transferir a amostra de mosto.',
    item: 'proveta',
    alvo: 'bequer',
  },
  {
    id: 2,
    titulo: 'Inserir Peixinho Químico no Béquer',
    descricao: 'Arraste a barra magnética (peixinho) até o béquer de 100 mL para possibilitar a agitação durante a titulação.',
    item: 'peixinho',
    alvo: 'bequer',
  },
  {
    id: 3,
    titulo: 'Posicionar o Béquer no Agitador Magnético',
    descricao: 'Arraste o béquer de 100 mL (com mosto e peixinho) até o agitador magnético para a titulação.',
    item: 'bequer',
    alvo: 'area_titulacao',
  },
  {
    id: 4,
    titulo: 'Imergir o Eletrodo de pH na Amostra',
    descricao: 'Arraste o eletrodo de pH até o agitador magnético para imergir o bulbo de vidro na amostra de mosto.',
    item: 'eletrodo',
    alvo: 'area_titulacao',
  },
  {
    id: 5,
    titulo: 'Preencher a Bureta com NaOH 1 mol/L',
    descricao: 'Arraste o frasco de Hidróxido de Sódio 1 mol/L até a bureta para preenchê-la com o titulante.',
    item: 'naoh',
    alvo: 'bureta',
  },
  {
    id: 6,
    titulo: 'Ligar o Agitador Magnético',
    descricao: 'Clique em "Ligar Agitador" para iniciar a agitação da amostra de mosto durante a titulação.',
    item: null,
    alvo: null,
  },
  {
    id: 7,
    titulo: 'Titular com NaOH 1 mol/L — Até pH 8,7',
    descricao: 'Clique na torneira da bureta para adicionar NaOH 1 mol/L gota a gota. Observe o pH subir até 8,7 (ponto final).',
    item: null,
    alvo: 'bureta',
  },
];
