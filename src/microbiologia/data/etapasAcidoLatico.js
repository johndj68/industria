/**
 * etapasAcidoLatico.js — Determinação de Ácido Lático
 *
 * 9 etapas · Centrifugação + Fita + Leitor · Fator 90
 * Fonte: ATV-OPE-GQI-PR-002 — Página 182
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Transferir Amostra ao Tubo de Ensaio',
    descricao: 'Arraste o frasco de amostra até o tubo de ensaio para iniciar o preparo.',
    item: 'amostra',
    alvo: 'tubo',
  },
  {
    id: 1,
    titulo: 'Levar Tubo à Centrífuga',
    descricao: 'Arraste o tubo de ensaio com amostra até o compartimento da centrífuga.',
    item: 'tubo',
    alvo: 'centrifuga',
  },
  {
    id: 2,
    titulo: 'Ligar a Centrífuga',
    descricao: 'Clique na centrífuga para iniciar a centrifugação e separar o sobrenadante.',
    item: null,
    alvo: 'centrifuga',
  },
  {
    id: 3,
    titulo: 'Selecionar Ponteira P1000',
    descricao: 'Clique na ponteira P1000 (amarela) no rack para acoplar à micropipeta.',
    item: 'rack',
    alvo: 'rack',
  },
  {
    id: 4,
    titulo: 'Coletar Sobrenadante com a Pipeta',
    descricao: 'Arraste a micropipeta até o tubo centrifugado para aspirar o sobrenadante.',
    item: 'pipeta',
    alvo: 'tubo',
  },
  {
    id: 5,
    titulo: 'Aplicar 1 Gota na Fita de Determinação',
    descricao: 'Arraste a micropipeta até a fita de determinação para aplicar 1 gota.',
    item: 'pipeta',
    alvo: 'fita',
  },
  {
    id: 6,
    titulo: 'Inserir Fita no Leitor',
    descricao: 'Arraste a fita de determinação até o leitor de ácido lático para inserção.',
    item: 'fita',
    alvo: 'leitor',
  },
  {
    id: 7,
    titulo: 'Realizar Leitura no Equipamento',
    descricao: 'Clique no leitor para iniciar a leitura e obter o resultado bruto.',
    item: null,
    alvo: 'leitor',
  },
  {
    id: 8,
    titulo: 'Registrar Resultado Final',
    descricao: 'Leitura concluída! Registre o resultado de ácido lático em ppm (Resultado × 90).',
    item: null,
    alvo: null,
  },
];
