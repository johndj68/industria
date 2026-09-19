/**
 * etapasAcAlcoo.js — Determinação de Acidez Total em Álcool Etílico
 *
 * 13 etapas · Alfa-naftolftaleína + NaOH 0,02 mol/L
 * Viragem: incolor → azul-claro
 * Fase 1: Ajuste do branco (água deionizada)
 * Fase 2: Titulação da amostra (álcool hidratado)
 */
export const etapas = [
  // ── Fase 1: Preparo e Ajuste do Branco ───────────────────────────────────
  {
    id: 0,
    titulo: 'Medir Água Deionizada (50 mL)',
    descricao: 'Arraste o frasco de Água Deionizada até a proveta para medir 50 mL.',
    item: 'agua',
    alvo: 'proveta',
  },
  {
    id: 1,
    titulo: 'Transferir para o Erlenmeyer',
    descricao: 'Arraste a proveta com 50 mL até o Erlenmeyer para transferir a água.',
    item: 'proveta',
    alvo: 'erlenmeyer',
  },
  {
    id: 2,
    titulo: 'Adicionar Alfa-naftolftaleína (4 gotas)',
    descricao: 'Arraste o frasco de Alfa-naftolftaleína até o Erlenmeyer para adicionar 4 gotas do indicador.',
    item: 'alfanaftol',
    alvo: 'erlenmeyer',
  },
  {
    id: 3,
    titulo: 'Carregar Bureta com NaOH 0,02 mol/L',
    descricao: 'Arraste o frasco de NaOH 0,02 mol/L até a bureta para preenchê-la com o titulante.',
    item: 'naoh',
    alvo: 'bureta',
  },
  {
    id: 4,
    titulo: 'Posicionar Erlenmeyer sob a Bureta',
    descricao: 'Arraste o Erlenmeyer até a plataforma abaixo da bureta para iniciar o ajuste do branco.',
    item: 'erlenmeyer',
    alvo: 'areaTitulacao',
  },
  {
    id: 5,
    titulo: 'Ajustar o Branco — Clique na Bureta',
    descricao: 'Clique na bureta para titular a água com NaOH até viragem de incolor para azul-claro.',
    item: null,
    alvo: 'bureta',
  },
  {
    id: 6,
    titulo: 'Retornar Erlenmeyer para a Bancada',
    descricao: 'Branco ajustado! O Erlenmeyer retorna com solução azul-claro. Aguarde...',
    item: null,
    alvo: null,
  },

  // ── Fase 2: Titulação da Amostra ──────────────────────────────────────────
  {
    id: 7,
    titulo: 'Medir Álcool Hidratado (50 mL)',
    descricao: 'Arraste o frasco de Álcool Hidratado até a proveta para medir 50 mL.',
    item: 'alcool',
    alvo: 'proveta',
  },
  {
    id: 8,
    titulo: 'Transferir Álcool para o Erlenmeyer',
    descricao: 'Arraste a proveta com 50 mL de álcool até o Erlenmeyer para transferir a amostra.',
    item: 'proveta',
    alvo: 'erlenmeyer',
  },
  {
    id: 9,
    titulo: 'Recarregar Bureta com NaOH 0,02 mol/L',
    descricao: 'Arraste o frasco de NaOH 0,02 mol/L para confirmar/recarregar a bureta antes da titulação.',
    item: 'naoh',
    alvo: 'bureta',
  },
  {
    id: 10,
    titulo: 'Posicionar Erlenmeyer sob a Bureta',
    descricao: 'Arraste o Erlenmeyer até a plataforma abaixo da bureta para a titulação final.',
    item: 'erlenmeyer',
    alvo: 'areaTitulacao',
  },
  {
    id: 11,
    titulo: 'Titular com NaOH até Azul-Claro',
    descricao: 'Clique na torneira da bureta para titular gota a gota com NaOH até viragem de incolor para azul-claro.',
    item: null,
    alvo: 'bureta',
  },

  // ── Conclusão ─────────────────────────────────────────────────────────────
  {
    id: 12,
    titulo: 'Anotar o Volume Gasto de NaOH',
    descricao: 'Ponto final atingido! Registre o volume de NaOH 0,02 mol/L gasto na titulação.',
    item: null,
    alvo: null,
  },
];
