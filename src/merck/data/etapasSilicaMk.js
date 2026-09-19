/**
 * etapasSilicaMk.js — Silicato (Ácido Silícico) — Kit Merck 100857
 *
 * 14 etapas · Spectroquant Prove 300 · Método 100857
 * Reagentes: R1 (0,5 mL) · R2 (4 gotas) · R3 (2,0 mL) · R4 (4 gotas)
 * Resultado em mg/L Si
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Confirmar Amostra',
    descricao: 'Verifique se a amostra está homogeneizada e livre de interferentes. Se necessário, realize diluição conforme indicação do kit. Confirme para iniciar a análise.',
    item: null,
    alvo: null,
  },
  {
    id: 1,
    titulo: 'Pipetar 5,0 mL de Amostra para o Tubo de Reação',
    descricao: 'Arraste o frasco de amostra até o tubo de reação para pipetar 5,0 mL da amostra preparada.',
    item: 'amostra',
    alvo: 'tubo_reacao',
  },
  {
    id: 2,
    titulo: 'Adicionar 0,5 mL de Reagente Silicato 1',
    descricao: 'Arraste o frasco de Reagente Silicato 1 até o tubo de reação para adicionar 0,5 mL com pipeta.',
    item: 'reagente1',
    alvo: 'tubo_reacao',
  },
  {
    id: 3,
    titulo: 'Adicionar 4 Gotas de Reagente Silicato 2',
    descricao: 'Arraste o frasco conta-gotas de Reagente Silicato 2 até o tubo de reação para adicionar exatamente 4 gotas.',
    item: 'reagente2',
    alvo: 'tubo_reacao',
  },
  {
    id: 4,
    titulo: 'Adicionar 2,0 mL de Reagente Silicato 3',
    descricao: 'Arraste o frasco de Reagente Silicato 3 até o tubo de reação para adicionar 2,0 mL com pipeta. Se indicado, ajuste o pH e filtre a amostra.',
    item: 'reagente3',
    alvo: 'tubo_reacao',
  },
  {
    id: 5,
    titulo: 'Aguardar Tempo de Reação 1',
    descricao: 'Aguarde o tempo de reação especificado pelo kit Merck 100857 para formação do complexo silicomolibdato.',
    item: null,
    alvo: null,
  },
  {
    id: 6,
    titulo: 'Adicionar 4 Gotas de Reagente Silicato 4',
    descricao: 'Arraste o frasco conta-gotas de Reagente Silicato 4 (reagente final — redutor) até o tubo de reação para adicionar 4 gotas.',
    item: 'reagente4',
    alvo: 'tubo_reacao',
  },
  {
    id: 7,
    titulo: 'Aguardar Tempo de Reação 2',
    descricao: 'Aguarde o segundo tempo de reação indicado pelo kit para desenvolvimento completo da cor azul do complexo Molibdênio Azul.',
    item: null,
    alvo: null,
  },
  {
    id: 8,
    titulo: 'Transferir Solução Reagida para a Cubeta',
    descricao: 'Arraste o tubo de reação até a cubeta de leitura para transferir a solução completamente reagida.',
    item: 'tubo_reacao',
    alvo: 'cubeta',
  },
  {
    id: 9,
    titulo: 'Preparar Cubeta do Branco com Água Destilada',
    descricao: 'Arraste o frasco de Água Destilada até a cubeta do branco para preparar a referência de zeragem.',
    item: 'agua_dest',
    alvo: 'cubeta_branco',
  },
  {
    id: 10,
    titulo: 'Inserir Cubeta do Branco no Spectroquant',
    descricao: 'Arraste a cubeta com água destilada até o compartimento do Spectroquant Prove 300 para calibração.',
    item: 'cubeta_branco',
    alvo: 'spectro',
  },
  {
    id: 11,
    titulo: 'Zerar o Equipamento — Selecionar Método 100857',
    descricao: 'Clique em ZERO para calibrar o equipamento com o branco de água destilada. O Spectroquant selecionará automaticamente o Método 100857.',
    item: null,
    alvo: 'spectro',
  },
  {
    id: 12,
    titulo: 'Inserir Cubeta da Amostra Reagida no Spectroquant',
    descricao: 'Arraste a cubeta com a amostra reagida até o compartimento de leitura do Spectroquant Prove 300.',
    item: 'cubeta',
    alvo: 'spectro',
  },
  {
    id: 13,
    titulo: 'Realizar Leitura — Silicato (mg/L Si)',
    descricao: 'Clique em LER para realizar a leitura de concentração de Silicato (Ácido Silícico) pelo Método 100857. Registre o resultado em mg/L Si.',
    item: null,
    alvo: 'spectro',
  },
];
