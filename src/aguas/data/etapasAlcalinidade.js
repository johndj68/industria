/**
 * etapasAlcalinidade.js — Protocolo de Determinação de Alcalinidade Total
 *
 * 7 etapas · Alaranjado de Metila + H₂SO₄ 0,1 N ou 0,02 N · pH 4,3
 * Fonte: COR-IND-QUA-PO-07 — Página 24
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Medir 50 mL de Amostra',
    descricao: 'Arraste o frasco de amostra até a proveta de 50 mL para medir o volume correto.',
    item: 'amostra',
    alvo: 'proveta',
  },
  {
    id: 1,
    titulo: 'Transferir para o Erlenmeyer',
    descricao: 'Arraste a proveta até o Erlenmeyer para transferir os 50 mL de amostra.',
    item: 'proveta',
    alvo: 'erlenmeyer',
  },
  {
    id: 2,
    titulo: 'Adicionar Alaranjado de Metila',
    descricao: 'Arraste o frasco de Alaranjado de Metila até o Erlenmeyer para adicionar algumas gotas do indicador.',
    item: 'alaranjado',
    alvo: 'erlenmeyer',
  },
  {
    id: 3,
    titulo: 'Preencher a Bureta com H₂SO₄',
    descricao: 'Arraste o frasco de Ácido Sulfúrico até a bureta para preenchê-la com o titulante.',
    item: 'acido',
    alvo: 'bureta',
  },
  {
    id: 4,
    titulo: 'Levar para a Área de Titulação',
    descricao: 'Arraste o Erlenmeyer até a plataforma abaixo da bureta para iniciar a titulação com H₂SO₄.',
    item: 'erlenmeyer',
    alvo: 'areaTitulacao',
  },
  {
    id: 5,
    titulo: 'Titular com Ácido Sulfúrico',
    descricao: 'Clique na torneira da bureta para adicionar H₂SO₄ gota a gota. Observe a mudança de laranja para laranja-salmão (pH 4,3).',
    item: null,
    alvo: 'bureta',
  },
  {
    id: 6,
    titulo: 'Anotar o Volume Gasto',
    descricao: 'Titulação concluída! Ponto final atingido (cor laranja-salmão). Registre o volume de H₂SO₄ gasto para calcular a Alcalinidade Total.',
    item: null,
    alvo: null,
  },
];
