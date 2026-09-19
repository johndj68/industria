/**
 * etapasCondutividadeAlcool.js — Determinação de Condutividade em Álcool e STD/TDS
 *
 * 7 etapas · Béquer 50 mL · Condutivímetro · Eletrodo de Condutividade
 * Resultado em µS/cm (condutividade) e mg/L (STD/TDS)
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
    titulo: 'Resfriar a Amostra até Temperatura Ambiente',
    descricao: 'Clique em "Resfriar" para aguardar que a amostra de álcool atinja a temperatura ambiente antes da medição de condutividade.',
    item: null,
    alvo: null,
  },
  {
    id: 2,
    titulo: 'Verificar Certificado de Calibração do Condutivímetro',
    descricao: 'Clique em "Verificar Certificado" para confirmar que o condutivímetro está calibrado com o padrão de referência e dentro da validade.',
    item: null,
    alvo: null,
  },
  {
    id: 3,
    titulo: 'Imergir Eletrodo de Condutividade na Amostra',
    descricao: 'Arraste o eletrodo de condutividade até o Béquer para imergir o bulbo de vidro na amostra de álcool até cobri-lo.',
    item: 'eletrodo',
    alvo: 'bequer',
  },
  {
    id: 4,
    titulo: 'Aguardando Estabilização da Leitura',
    descricao: 'Aguarde a estabilização da leitura. O condutivímetro está ajustando ao equilíbrio com a amostra de álcool (compensação de temperatura).',
    item: null,
    alvo: null,
  },
  {
    id: 5,
    titulo: 'Realizar Leitura de Condutividade e STD/TDS',
    descricao: 'Clique em "Ler Condutividade" no condutivímetro para registrar os valores de condutividade e Sólidos Totais Dissolvidos da amostra.',
    item: null,
    alvo: 'condutivimetro',
  },
  {
    id: 6,
    titulo: 'Registrar os Resultados da Análise',
    descricao: 'Leitura concluída. Anote os valores de Condutividade (µS/cm) e Sólidos Totais Dissolvidos — STD/TDS (mg/L).',
    item: null,
    alvo: null,
  },
];
