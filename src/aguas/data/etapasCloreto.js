/**
 * etapasCloreto.js — Protocolo de Determinação de Cloretos em Águas
 *
 * 10 etapas · Cromato de Potássio + AgNO₃ 0,1 N ou 0,02 N
 * Viragem: amarelo vivo → mostarda
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Medir 50 mL de Amostra',
    descricao: 'Arraste o frasco de Amostra até a proveta para medir 50 mL.',
    item: 'amostra',
    alvo: 'proveta',
  },
  {
    id: 1,
    titulo: 'Transferir para o Erlenmeyer Branco',
    descricao: 'Arraste a proveta até o Erlenmeyer Branco para transferir os 50 mL.',
    item: 'proveta',
    alvo: 'erlenmeyer_branco',
  },
  {
    id: 2,
    titulo: 'Medir 50 mL de Água Desmineralizada',
    descricao: 'Arraste o frasco de Água Desmineralizada até a proveta para medir 50 mL.',
    item: 'agua',
    alvo: 'proveta',
  },
  {
    id: 3,
    titulo: 'Transferir para o Erlenmeyer Amostra',
    descricao: 'Arraste a proveta até o Erlenmeyer Amostra para transferir os 50 mL.',
    item: 'proveta',
    alvo: 'erlenmeyer_amostra',
  },
  {
    id: 4,
    titulo: 'Adicionar Fenolftaleína',
    descricao: 'Arraste o frasco de Fenolftaleína até o Erlenmeyer Amostra para adicionar 3 gotas.',
    item: 'fenol',
    alvo: 'erlenmeyer_amostra',
  },
  {
    id: 5,
    titulo: 'Adicionar Cromato de Potássio 5% e Homogeneizar',
    descricao: 'Arraste o Cromato de Potássio até o Erlenmeyer Amostra. A solução ficará amarelo vivo.',
    item: 'cromato',
    alvo: 'erlenmeyer_amostra',
  },
  {
    id: 6,
    titulo: 'Carregar Bureta com Nitrato de Prata',
    descricao: 'Arraste o frasco de Nitrato de Prata até a bureta para preenchê-la com o titulante.',
    item: 'nitrato',
    alvo: 'bureta',
  },
  {
    id: 7,
    titulo: 'Posicionar Erlenmeyer na Plataforma',
    descricao: 'Arraste o Erlenmeyer Amostra até a plataforma abaixo da bureta.',
    item: 'erlenmeyer_amostra',
    alvo: 'areaTitulacao',
  },
  {
    id: 8,
    titulo: 'Titular com Nitrato de Prata',
    descricao: 'Clique na torneira da bureta para adicionar AgNO₃ gota a gota. Observe a mudança de amarelo vivo para mostarda.',
    item: null,
    alvo: 'bureta',
  },
  {
    id: 9,
    titulo: 'Anotar o Volume Gasto',
    descricao: 'Titulação concluída! Ponto final atingido (cor mostarda). Registre o volume de AgNO₃ gasto.',
    item: null,
    alvo: null,
  },
];
