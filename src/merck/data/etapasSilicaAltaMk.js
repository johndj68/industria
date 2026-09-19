/**
 * etapasSilicaAltaMk.js — Sílica Alta Faixa — Kit Merck Spectroquant 100857
 *
 * 14 etapas · Spectroquant Prove 300 · Método 100857
 * Fluxo: Confirmar → pH → Proveta 4mL → Tubo → Si-1 4gotas
 *        → Ponteira P1000 → Micropipeta aspira Si-2 → Micropipeta dispensa
 *        → Cubeta 10mm → Branco H₂O → ZERO → Cubeta amostra → LER
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Confirmar Amostra',
    descricao: 'Verifique se a amostra está homogeneizada e pronta para análise. Para garantia da qualidade, utilize solução padrão Certipur® Cat. 170236 (1000 mg/L Si) após diluição. Atenção: não armazenar em frascos de vidro.',
    item: null,
    alvo: null,
  },
  {
    id: 1,
    titulo: 'Verificar e Ajustar pH da Amostra (pH 2–10)',
    descricao: 'Verifique o pH da amostra. A faixa aceitável para o método 100857 é pH 2–10. Se necessário, ajuste com NaOH (↑ pH) ou H₂SO₄ (↓ pH), gota a gota, até atingir a faixa especificada.',
    item: null,
    alvo: null,
  },
  {
    id: 2,
    titulo: 'Levar Amostra até a Proveta — Coletar 4,0 mL',
    descricao: 'Arraste o frasco de amostra até a proveta graduada para coletar exatamente 4,0 mL da amostra. Observe a marca de 4 mL na graduação da proveta.',
    item: 'amostra',
    alvo: 'proveta',
  },
  {
    id: 3,
    titulo: 'Levar a Proveta até o Tubo de Reação',
    descricao: 'Arraste a proveta com 4,0 mL de amostra até o tubo de reação para transferir o volume coletado. Incline suavemente para transferência completa.',
    item: 'proveta',
    alvo: 'tubo_reacao',
  },
  {
    id: 4,
    titulo: 'Levar Reagente Si‑1 até o Tubo de Reação — Pingar 4 Gotas',
    descricao: 'Arraste o frasco conta-gotas do Reagente Si‑1 até o tubo de reação para adicionar exatamente 4 gotas. Homogeneize suavemente após a adição.',
    item: 'reagente_si1',
    alvo: 'tubo_reacao',
  },
  {
    id: 5,
    titulo: 'Clicar na Ponteira P1000 para Encaixar na Micropipeta',
    descricao: 'Clique em uma ponteira P1000 no rack de ponteiras para encaixá-la na micropipeta Gilson P1000. A ponteira deve ser encaixada antes de coletar o Reagente Si‑2.',
    item: null,
    alvo: null,
  },
  {
    id: 6,
    titulo: 'Levar Micropipeta até o Reagente Si‑2 — Coletar 2,0 mL',
    descricao: 'Arraste a micropipeta P1000 até o frasco do Reagente Si‑2 para aspirar 2,0 mL (volume ajustado para 2000 μL). Pressione o êmbolo até a primeira parada antes de mergulhar no reagente.',
    item: 'micropipeta',
    alvo: 'reagente_si2',
  },
  {
    id: 7,
    titulo: 'Levar Micropipeta até o Tubo de Reação — Aguardar Tempos de Reação',
    descricao: 'Arraste a micropipeta com 2,0 mL de Si‑2 até o tubo de reação para dispensar o reagente. Homogeneize e aguarde os dois tempos de reação: 2 min (Reação 1 — Silicomolibdato) + 2 min (Reação 2 — Estabilização e cor).',
    item: 'micropipeta',
    alvo: 'tubo_reacao',
  },
  {
    id: 8,
    titulo: 'Transferir Solução Reagida para a Cubeta de 10 mm',
    descricao: 'Após os tempos de reação, arraste o tubo de reação até a cubeta de leitura (célula 10 mm) para transferir a solução completamente reagida até a marca de volume indicada.',
    item: 'tubo_reacao',
    alvo: 'cubeta',
  },
  {
    id: 9,
    titulo: 'Preparar Cubeta do Branco com Água Destilada',
    descricao: 'Arraste o frasco de Água Destilada até a cubeta do branco para preencher com água destilada — referência de zeragem do Spectroquant Prove 300.',
    item: 'agua_dest',
    alvo: 'cubeta_branco',
  },
  {
    id: 10,
    titulo: 'Inserir Cubeta do Branco no Spectroquant',
    descricao: 'Arraste a cubeta com água destilada até o compartimento do Spectroquant Prove 300 para calibração (zeragem) com o branco de referência.',
    item: 'cubeta_branco',
    alvo: 'spectro',
  },
  {
    id: 11,
    titulo: 'Zerar o Equipamento — Selecionar Método 100857',
    descricao: 'Clique em ZERO para calibrar o equipamento com o branco de água destilada. O Spectroquant Prove 300 ajustará a curva de calibração para o Método 100857 (Sílica alta faixa, 1,1–107,0 mg/L SiO₂).',
    item: null,
    alvo: 'spectro',
  },
  {
    id: 12,
    titulo: 'Inserir Cubeta da Amostra Reagida no Spectroquant',
    descricao: 'Arraste a cubeta com a amostra reagida (complexo silicomolibdato) até o compartimento de leitura do Spectroquant Prove 300 para realizar a leitura fotométrica.',
    item: 'cubeta',
    alvo: 'spectro',
  },
  {
    id: 13,
    titulo: 'Realizar Leitura — Sílica Alta Faixa (mg/L SiO₂)',
    descricao: 'Clique em LER para realizar a leitura de concentração de Sílica pelo Método 100857 (alta faixa, célula 10 mm: 1,1–107,0 mg/L SiO₂; 0,5–50,0 mg/L Si). Registre o resultado.',
    item: null,
    alvo: 'spectro',
  },
];
