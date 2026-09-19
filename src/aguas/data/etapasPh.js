/**
 * etapasPh.js — Determinação de pH em Águas
 *
 * 7 etapas · Béquer 50 mL · pHmetro · Eletrodo de pH
 * Resultado em unidades de pH (0–14)
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Adicionar Amostra ao Béquer de 50 mL',
    descricao: 'Arraste o frasco de amostra até o Béquer de 50 mL para transferir a amostra a ser analisada.',
    item: 'amostra',
    alvo: 'bequer',
  },
  {
    id: 1,
    titulo: 'Resfriar a Amostra até Temperatura Ambiente',
    descricao: 'Clique em "Resfriar" para aguardar que a amostra atinja a temperatura ambiente antes da leitura de pH.',
    item: null,
    alvo: null,
  },
  {
    id: 2,
    titulo: 'Verificar Certificado de Calibração do pHmetro',
    descricao: 'Clique em "Verificar Certificado" para confirmar que o pHmetro está calibrado com os tampões de referência e dentro da validade.',
    item: null,
    alvo: null,
  },
  {
    id: 3,
    titulo: 'Imergir Eletrodo de pH na Amostra',
    descricao: 'Arraste o eletrodo de pH até o Béquer para imergir o bulbo de vidro na amostra até cobri-lo completamente.',
    item: 'eletrodo',
    alvo: 'bequer',
  },
  {
    id: 4,
    titulo: 'Aguardando Estabilização da Leitura de pH',
    descricao: 'Aguarde a estabilização da leitura. O pHmetro está ajustando ao equilíbrio com a amostra (compensação de temperatura).',
    item: null,
    alvo: null,
  },
  {
    id: 5,
    titulo: 'Realizar Leitura do pH da Amostra',
    descricao: 'Clique em "Ler pH" no pHmetro para registrar o valor de pH da amostra.',
    item: null,
    alvo: 'phmetro',
  },
  {
    id: 6,
    titulo: 'Registrar o Resultado de pH',
    descricao: 'Leitura concluída. Anote o valor de pH obtido e encerre a análise.',
    item: null,
    alvo: null,
  },
];
