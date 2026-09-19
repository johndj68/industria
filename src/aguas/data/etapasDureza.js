/**
 * etapasDureza.js — Protocolo de Determinação da Dureza Total Dissolvida
 *
 * 9 etapas · Solução Tampão + Negro de Eriocromo + EDTA
 * Viragem: vinho/arroxeado → azul
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Medir 50 mL de Amostra',
    descricao: 'Arraste o frasco de amostra até a proveta para medir 50 mL.',
    item: 'amostra',
    alvo: 'proveta',
  },
  {
    id: 1,
    titulo: 'Transferir para o Erlenmeyer',
    descricao: 'Arraste a proveta até o Erlenmeyer de 125 mL para transferir os 50 mL.',
    item: 'proveta',
    alvo: 'erlenmeyer',
  },
  {
    id: 2,
    titulo: 'Adicionar Solução Tampão',
    descricao: 'Arraste o frasco de Solução Tampão até o Erlenmeyer para adicionar 5 mL e homogeneizar.',
    item: 'tampao',
    alvo: 'erlenmeyer',
  },
  {
    id: 3,
    titulo: 'Coletar Negro de Eriocromo com a Espátula',
    descricao: 'Arraste a espátula até o frasco de Negro de Eriocromo para coletar o indicador em pó.',
    item: 'espatula',
    alvo: 'negro_eriocromo',
  },
  {
    id: 4,
    titulo: 'Adicionar Indicador ao Erlenmeyer',
    descricao: 'Arraste a espátula com o pó até o Erlenmeyer e homogeneíze. A solução ficará vinho/arroxeada.',
    item: 'espatula',
    alvo: 'erlenmeyer',
  },
  {
    id: 5,
    titulo: 'Carregar Bureta com EDTA',
    descricao: 'Arraste o frasco de EDTA até a bureta para preenchê-la com o titulante.',
    item: 'edta',
    alvo: 'bureta',
  },
  {
    id: 6,
    titulo: 'Posicionar Erlenmeyer na Plataforma',
    descricao: 'Arraste o Erlenmeyer até a plataforma abaixo da bureta para iniciar a titulação.',
    item: 'erlenmeyer',
    alvo: 'areaTitulacao',
  },
  {
    id: 7,
    titulo: 'Titular com EDTA até a Cor Azul',
    descricao: 'Clique na torneira da bureta para adicionar EDTA gota a gota. Observe a viragem de vinho para azul.',
    item: null,
    alvo: 'bureta',
  },
  {
    id: 8,
    titulo: 'Anotar o Volume Gasto',
    descricao: 'Titulação concluída! Ponto final atingido (cor azul). Registre o volume de EDTA gasto.',
    item: null,
    alvo: null,
  },
];
