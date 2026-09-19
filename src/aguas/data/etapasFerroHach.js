/**
 * etapasFerroHach.js — Determinação de Ferro Total — Método HACH / FerroVer
 *
 * 12 etapas · Reagente FerroVer · Cubeta 25 mm · Timer 3 min
 * Leitura em mg/L Fe · HACH Method 8008
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Leve a Amostra até a Cubeta 25 mm',
    descricao: 'Arraste o frasco de amostra até a cubeta de 25 mm para adicionar a amostra de água.',
    item: 'amostra',
    alvo: 'cubeta_amostra',
  },
  {
    id: 1,
    titulo: 'Adicionar Reagente FerroVer à Cubeta',
    descricao: 'Arraste o sachê de FerroVer até a cubeta da amostra e adicione todo o conteúdo do pacote.',
    item: 'ferroVer',
    alvo: 'cubeta_amostra',
  },
  {
    id: 2,
    titulo: 'Homogeneizar Girando Suavemente',
    descricao: 'Clique em "Homogeneizar" para girar suavemente a cubeta e dissolver o reagente FerroVer.',
    item: null,
    alvo: null,
  },
  {
    id: 3,
    titulo: 'Aguardar 3 Minutos de Reação',
    descricao: 'Aguarde 3 minutos para a reação do FerroVer. A coloração laranja irá se desenvolver na presença de ferro.',
    item: null,
    alvo: null,
  },
  {
    id: 4,
    titulo: 'Preparar Cubeta do Branco',
    descricao: 'Arraste o frasco de amostra até a cubeta do branco para preparar a referência sem reagente.',
    item: 'amostra',
    alvo: 'cubeta_branco',
  },
  {
    id: 5,
    titulo: 'Limpar a Parede Externa da Cubeta do Branco',
    descricao: 'Clique em "Limpar" para limpar a parede externa da cubeta do branco com papel absorvente.',
    item: null,
    alvo: null,
  },
  {
    id: 6,
    titulo: 'Inserir Cubeta do Branco no Equipamento',
    descricao: 'Arraste a cubeta do branco até o compartimento de leitura do equipamento HACH.',
    item: 'cubeta_branco',
    alvo: 'fotometro',
  },
  {
    id: 7,
    titulo: 'Pressionar ZERO — Ajustar Branco',
    descricao: 'Clique em ZERO para ajustar o equipamento com o branco de referência (0,00 mg/L Fe).',
    item: null,
    alvo: 'fotometro',
  },
  {
    id: 8,
    titulo: 'Limpar a Parede Externa da Cubeta da Amostra',
    descricao: 'Clique em "Limpar" para limpar a parede externa da cubeta da amostra com papel absorvente.',
    item: null,
    alvo: null,
  },
  {
    id: 9,
    titulo: 'Inserir Cubeta da Amostra no Equipamento',
    descricao: 'Arraste a cubeta da amostra até o compartimento de leitura do equipamento HACH.',
    item: 'cubeta_amostra',
    alvo: 'fotometro',
  },
  {
    id: 10,
    titulo: 'Pressionar LER — Realizar Leitura',
    descricao: 'Clique em LER para realizar a leitura do Ferro Total em mg/L Fe.',
    item: null,
    alvo: 'fotometro',
  },
  {
    id: 11,
    titulo: 'Anotar o Resultado em mg/L Fe',
    descricao: 'Leitura concluída. Registre o resultado de Ferro Total em mg/L Fe obtido pelo Método FerroVer.',
    item: null,
    alvo: null,
  },
];
