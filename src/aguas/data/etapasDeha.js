/**
 * etapasDeha.js — Protocolo de Determinação de Sequestrante de Oxigênio (DEHA)
 *
 * 19 etapas · Branco + Amostra · DEHA 1 + DEHA 2 · Reação 10 min no escuro
 * Leitura: ppb DEHA · Fotômetro HACH DR900
 */
export const etapas = [
  // ── Fase 1: Preparo do Branco ─────────────────────────────────────────────
  {
    id: 0,
    titulo: 'Medir Água Desmineralizada (25 mL)',
    descricao: 'Arraste o frasco de Água Tipo 2 até a proveta para medir 25 mL.',
    item: 'agua',
    alvo: 'proveta',
  },
  {
    id: 1,
    titulo: 'Transferir Proveta → Copo Branco',
    descricao: 'Arraste a proveta com 25 mL até o Copo Branco para transferir a água.',
    item: 'proveta',
    alvo: 'copobranco',
  },

  // ── Fase 2: Preparo da Amostra ────────────────────────────────────────────
  {
    id: 2,
    titulo: 'Medir Amostra (25 mL)',
    descricao: 'Arraste o frasco de Amostra até a proveta para medir 25 mL.',
    item: 'amostra',
    alvo: 'proveta',
  },
  {
    id: 3,
    titulo: 'Transferir Proveta → Copo Amostra',
    descricao: 'Arraste a proveta com 25 mL até o Copo Amostra para transferir a amostra.',
    item: 'proveta',
    alvo: 'copoamostra',
  },

  // ── Fase 3: Adição de DEHA 1 ─────────────────────────────────────────────
  {
    id: 4,
    titulo: 'Adicionar DEHA 1 ao Copo Branco',
    descricao: 'Arraste o sachê DEHA 1 até o Copo Branco para adicionar o reagente em pó.',
    item: 'deha1',
    alvo: 'copobranco',
  },
  {
    id: 5,
    titulo: 'Adicionar DEHA 1 ao Copo Amostra',
    descricao: 'Arraste o sachê DEHA 1 até o Copo Amostra para adicionar o reagente.',
    item: 'deha1',
    alvo: 'copoamostra',
  },

  // ── Fase 4: Adição de DEHA 2 ─────────────────────────────────────────────
  {
    id: 6,
    titulo: 'Adicionar DEHA 2 ao Copo Branco',
    descricao: 'Arraste o frasco DEHA 2 até o Copo Branco para adicionar 0,5 mL.',
    item: 'deha2',
    alvo: 'copobranco',
  },
  {
    id: 7,
    titulo: 'Adicionar DEHA 2 ao Copo Amostra',
    descricao: 'Arraste o frasco DEHA 2 até o Copo Amostra para adicionar 0,5 mL.',
    item: 'deha2',
    alvo: 'copoamostra',
  },

  // ── Fase 5: Tampar e homogeneizar (auto-timer 1.5 s) ─────────────────────
  {
    id: 8,
    titulo: 'Tampar e Homogeneizar Suavemente',
    descricao: 'Tampando os copos e homogeneizando suavemente...',
    item: null,
    alvo: null,
  },

  // ── Fase 6: Caixa escura ──────────────────────────────────────────────────
  {
    id: 9,
    titulo: 'Levar Copo Branco à Caixa Escura',
    descricao: 'Arraste o Copo Branco para dentro da caixa escura.',
    item: 'copobranco',
    alvo: 'caixaescura',
  },
  {
    id: 10,
    titulo: 'Levar Copo Amostra à Caixa Escura',
    descricao: 'Arraste o Copo Amostra para a caixa escura e aguarde 10 minutos.',
    item: 'copoamostra',
    alvo: 'caixaescura',
  },

  // ── Fase 7: Reação no escuro (auto-timer 6 s simulando 10 min) ────────────
  {
    id: 11,
    titulo: 'Reação no Escuro — 10 Minutos',
    descricao: 'Aguardando reação no escuro por 10 minutos...',
    item: null,
    alvo: null,
  },

  // ── Fase 8: Zeragem com Branco ────────────────────────────────────────────
  {
    id: 12,
    titulo: 'Transferir Branco → Cubeta 25 mm',
    descricao: 'Arraste o Copo Branco até a cubeta de 25 mm para transferir o branco.',
    item: 'copobranco',
    alvo: 'cubeta',
  },
  {
    id: 13,
    titulo: 'Inserir Cubeta no Fotômetro',
    descricao: 'Arraste a cubeta com o branco até o compartimento do fotômetro.',
    item: 'cubeta',
    alvo: 'fotometro',
  },
  {
    id: 14,
    titulo: 'Pressionar ZERO (Zerar com Branco)',
    descricao: 'Clique no botão ZERO para zerar o fotômetro com o branco de referência.',
    item: null,
    alvo: 'fotometro',
  },

  // ── Fase 9: Leitura da Amostra ────────────────────────────────────────────
  {
    id: 15,
    titulo: 'Transferir Amostra → Cubeta 25 mm',
    descricao: 'Arraste o Copo Amostra até a cubeta de 25 mm para transferir a amostra.',
    item: 'copoamostra',
    alvo: 'cubeta',
  },
  {
    id: 16,
    titulo: 'Inserir Cubeta no Fotômetro',
    descricao: 'Arraste a cubeta com a amostra até o compartimento do fotômetro.',
    item: 'cubeta',
    alvo: 'fotometro',
  },
  {
    id: 17,
    titulo: 'Pressionar LER (READ)',
    descricao: 'Clique no botão LER para realizar a leitura em ppb DEHA.',
    item: null,
    alvo: 'fotometro',
  },

  // ── Conclusão ─────────────────────────────────────────────────────────────
  {
    id: 18,
    titulo: 'Anotar Resultado em ppb DEHA',
    descricao: 'Leitura concluída. Registre o valor em ppb de DEHA exibido no fotômetro.',
    item: null,
    alvo: null,
  },
];
