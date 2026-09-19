/**
 * etapasFerro.js — Determinação de Ferro Total — Método Ferrozine
 *
 * 19 etapas · Ferrozine Iron Solution · Digestão branda · Cubeta 25 mm
 * Leitura em mg/L Fe · Fotômetro/espectrofotômetro
 */
export const etapas = [
  // ── Fase 1: Preparo do Branco ─────────────────────────────────────────────
  {
    id: 0,
    titulo: 'Medir Água Deionizada (25 mL)',
    descricao: 'Arraste o frasco de Água Deionizada até a proveta para medir 25 mL.',
    item: 'agua',
    alvo: 'proveta',
  },
  {
    id: 1,
    titulo: 'Transferir para o Erlenmeyer Branco',
    descricao: 'Arraste a proveta com 25 mL até o Erlenmeyer identificado como Branco.',
    item: 'proveta',
    alvo: 'erlenmeyer_branco',
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
    titulo: 'Transferir para o Erlenmeyer Amostra',
    descricao: 'Arraste a proveta com 25 mL até o Erlenmeyer identificado como Amostra.',
    item: 'proveta',
    alvo: 'erlenmeyer_amostra',
  },

  // ── Fase 3: Adição de Ferrozine ───────────────────────────────────────────
  {
    id: 4,
    titulo: 'Adicionar Ferrozine ao Branco',
    descricao: 'Arraste o sachê de Ferrozine Iron Solution até o Erlenmeyer Branco para adicionar o reagente.',
    item: 'ferrozine',
    alvo: 'erlenmeyer_branco',
  },
  {
    id: 5,
    titulo: 'Adicionar Ferrozine à Amostra',
    descricao: 'Arraste o sachê de Ferrozine Iron Solution até o Erlenmeyer Amostra para adicionar o reagente.',
    item: 'ferrozine',
    alvo: 'erlenmeyer_amostra',
  },

  // ── Fase 4: Digestão branda ───────────────────────────────────────────────
  {
    id: 6,
    titulo: 'Levar Erlenmeyer Branco à Chapa',
    descricao: 'Arraste o Erlenmeyer Branco até a chapa aquecedora.',
    item: 'erlenmeyer_branco',
    alvo: 'chapa',
  },
  {
    id: 7,
    titulo: 'Levar Erlenmeyer Amostra à Chapa',
    descricao: 'Arraste o Erlenmeyer Amostra até a chapa aquecedora ao lado do Branco.',
    item: 'erlenmeyer_amostra',
    alvo: 'chapa',
  },
  {
    id: 8,
    titulo: 'Iniciar Digestão Branda',
    descricao: 'Clique na chapa aquecedora para iniciar a digestão branda (20–30 min).',
    item: null,
    alvo: 'chapa',
  },

  // ── Fase 5: Resfriamento e complemento de volume ──────────────────────────
  {
    id: 9,
    titulo: 'Aguardar Resfriamento',
    descricao: 'Digestão concluída. Aguardando o resfriamento dos frascos até temperatura ambiente...',
    item: null,
    alvo: null,
  },
  {
    id: 10,
    titulo: 'Completar Branco para 25 mL',
    descricao: 'Arraste a Água Deionizada até o Erlenmeyer Branco para completar o volume para 25 mL.',
    item: 'agua',
    alvo: 'erlenmeyer_branco',
  },
  {
    id: 11,
    titulo: 'Completar Amostra para 25 mL',
    descricao: 'Arraste a Água Deionizada até o Erlenmeyer Amostra para completar o volume para 25 mL.',
    item: 'agua',
    alvo: 'erlenmeyer_amostra',
  },

  // ── Fase 6: Leitura com o Branco ──────────────────────────────────────────
  {
    id: 12,
    titulo: 'Transferir Branco para a Cubeta 25 mm',
    descricao: 'Arraste o Erlenmeyer Branco até a cubeta de 25 mm para transferir 10 mL do branco.',
    item: 'erlenmeyer_branco',
    alvo: 'cubeta',
  },
  {
    id: 13,
    titulo: 'Inserir Cubeta no Equipamento',
    descricao: 'Arraste a cubeta com o branco até o compartimento de leitura do fotômetro.',
    item: 'cubeta',
    alvo: 'fotometro',
  },
  {
    id: 14,
    titulo: 'Pressionar ZERO',
    descricao: 'Clique em ZERO para ajustar o equipamento com o branco de referência.',
    item: null,
    alvo: 'fotometro',
  },

  // ── Fase 7: Leitura da Amostra ────────────────────────────────────────────
  {
    id: 15,
    titulo: 'Transferir Amostra para a Cubeta 25 mm',
    descricao: 'Arraste o Erlenmeyer Amostra até a cubeta de 25 mm para transferir 10 mL da amostra preparada.',
    item: 'erlenmeyer_amostra',
    alvo: 'cubeta',
  },
  {
    id: 16,
    titulo: 'Inserir Cubeta no Equipamento',
    descricao: 'Arraste a cubeta com a amostra até o compartimento de leitura do fotômetro.',
    item: 'cubeta',
    alvo: 'fotometro',
  },
  {
    id: 17,
    titulo: 'Pressionar READ — Realizar Leitura',
    descricao: 'Clique em READ para realizar a leitura da amostra em mg/L Fe.',
    item: null,
    alvo: 'fotometro',
  },

  // ── Conclusão ─────────────────────────────────────────────────────────────
  {
    id: 18,
    titulo: 'Anotar o Resultado em mg/L Fe',
    descricao: 'Leitura concluída. Registre o valor em mg/L de Ferro Total como Fe.',
    item: null,
    alvo: null,
  },
];
