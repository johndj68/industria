/**
 * etapasPhAlcool.js — Determinação de pH em Álcool
 *
 * 6 etapas · pHmetro HACH HQd · Eletrodo IntelliCAL PHC101
 * Faixa de conformidade: pH 6,0 a 8,0
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Adicionar Amostra de Álcool ao Béquer de 50 mL',
    descricao: 'Arraste o frasco de amostra de álcool até o Béquer de 50 mL para transferir a amostra a ser analisada.',
    item: 'amostra',
    alvo: 'bequer',
  },
  {
    id: 1,
    titulo: 'Verificar Certificado de Calibração do pHmetro',
    descricao: 'Clique em "Verificar Certificado" para confirmar que o pHmetro está calibrado com os tampões de referência e dentro da validade.',
    item: null,
    alvo: null,
  },
  {
    id: 2,
    titulo: 'Imergir Eletrodo de pH na Amostra de Álcool',
    descricao: 'Arraste o eletrodo de pH até o Béquer para imergir o bulbo de vidro na amostra de álcool até cobri-lo completamente.',
    item: 'eletrodo',
    alvo: 'bequer',
  },
  {
    id: 3,
    titulo: 'Aguardando Estabilização da Leitura de pH',
    descricao: 'Aguarde a estabilização da leitura. O pHmetro está ajustando ao equilíbrio com a amostra de álcool.',
    item: null,
    alvo: null,
  },
  {
    id: 4,
    titulo: 'Realizar Leitura do pH da Amostra de Álcool',
    descricao: 'Clique em "Ler pH" no pHmetro para registrar o valor de pH da amostra de álcool. Faixa de conformidade: pH 6,0 a 8,0.',
    item: null,
    alvo: 'phmetro',
  },
  {
    id: 5,
    titulo: 'Registrar o Resultado e Avaliar Conformidade',
    descricao: 'Leitura concluída. Avalie se o pH está dentro da faixa de conformidade (6,0 a 8,0) e registre o resultado.',
    item: null,
    alvo: null,
  },
];
