/**
 * etapasImpurezaBagaco.js — Determinação de Impureza Mineral no Bagaço
 *
 * 8 etapas · Método Mufla · Incineração completa
 * Fórmulas:
 *   % Terra = ((PF − PI) / PA) × 100
 *   Kg Terra/t = ((PF − PI) / PA) × 1000
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Tarar a Balança Analítica',
    descricao: 'Clique no botão TARAR para zerar a balança analítica antes de iniciar as pesagens.',
    itemNecessario: null,
    alvo: 'balanca',
  },
  {
    id: 1,
    titulo: 'Pesar o Cadinho — Registrar PI',
    descricao: 'Arraste o cadinho de porcelana limpo e seco para a balança analítica. Registre o peso inicial PI.',
    itemNecessario: 'cadinho',
    alvo: 'balanca',
  },
  {
    id: 2,
    titulo: 'Tarar a Balança com o Cadinho',
    descricao: 'Com o cadinho posicionado, clique em TARAR para zerar a balança e considerar apenas o peso da amostra.',
    itemNecessario: null,
    alvo: 'balanca',
  },
  {
    id: 3,
    titulo: 'Pesar ≈30 g de Bagaço — Registrar PA',
    descricao: 'Arraste a amostra composta de bagaço residual para o cadinho na balança. Pese aproximadamente 30 g ± 0,1 g.',
    itemNecessario: 'bagaco',
    alvo: 'balanca',
  },
  {
    id: 4,
    titulo: 'Inserir Cadinho na Mufla',
    descricao: 'Arraste o cadinho com a amostra de bagaço para a mufla para iniciar a incineração.',
    itemNecessario: 'cadinho',
    alvo: 'mufla',
  },
  {
    id: 5,
    titulo: 'Ligar a Mufla — Incineração',
    descricao: 'Clique na mufla para ligá-la. A incineração ocorrerá até a queima completa do material. Aguarde o pré-resfriamento automático.',
    itemNecessario: null,
    alvo: 'mufla',
  },
  {
    id: 6,
    titulo: 'Transferir Cadinho ao Dessecador',
    descricao: 'Arraste o cadinho com o resíduo mineral para o dessecador. Aguarde atingir temperatura ambiente.',
    itemNecessario: 'cadinho',
    alvo: 'dessecador',
  },
  {
    id: 7,
    titulo: 'Pesar Resíduo Mineral — Registrar PF',
    descricao: 'Arraste o cadinho resfriado para a balança analítica. Registre o peso final PF (cadinho + resíduo mineral).',
    itemNecessario: 'cadinho',
    alvo: 'balanca',
  },
];
