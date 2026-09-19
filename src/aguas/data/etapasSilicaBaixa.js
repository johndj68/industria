export const etapas = [
  // ── Fase 1: Medição e distribuição da amostra ────────────────────────────
  {
    id: 0,
    titulo: 'Medir Amostra na Proveta (25 mL)',
    descricao: 'Arraste o frasco de amostra até a proveta para medir 25 mL.',
    item: 'amostra',
    alvo: 'proveta',
  },
  {
    id: 1,
    titulo: 'Transferir Proveta → Copo Branco',
    descricao: 'Arraste a proveta com 25 mL até o Copo Branco para transferir a amostra.',
    item: 'proveta',
    alvo: 'copobranco',
  },
  {
    id: 2,
    titulo: 'Medir Amostra na Proveta (25 mL)',
    descricao: 'Arraste o frasco de amostra novamente até a proveta para medir mais 25 mL.',
    item: 'amostra',
    alvo: 'proveta',
  },
  {
    id: 3,
    titulo: 'Transferir Proveta → Copo A',
    descricao: 'Arraste a proveta com 25 mL até o Copo A para transferir a amostra.',
    item: 'proveta',
    alvo: 'copoA',
  },

  // ── Fase 2: Adição de Molybdate 3 ────────────────────────────────────────
  {
    id: 4,
    titulo: 'Selecionar Ponteira P1000',
    descricao: 'Clique na ponteira amarela P1000 no rack para acoplar à micropipeta.',
    item: 'rack',
    alvo: 'rack',
  },
  {
    id: 5,
    titulo: 'Aspirar Molybdate 3',
    descricao: 'Arraste a micropipeta até o frasco Molybdate 3 para aspirar o reagente.',
    item: 'pipeta',
    alvo: 'molibdato',
  },
  {
    id: 6,
    titulo: 'Adicionar Molybdate 3 ao Copo Branco',
    descricao: 'Arraste a micropipeta carregada até o Copo Branco para dispensar o Molybdate 3.',
    item: 'pipeta',
    alvo: 'copobranco',
  },
  {
    id: 7,
    titulo: 'Aspirar Molybdate 3 novamente',
    descricao: 'Arraste a micropipeta até o frasco Molybdate 3 para aspirar mais reagente.',
    item: 'pipeta',
    alvo: 'molibdato',
  },
  {
    id: 8,
    titulo: 'Adicionar Molybdate 3 ao Copo A',
    descricao: 'Arraste a micropipeta carregada até o Copo A para dispensar o Molybdate 3.',
    item: 'pipeta',
    alvo: 'copoA',
  },

  // ── Fase 3: Aguardar 4 min ────────────────────────────────────────────────
  {
    id: 9,
    titulo: 'Aguardar 4 Minutos',
    descricao: 'Aguarde 4 minutos para formação completa do complexo silicomolibdato amarelo.',
    item: null,
    alvo: null,
  },

  // ── Fase 4: Adição de Citric Acid ────────────────────────────────────────
  {
    id: 10,
    titulo: 'Selecionar Nova Ponteira P1000',
    descricao: 'Ejete a ponteira anterior e clique em nova P1000 para o Ácido Cítrico.',
    item: 'rack',
    alvo: 'rack',
  },
  {
    id: 11,
    titulo: 'Aspirar Citric Acid',
    descricao: 'Arraste a micropipeta até o frasco Citric Acid para aspirar o reagente.',
    item: 'pipeta',
    alvo: 'citrico',
  },
  {
    id: 12,
    titulo: 'Adicionar Citric Acid ao Copo Branco',
    descricao: 'Arraste a micropipeta carregada até o Copo Branco para dispensar o Citric Acid.',
    item: 'pipeta',
    alvo: 'copobranco',
  },
  {
    id: 13,
    titulo: 'Aspirar Citric Acid novamente',
    descricao: 'Arraste a micropipeta até o frasco Citric Acid para aspirar mais reagente.',
    item: 'pipeta',
    alvo: 'citrico',
  },
  {
    id: 14,
    titulo: 'Adicionar Citric Acid ao Copo A',
    descricao: 'Arraste a micropipeta carregada até o Copo A para dispensar o Citric Acid.',
    item: 'pipeta',
    alvo: 'copoA',
  },

  // ── Fase 5: Aguardar 4 min ────────────────────────────────────────────────
  {
    id: 15,
    titulo: 'Aguardar 4 Minutos',
    descricao: 'Aguarde 4 minutos para o Citric Acid eliminar interferências de fosfato.',
    item: null,
    alvo: null,
  },

  // ── Fase 6: Adição de Amino Acid F (SOMENTE Copo A) ──────────────────────
  {
    id: 16,
    titulo: 'Selecionar Nova Ponteira P1000',
    descricao: 'Ejete a ponteira e selecione nova P1000 para o Amino Acid F.',
    item: 'rack',
    alvo: 'rack',
  },
  {
    id: 17,
    titulo: 'Aspirar Amino Acid F',
    descricao: 'Arraste a micropipeta até o frasco Amino Acid F para aspirar o reagente.',
    item: 'pipeta',
    alvo: 'amino',
  },
  {
    id: 18,
    titulo: 'Adicionar Amino Acid F → Copo A (SOMENTE)',
    descricao: 'Arraste a micropipeta até o Copo A. NÃO adicionar ao Copo Branco! Cor azul se desenvolve.',
    item: 'pipeta',
    alvo: 'copoA',
  },

  // ── Fase 7: Aguardar 1 min ────────────────────────────────────────────────
  {
    id: 19,
    titulo: 'Aguardar 1 Minuto',
    descricao: 'Aguarde 1 minuto para desenvolvimento completo da coloração azul heteropoli.',
    item: null,
    alvo: null,
  },

  // ── Fase 8: Fotometria — zeragem com branco ───────────────────────────────
  {
    id: 20,
    titulo: 'Copo Branco → Cubeta 25 mm',
    descricao: 'Arraste o Copo Branco até a cubeta 25 mm para preencher com a solução em branco.',
    item: 'copobranco',
    alvo: 'cubeta',
  },
  {
    id: 21,
    titulo: 'Inserir Cubeta no Fotômetro',
    descricao: 'Arraste a cubeta com o branco até o compartimento de amostra do fotômetro.',
    item: 'cubeta',
    alvo: 'fotometro',
  },
  {
    id: 22,
    titulo: 'Pressionar ZERO (Zerar)',
    descricao: 'Clique no botão ZERO para zerar o fotômetro com a solução em branco de referência.',
    item: null,
    alvo: 'fotometro',
  },

  // ── Fase 9: Fotometria — leitura da amostra ──────────────────────────────
  {
    id: 23,
    titulo: 'Copo A → Cubeta 25 mm',
    descricao: 'Arraste o Copo A com amostra azul até a cubeta para preencher com a amostra reagida.',
    item: 'copoA',
    alvo: 'cubeta',
  },
  {
    id: 24,
    titulo: 'Inserir Cubeta no Fotômetro',
    descricao: 'Arraste a cubeta com a solução azul até o compartimento de amostra do fotômetro.',
    item: 'cubeta',
    alvo: 'fotometro',
  },
  {
    id: 25,
    titulo: 'Pressionar LER (READ)',
    descricao: 'Clique no botão LER para realizar a leitura fotométrica a λ = 810 nm. Resultado em mg/L SiO₂.',
    item: null,
    alvo: 'fotometro',
  },

  // ── Conclusão ─────────────────────────────────────────────────────────────
  {
    id: 26,
    titulo: 'Anotar Resultado',
    descricao: 'Leitura fotométrica concluída. Registre o valor exibido no fotômetro como resultado da análise.',
    item: null,
    alvo: null,
  },
];
