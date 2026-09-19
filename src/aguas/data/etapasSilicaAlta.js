/**
 * etapasSilicaAlta.js — Determinação de Sílica Alto Teor
 *
 * 23 etapas · HCl 2% · Ácido Oxálico 10% · Molibdato de Amônio 10% · Sulfito de Sódio 17%
 * Curva: Sílica Alto Teor · Cubeta quartzo 10 mm · Resultado em ppm SiO₂
 */
export const etapas = [
  // ── Fase 1: Preparo da Amostra ─────────────────────────────────────────────
  {
    id: 0,
    titulo: 'Medir 10 mL de Amostra na Proveta',
    descricao: 'Arraste o frasco de Amostra até a proveta para medir 10 mL.',
    item: 'amostra',
    alvo: 'proveta',
  },
  {
    id: 1,
    titulo: 'Transferir para o Béquer Amostra',
    descricao: 'Arraste a proveta até o Béquer Amostra para transferir os 10 mL.',
    item: 'proveta',
    alvo: 'bequer_amostra',
  },

  // ── Fase 2: Preparo do Branco ──────────────────────────────────────────────
  {
    id: 2,
    titulo: 'Medir 10 mL de Água Deionizada na Proveta',
    descricao: 'Arraste o frasco de Água Deionizada até a proveta para medir 10 mL (branco de referência).',
    item: 'agua',
    alvo: 'proveta',
  },
  {
    id: 3,
    titulo: 'Transferir para o Béquer Branco',
    descricao: 'Arraste a proveta até o Béquer Branco para transferir os 10 mL de água deionizada.',
    item: 'proveta',
    alvo: 'bequer_branco',
  },

  // ── Fase 3: Adição de Ácido Clorídrico 2% ─────────────────────────────────
  {
    id: 4,
    titulo: 'Adicionar HCl 2% ao Béquer Branco (5 mL)',
    descricao: 'Arraste o frasco de Ácido Clorídrico 2% até o Béquer Branco para adicionar 5 mL.',
    item: 'hcl',
    alvo: 'bequer_branco',
  },
  {
    id: 5,
    titulo: 'Adicionar HCl 2% ao Béquer Amostra (5 mL)',
    descricao: 'Arraste o frasco de Ácido Clorídrico 2% até o Béquer Amostra para adicionar 5 mL.',
    item: 'hcl',
    alvo: 'bequer_amostra',
  },

  // ── Fase 4: Adição de Ácido Oxálico 10% ───────────────────────────────────
  {
    id: 6,
    titulo: 'Adicionar Ácido Oxálico 10% ao Branco (1 mL)',
    descricao: 'Arraste o frasco de Ácido Oxálico 10% até o Béquer Branco para adicionar 1 mL.',
    item: 'oxalico',
    alvo: 'bequer_branco',
  },
  {
    id: 7,
    titulo: 'Adicionar Ácido Oxálico 10% à Amostra (1 mL)',
    descricao: 'Arraste o frasco de Ácido Oxálico 10% até o Béquer Amostra para adicionar 1 mL.',
    item: 'oxalico',
    alvo: 'bequer_amostra',
  },

  // ── Fase 5: 1ª Homogeneização ──────────────────────────────────────────────
  {
    id: 8,
    titulo: 'Homogeneizar os Dois Béqueres',
    descricao: 'Clique em "Homogeneizar" para agitar branco e amostra e homogeneizar a solução ácida.',
    item: null,
    alvo: null,
  },

  // ── Fase 6: Adição de Molibdato de Amônio 10% ─────────────────────────────
  {
    id: 9,
    titulo: 'Adicionar Molibdato de Amônio 10% ao Branco (5 mL)',
    descricao: 'Arraste o frasco de Molibdato de Amônio 10% até o Béquer Branco para adicionar 5 mL.',
    item: 'molibdato',
    alvo: 'bequer_branco',
  },
  {
    id: 10,
    titulo: 'Adicionar Molibdato de Amônio 10% à Amostra (5 mL)',
    descricao: 'Arraste o frasco de Molibdato de Amônio 10% até o Béquer Amostra para adicionar 5 mL.',
    item: 'molibdato',
    alvo: 'bequer_amostra',
  },

  // ── Fase 7: 2ª Homogeneização + Timer 4 min ────────────────────────────────
  {
    id: 11,
    titulo: 'Homogeneizar e Aguardar 4 Minutos',
    descricao: 'Clique em "Homogenizar + Iniciar Timer" para agitar e aguardar 4 minutos de reação do Molibdato.',
    item: null,
    alvo: null,
  },
  {
    id: 12,
    titulo: 'Aguardando Tempo de Reação (4 min)',
    descricao: 'Aguarde o tempo de reação do Molibdato de Amônio. O complexo silicomolibdato está se formando...',
    item: null,
    alvo: null,
  },

  // ── Fase 8: Adição de Sulfito de Sódio 17% ────────────────────────────────
  {
    id: 13,
    titulo: 'Adicionar Sulfito de Sódio 17% ao Branco (10 mL)',
    descricao: 'Arraste o frasco de Sulfito de Sódio 17% até o Béquer Branco para adicionar 10 mL.',
    item: 'sulfito',
    alvo: 'bequer_branco',
  },
  {
    id: 14,
    titulo: 'Adicionar Sulfito de Sódio 17% à Amostra (10 mL)',
    descricao: 'Arraste o frasco de Sulfito de Sódio 17% até o Béquer Amostra para adicionar 10 mL. Observe a reação colorimétrica.',
    item: 'sulfito',
    alvo: 'bequer_amostra',
  },

  // ── Fase 9: 3ª Homogeneização ─────────────────────────────────────────────
  {
    id: 15,
    titulo: 'Homogeneizar Novamente',
    descricao: 'Clique em "Homogeneizar" para agitar os dois béqueres após a adição do Sulfito de Sódio.',
    item: null,
    alvo: null,
  },

  // ── Fase 10: Leitura com o Branco ──────────────────────────────────────────
  {
    id: 16,
    titulo: 'Transferir Branco para a Cubeta de Quartzo 10 mm',
    descricao: 'Arraste o Béquer Branco até a cubeta de quartzo 10 mm para transferir o branco de referência.',
    item: 'bequer_branco',
    alvo: 'cubeta',
  },
  {
    id: 17,
    titulo: 'Inserir Cubeta no Equipamento',
    descricao: 'Arraste a cubeta com o branco até o compartimento de leitura do equipamento.',
    item: 'cubeta',
    alvo: 'fotometro',
  },
  {
    id: 18,
    titulo: 'Pressionar ZERO — Ajuste do Branco',
    descricao: 'Clique em ZERO para ajustar o equipamento na curva Sílica Alto Teor com o branco de referência.',
    item: null,
    alvo: 'fotometro',
  },

  // ── Fase 11: Leitura da Amostra ────────────────────────────────────────────
  {
    id: 19,
    titulo: 'Transferir Amostra para Outra Cubeta de Quartzo 10 mm',
    descricao: 'Arraste o Béquer Amostra até a cubeta de quartzo 10 mm para transferir a amostra preparada.',
    item: 'bequer_amostra',
    alvo: 'cubeta',
  },
  {
    id: 20,
    titulo: 'Inserir Cubeta da Amostra no Equipamento',
    descricao: 'Arraste a cubeta com a amostra até o compartimento de leitura do equipamento.',
    item: 'cubeta',
    alvo: 'fotometro',
  },
  {
    id: 21,
    titulo: 'Pressionar READ — Realizar Leitura',
    descricao: 'Clique em READ para realizar a leitura da Sílica Alto Teor em ppm SiO₂.',
    item: null,
    alvo: 'fotometro',
  },

  // ── Conclusão ──────────────────────────────────────────────────────────────
  {
    id: 22,
    titulo: 'Anotar a Leitura C em ppm SiO₂',
    descricao: 'Leitura concluída. Registre o valor C obtido em ppm de SiO₂ — Sílica Alto Teor.',
    item: null,
    alvo: null,
  },
];
