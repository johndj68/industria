/**
 * etapasArtAguas.js — ART em Águas Residuais — Método Colorimétrico Antrona
 *
 * 24 etapas · Celite · Funil · Papel Filtro · Proveta · Antrona
 * Banho-maria 12 min · Espectrofotômetro curva Antrona · mg/L ART
 */
export const etapas = [
  // ── Fase 1: Preparo e filtração ────────────────────────────────────────────
  {
    id: 0,
    titulo: 'Levar a Amostra ao Béquer A',
    descricao: 'Arraste o frasco de amostra de água residual até o Béquer A para transferir ~200 mL.',
    item: 'amostra',
    alvo: 'bequer_a',
  },
  {
    id: 1,
    titulo: 'Adicionar Celite ao Béquer A',
    descricao: 'Arraste o frasco de Celite até o Béquer A para acrescentar ~2 g do adsorvente.',
    item: 'celite',
    alvo: 'bequer_a',
  },
  {
    id: 2,
    titulo: 'Homogeneizar a Amostra com Celite',
    descricao: 'Clique em "Homogeneizar" para agitar e misturar a amostra com a Celite.',
    item: null,
    alvo: null,
  },
  {
    id: 3,
    titulo: 'Acoplar o Funil ao Béquer B',
    descricao: 'Arraste o funil até o Béquer B para acoplar o sistema de filtração.',
    item: 'funil',
    alvo: 'bequer_b',
  },
  {
    id: 4,
    titulo: 'Posicionar Papel Filtro no Funil',
    descricao: 'Arraste o papel filtro qualitativo até o Béquer B para posicioná-lo dentro do funil.',
    item: 'papel_filtro',
    alvo: 'bequer_b',
  },
  {
    id: 5,
    titulo: 'Filtrar — Béquer A → Béquer B',
    descricao: 'Arraste o Béquer A até o Béquer B para iniciar a filtração. As primeiras porções serão descartadas automaticamente.',
    item: 'bequer_a',
    alvo: 'bequer_b',
  },

  // ── Fase 2: Preparo dos tubos ──────────────────────────────────────────────
  {
    id: 6,
    titulo: 'Coletar 2 mL do Filtrado na Proveta',
    descricao: 'Arraste o Béquer B com filtrado até a proveta para coletar exatamente 2 mL.',
    item: 'bequer_b',
    alvo: 'proveta',
  },
  {
    id: 7,
    titulo: 'Transferir 2 mL para o Tubo Amostra',
    descricao: 'Arraste a proveta até o Tubo Amostra para transferir os 2 mL do filtrado.',
    item: 'proveta',
    alvo: 'tubo_amostra',
  },
  {
    id: 8,
    titulo: 'Coletar 2 mL de Água Desmineralizada',
    descricao: 'Arraste o frasco de Água Desmineralizada até a proveta para coletar 2 mL (prova em branco).',
    item: 'agua_desmin',
    alvo: 'proveta',
  },
  {
    id: 9,
    titulo: 'Transferir 2 mL para o Tubo Branco',
    descricao: 'Arraste a proveta até o Tubo Branco para transferir os 2 mL de água desmineralizada.',
    item: 'proveta',
    alvo: 'tubo_branco',
  },

  // ── Fase 3: Adição de Antrona ──────────────────────────────────────────────
  {
    id: 10,
    titulo: 'Adicionar 10 mL de Antrona ao Tubo Amostra',
    descricao: 'Arraste o frasco de solução de Antrona até o Tubo Amostra para adicionar 10 mL.',
    item: 'antrona',
    alvo: 'tubo_amostra',
  },
  {
    id: 11,
    titulo: 'Adicionar 10 mL de Antrona ao Tubo Branco',
    descricao: 'Arraste o frasco de solução de Antrona até o Tubo Branco para adicionar 10 mL.',
    item: 'antrona',
    alvo: 'tubo_branco',
  },
  {
    id: 12,
    titulo: 'Homogeneizar os Dois Tubos',
    descricao: 'Clique em "Homogeneizar" para agitar os dois tubos antes do banho-maria.',
    item: null,
    alvo: null,
  },

  // ── Fase 4: Banho-maria ────────────────────────────────────────────────────
  {
    id: 13,
    titulo: 'Levar o Tubo Branco ao Banho-maria',
    descricao: 'Arraste o Tubo Branco até o suporte do banho-maria.',
    item: 'tubo_branco',
    alvo: 'banho_maria',
  },
  {
    id: 14,
    titulo: 'Levar o Tubo Amostra ao Banho-maria',
    descricao: 'Arraste o Tubo Amostra até o suporte do banho-maria ao lado do Tubo Branco.',
    item: 'tubo_amostra',
    alvo: 'banho_maria',
  },
  {
    id: 15,
    titulo: 'Iniciar Banho-maria em Ebulição — 12 Minutos',
    descricao: 'Clique em "Iniciar Banho-maria" para aquecer os tubos em ebulição por 12 minutos.',
    item: null,
    alvo: null,
  },
  {
    id: 16,
    titulo: 'Aguardando 12 Minutos de Banho-maria',
    descricao: 'Mantendo em ebulição por 12 minutos. Após o tempo, os tubos retornam e são resfriados até temperatura ambiente.',
    item: null,
    alvo: null,
  },

  // ── Fase 5: Leitura com branco ─────────────────────────────────────────────
  {
    id: 17,
    titulo: 'Levar o Tubo Branco até a Cubeta 25 mm',
    descricao: 'Arraste o Tubo Branco até a cubeta de 25 mm para transferir o branco de referência.',
    item: 'tubo_branco',
    alvo: 'cubeta',
  },
  {
    id: 18,
    titulo: 'Inserir Cubeta no Espectrofotômetro',
    descricao: 'Arraste a cubeta com o branco até o compartimento de leitura do espectrofotômetro.',
    item: 'cubeta',
    alvo: 'espectrofotometro',
  },
  {
    id: 19,
    titulo: 'Clicar em ZERO — Curva Antrona',
    descricao: 'Clique em ZERO para selecionar a curva Antrona e ajustar o equipamento com o branco.',
    item: null,
    alvo: 'espectrofotometro',
  },

  // ── Fase 6: Leitura da amostra ────────────────────────────────────────────
  {
    id: 20,
    titulo: 'Levar o Tubo Amostra até a Cubeta 25 mm',
    descricao: 'Arraste o Tubo Amostra até a cubeta de 25 mm para transferir a amostra reagida.',
    item: 'tubo_amostra',
    alvo: 'cubeta',
  },
  {
    id: 21,
    titulo: 'Inserir Cubeta da Amostra no Espectrofotômetro',
    descricao: 'Arraste a cubeta com a amostra até o compartimento de leitura do espectrofotômetro.',
    item: 'cubeta',
    alvo: 'espectrofotometro',
  },
  {
    id: 22,
    titulo: 'Clicar em READ — Realizar Leitura',
    descricao: 'Clique em READ para realizar a leitura de ART na curva Antrona.',
    item: null,
    alvo: 'espectrofotometro',
  },

  // ── Conclusão ──────────────────────────────────────────────────────────────
  {
    id: 23,
    titulo: 'Anotar o Resultado de ART em mg/L',
    descricao: 'Leitura concluída. Registre o resultado de Açúcares Redutores Totais (ART) em mg/L.',
    item: null,
    alvo: null,
  },
];
