/**
 * etapasPolBagaco.js — Etapas do Simulador Pol do Bagaço Residual
 *
 * 12 etapas do método de extração aquosa + sacarimetria direta.
 * Norma: CONSECANA · 100 g / 1000 mL H₂O · Digestor 15 min · 80 °C.
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Posicionar o Coletor',
    descricao: 'Arraste o coletor para a balança analítica para iniciar a pesagem do bagaço.',
    itemNecessario: 'coletor',
    alvo: 'balanca',
  },
  {
    id: 1,
    titulo: 'Pesar Bagaço de Cana',
    descricao: 'Arraste o bagaço de cana desintegrado e homogeneizado para o coletor na balança. Pese exatamente 100 g.',
    itemNecessario: 'bagaco',
    alvo: 'balanca',
  },
  {
    id: 2,
    titulo: 'Transferir para o Copo do Digestor',
    descricao: 'Arraste o coletor com os 100 g de bagaço pesados para o copo do digestor.',
    itemNecessario: 'coletor',
    alvo: 'copo-digestor',
  },
  {
    id: 3,
    titulo: 'Adicionar Água Desmineralizada',
    descricao: 'Arraste a água desmineralizada para o copo do digestor. Adicione 1000 mL (1 litro) de água.',
    itemNecessario: 'agua',
    alvo: 'copo-digestor',
  },
  {
    id: 4,
    titulo: 'Acoplar ao Digestor',
    descricao: 'Arraste o copo do digestor para o equipamento digestor e encaixe corretamente.',
    itemNecessario: 'copo-digestor',
    alvo: 'digestor',
  },
  {
    id: 5,
    titulo: 'Ligar o Digestor',
    descricao: 'Clique no digestor para ligá-lo. O sistema aguardará 15 minutos de extração automática a 80 °C.',
    itemNecessario: null,
    alvo: 'digestor',
  },
  {
    id: 6,
    titulo: 'Filtrar na Peneira',
    descricao: 'Arraste o copo do digestor para a peneira / funil de tela. Recolha cerca de 400 mL do extrato filtrado.',
    itemNecessario: 'copo-digestor',
    alvo: 'peneira',
  },
  {
    id: 7,
    titulo: 'Separar 200 mL do Extrato',
    descricao: 'Arraste o béquer com o extrato filtrado para o béquer de 200 mL para separar a alíquota de análise.',
    itemNecessario: 'bequer-filtrado',
    alvo: 'bequer-200',
  },
  {
    id: 8,
    titulo: 'Coletar Mistura Clarificante',
    descricao: 'Arraste a espátula até a mistura clarificante para coletar aproximadamente 1 g.',
    itemNecessario: 'espatula',
    alvo: 'clarificante',
  },
  {
    id: 9,
    titulo: 'Adicionar Clarificante ao Extrato',
    descricao: 'Arraste a espátula com o clarificante para o béquer de 200 mL e agite bem até homogeneizar.',
    itemNecessario: 'espatula',
    alvo: 'bequer-200',
  },
  {
    id: 10,
    titulo: 'Filtrar com Papel Filtro',
    descricao: 'Arraste o béquer de 200 mL para o funil com papel filtro. Despreze os primeiros 10 mL do filtrado.',
    itemNecessario: 'bequer-200',
    alvo: 'funil-papel',
  },
  {
    id: 11,
    titulo: 'Leitura Sacarimétrica',
    descricao: 'Arraste o béquer com o filtrado clarificado para o sacarímetro e realize a leitura em graus Ventzke (°Z).',
    itemNecessario: 'bequer-leitura',
    alvo: 'sacarimetro',
  },
];
