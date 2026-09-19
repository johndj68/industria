/**
 * etapasSilicaBaixaMk.js — Sílica Baixa Faixa — Kit Merck Spectroquant 114794
 *
 * 14 etapas · Spectroquant Prove 300 · Método 114794
 * Reagentes: Sílica Baixa 1 (3 gotas) · Sílica Baixa 2 (0,50 mL)
 * Resultado: mg/L SiO₂ · mg/L Si · mmol/L SiO₂
 * Faixas: 10 mm: 0,21–10,70 | 20 mm: ~0,11–5,35 | 50 mm: ~0,011–1,60 mg/L SiO₂
 * Padrão CRM recomendado: Cat. 132243 · Não armazenar em frascos de vidro
 */
export const etapas = [
  {
    id: 0,
    titulo: 'Confirmar Amostra',
    descricao: 'Verifique se a amostra está homogeneizada e pronta para análise. Para garantia da qualidade, utilize solução padrão fotométrica CRM (Cat. 132243) após diluição apropriada. Atenção: não armazenar solução padrão em frascos de vidro.',
    item: null,
    alvo: null,
  },
  {
    id: 1,
    titulo: 'Verificar e Ajustar pH da Amostra (pH 2–10)',
    descricao: 'Verifique o pH da amostra. A faixa aceitável para o método 114794 é pH 2–10. Se necessário, ajuste cuidadosamente com NaOH ou H₂SO₄ (gota a gota) até atingir a faixa especificada. Filtre a amostra se indicado após o ajuste.',
    item: null,
    alvo: null,
  },
  {
    id: 2,
    titulo: 'Pipetar 5,0 mL de Amostra para o Tubo de Reação',
    descricao: 'Arraste a micropipeta P1000 até a Amostra para aspirar 5,0 mL da amostra.',
    item: 'micropipeta',
    alvo: 'amostra',
  },
  {
    id: 3,
    titulo: 'Transferir Amostra para o Tubo de Reação',
    descricao: 'Leve a micropipeta P1000 até o Tubo de Reação e dispense os 5,0 mL de amostra aspirados, na análise de sílica em baixa faixa (kit 114794).',
    item: 'micropipeta',
    alvo: 'tubo_reacao',
  },
  {
    id: 4,
    titulo: 'Adicionar 3 Gotas do Reagente Sílica Baixa 1',
    descricao: 'Arraste o frasco conta-gotas do Reagente Sílica Baixa 1 até o tubo de reação para adicionar exatamente 3 gotas. Homogeneize suavemente.',
    item: 'reagente_sb1',
    alvo: 'tubo_reacao',
  },
  {
    id: 5,
    titulo: 'Adicionar 0,50 mL do Reagente Sílica Baixa 2',
    descricao: 'Arraste a micropipeta P1000 até o Reagente Sílica Baixa 2 para pipetar 0,50 mL e adicionar ao tubo de reação. Homogeneize a solução para iniciar a reação.',
    item: 'micropipeta',
    alvo: 'reagente_sb2',
  },
  {
    id: 6,
    titulo: 'Levar a Micropipeta P1000 até o Tubo de Reação',
    descricao: 'Leve a micropipeta P1000 até o Tubo de Reação e dispense os 0,50 mL do Reagente Sílica Baixa 2 aspirados. Homogeneize a solução para iniciar a reação.',
    item: 'micropipeta',
    alvo: 'tubo_reacao',
  },
  {
    id: 7,
    titulo: 'Aguardar Tempo de Reação',
    descricao: 'Aguarde o tempo de reação especificado pelo kit Merck Spectroquant 114794 para formação e desenvolvimento do complexo de sílica (complexo silicomolibdato).',
    item: null,
    alvo: null,
  },
  {
    id: 8,
    titulo: 'Transferir Solução Reagida para a Cubeta/Célula (10 mm)',
    descricao: 'Arraste o tubo de reação até a cubeta de leitura (célula 10 mm) para transferir a solução completamente reagida até a marca de volume indicada.',
    item: 'tubo_reacao',
    alvo: 'cubeta',
  },
  {
    id: 9,
    titulo: 'Preparar Cubeta do Branco com Água Destilada',
    descricao: 'Arraste o frasco de Água Destilada até a cubeta do branco para preencher com água destilada, referência de zeragem do Spectroquant Prove 300.',
    item: 'agua_dest',
    alvo: 'cubeta_branco',
  },
  {
    id: 10,
    titulo: 'Inserir Cubeta do Branco no Spectroquant',
    descricao: 'Arraste a cubeta com água destilada até o compartimento do Spectroquant Prove 300 para calibração (zeragem) com o branco.',
    item: 'cubeta_branco',
    alvo: 'spectro',
  },
  {
    id: 11,
    titulo: 'Zerar o Equipamento — Selecionar Método 114794',
    descricao: 'Clique em ZERO para calibrar o equipamento com o branco de água destilada. O Spectroquant Prove 300 reconhecerá o kit e ajustará automaticamente a curva de calibração para o Método 114794 (Sílica — baixa faixa).',
    item: null,
    alvo: 'spectro',
  },
  {
    id: 12,
    titulo: 'Inserir Cubeta da Amostra Reagida no Spectroquant',
    descricao: 'Arraste a cubeta com a amostra reagida (azul — complexo silicomolibdato) até o compartimento de leitura do Spectroquant Prove 300.',
    item: 'cubeta',
    alvo: 'spectro',
  },
  {
    id: 13,
    titulo: 'Realizar Leitura — Sílica Baixa Faixa (mg/L SiO₂)',
    descricao: 'Clique em LER para realizar a leitura de concentração de Sílica pelo Método 114794 (baixa faixa, célula 10 mm: 0,21–10,70 mg/L SiO₂). Registre o resultado em mg/L SiO₂ (opcionalmente em mg/L Si ou mmol/L).',
    item: null,
    alvo: 'spectro',
  },
];
