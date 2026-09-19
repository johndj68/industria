/**
 * etapasAcidesDorna.js — Determinação de Acidez Sulfúrica — Cubas e Dornas
 *
 * 15 etapas · Kitassato · Vácuo 25" Hg · Agitador Magnético
 * NaOH 1 mol/L · Bureta · Ponto final pH 8,7 · g H₂SO₄/L
 */
export const etapas = [
  // ── Fase 1: Degaseificação (CO₂) ──────────────────────────────────────────
  {
    id: 0,
    titulo: 'Transferir Vinho para a Proveta',
    descricao: 'Arraste o frasco de vinho até a proveta para medir aproximadamente 100 mL da amostra.',
    item: 'vinho',
    alvo: 'proveta',
  },
  {
    id: 1,
    titulo: 'Transferir Proveta → Kitassato (~100 mL)',
    descricao: 'Arraste a proveta com vinho até o kitassato para transferir aproximadamente 100 mL.',
    item: 'proveta',
    alvo: 'kitassato',
  },
  {
    id: 2,
    titulo: 'Inserir Peixinho Químico no Kitassato',
    descricao: 'Arraste a barra magnética (peixinho) até o kitassato para possibilitar a agitação durante o vácuo.',
    item: 'peixinho_a',
    alvo: 'kitassato',
  },
  {
    id: 3,
    titulo: 'Posicionar o Kitassato no Agitador Magnético',
    descricao: 'Arraste o kitassato (com vinho e peixinho) até o agitador magnético, apoiando-o na base.',
    item: 'kitassato',
    alvo: 'area_titulacao',
  },
  {
    id: 4,
    titulo: 'Conectar a Mangueira da Bomba de Vácuo ao Kitassato',
    descricao: 'Arraste a mangueira da bomba de vácuo até o agitador magnético (onde o kitassato está apoiado) para acoplar ao bocal lateral.',
    item: 'mangueira',
    alvo: 'area_titulacao',
  },
  {
    id: 5,
    titulo: 'Aplicar Vácuo 25" Hg e Agitar por 5 Minutos',
    descricao: 'Clique em "Ligar Vácuo" para ajustar a 25" Hg e iniciar agitação por 5 minutos, eliminando o CO₂.',
    item: null,
    alvo: null,
  },

  // ── Fase 2: Preparo do Béquer ──────────────────────────────────────────────
  {
    id: 6,
    titulo: 'Transferir 50 mL do Kitassato para a Proveta',
    descricao: 'Arraste o kitassato até a proveta para coletar exatamente 50 mL da amostra degaseificada.',
    item: 'kitassato',
    alvo: 'proveta',
  },
  {
    id: 7,
    titulo: 'Transferir Proveta → Béquer de 100 mL',
    descricao: 'Arraste a proveta com 50 mL até o béquer de 100 mL para transferir a amostra.',
    item: 'proveta',
    alvo: 'bequer',
  },
  {
    id: 8,
    titulo: 'Inserir Peixinho Químico no Béquer',
    descricao: 'Arraste a barra magnética (peixinho) até o béquer de 100 mL para permitir a agitação na titulação.',
    item: 'peixinho_b',
    alvo: 'bequer',
  },
  {
    id: 9,
    titulo: 'Posicionar o Béquer no Agitador Magnético',
    descricao: 'Arraste o béquer de 100 mL (com amostra e peixinho) até o agitador magnético para a titulação.',
    item: 'bequer',
    alvo: 'area_titulacao',
  },

  // ── Fase 3: Montagem e Titulação ───────────────────────────────────────────
  {
    id: 10,
    titulo: 'Imergir o Eletrodo de pH na Amostra',
    descricao: 'Arraste o eletrodo de pH até o agitador magnético (onde o béquer está apoiado) para imergir o bulbo de vidro na amostra.',
    item: 'eletrodo',
    alvo: 'area_titulacao',
  },
  {
    id: 11,
    titulo: 'Carregar a Bureta com NaOH 1 mol/L',
    descricao: 'Arraste o frasco de NaOH 1 mol/L até a bureta para preenchê-la com o titulante.',
    item: 'naoh',
    alvo: 'bureta',
  },
  {
    id: 12,
    titulo: 'Ligar o Agitador Magnético',
    descricao: 'Clique em "Ligar Agitador" para iniciar a agitação da amostra durante a titulação.',
    item: null,
    alvo: null,
  },
  {
    id: 13,
    titulo: 'Titular com NaOH 1 mol/L — Até pH 8,7',
    descricao: 'Clique na torneira da bureta para adicionar NaOH 1 mol/L gota a gota. Observe o pH subir até 8,7 (ponto final).',
    item: null,
    alvo: 'bureta',
  },
];
