/**
 * etapasNaftol.js — Determinação de Açúcar em Águas — Alfa Naftol (Qualitativo)
 *
 * 7 etapas · Indicador Alfa Naftol + H₂SO₄ concentrado
 * Resultado: formação de anel roxo = presença de açúcar
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Adicionar Amostra ao Tubo de Ensaio',
    descricao: 'Arraste o frasco de amostra até o tubo de ensaio para transferir 5 mL.',
    item: 'amostra',
    alvo: 'tubo',
  },
  {
    id: 1,
    titulo: 'Adicionar 3 Gotas de Alfa Naftol',
    descricao: 'Arraste o frasco de Alfa Naftol até o tubo de ensaio para adicionar exatamente 3 gotas do indicador.',
    item: 'alfaNaftol',
    alvo: 'tubo',
  },
  {
    id: 2,
    titulo: 'Agitar e Homogeneizar',
    descricao: 'Clique no tubo de ensaio para agitar e homogeneizar a solução com o indicador.',
    item: null,
    alvo: 'tubo',
  },
  {
    id: 3,
    titulo: 'Adicionar Vagarosamente H₂SO₄ Concentrado',
    descricao: 'Arraste o frasco de H₂SO₄ concentrado até o tubo. O ácido deve ser adicionado lentamente pela parede do tubo (~2 mL).',
    item: 'acido',
    alvo: 'tubo',
  },
  {
    id: 4,
    titulo: 'Agitar Levemente e Observar',
    descricao: 'Clique no tubo para agitar levemente. Observe a formação do anel roxo na interface das duas fases.',
    item: null,
    alvo: 'tubo',
  },
  {
    id: 5,
    titulo: 'Anotar o Resultado Qualitativo',
    descricao: 'Anel roxo formado na interface! Clique em "Anotar Resultado" para registrar o resultado qualitativo da análise.',
    item: null,
    alvo: null,
  },
  {
    id: 6,
    titulo: 'Análise Concluída',
    descricao: 'Resultado: presença de açúcar detectada — formação de anel roxo na interface das fases.',
    item: null,
    alvo: null,
  },
];
