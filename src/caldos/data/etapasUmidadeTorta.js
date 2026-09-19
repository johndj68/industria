/**
 * etapasUmidadeTorta.js — Etapas do Simulador Umidade da Torta de Filtro
 *
 * 7 etapas · Método Estufa Spencer 100 °C · 30 min · Amostra 10 g
 * Norma CONSECANA · Fórmula: %Umidade = (P1 − P2) × 10
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Posicionar o Cesto na Balança',
    descricao: 'Arraste o cesto da estufa Spencer para a balança de precisão para verificar o peso e preparar a taragem.',
    itemNecessario: 'cesto',
    alvo: 'balanca',
  },
  {
    id: 1,
    titulo: 'Zerar a Balança (Tarar)',
    descricao: 'Clique no botão TARAR para zerar a balança com o cesto posicionado. O display deve mostrar 0,0 g.',
    itemNecessario: null,
    alvo: 'balanca',
  },
  {
    id: 2,
    titulo: 'Pesar 10 g de Torta de Filtro',
    descricao: 'Arraste a amostra de torta de filtro homogeneizada para a balança e distribua no cesto. Pese exatamente 10 g.',
    itemNecessario: 'torta',
    alvo: 'balanca',
  },
  {
    id: 3,
    titulo: 'Registrar o Peso Inicial P1',
    descricao: 'Arraste o cesto com a amostra úmida para a balança sem tarar. Registre o peso inicial P1 (cesto + amostra úmida).',
    itemNecessario: 'cesto',
    alvo: 'balanca',
  },
  {
    id: 4,
    titulo: 'Ligar a Estufa Spencer',
    descricao: 'Clique na estufa Spencer para ligá-la. Aguarde atingir 100 °C antes de colocar a amostra.',
    itemNecessario: null,
    alvo: 'estufa',
  },
  {
    id: 5,
    titulo: 'Secar na Estufa por 30 min',
    descricao: 'Arraste o cesto com a amostra para a estufa Spencer. O sistema realizará a secagem por 30 minutos a 100 °C.',
    itemNecessario: 'cesto',
    alvo: 'estufa',
  },
  {
    id: 6,
    titulo: 'Registrar o Peso Final P2',
    descricao: 'Retire o cesto da estufa e arraste para a balança. Registre o peso final P2 (cesto + amostra seca).',
    itemNecessario: 'cesto',
    alvo: 'balanca',
  },
];
