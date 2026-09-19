/**
 * etapasGlCuba.js — Protocolo de Determinação de Teor Alcoólico (°GL)
 *
 * 8 etapas · Microdestilação + Densímetro Digital
 * Amostra: Cuba · Dorna · Volante

 */
export const etapas = [
  {
    id: 0,
    titulo: 'Medir 25 mL de Amostra',
    descricao: 'Arraste a Amostra de Cuba até a proveta para medir 25 mL da amostra.',
    item: 'amostra',
    alvo: 'proveta',
  },
  {
    id: 1,
    titulo: 'Ligar o Microdestilador',
    descricao: 'Clique no microdestilador para iniciar o aquecimento.',
    item: null,
    alvo: 'microdestilador',
  },
  {
    id: 2,
    titulo: 'Transferir Amostra ao Microdestilador',
    descricao: 'Arraste a proveta com 25 mL até o microdestilador para transferir a amostra.',
    item: 'proveta',
    alvo: 'microdestilador',
  },
  {
    id: 3,
    titulo: 'Acoplar Balão ao Condensador',
    descricao: 'Arraste o balão volumétrico de 50 mL até a saída do condensador para coletar o destilado.',
    item: 'balao',
    alvo: 'microdestilador',
  },
  {
    id: 4,
    titulo: 'Aguardar Destilação',
    descricao: 'Aguarde a destilação completar o volume do balão de 50 mL. O ponteiro do condensador deve entrar 2–3 cm no gargalo.',
    item: null,
    alvo: null,
  },
  {
    id: 5,
    titulo: 'Levar Balão ao Densímetro',
    descricao: 'Arraste o balão com destilado até o densímetro digital para análise.',
    item: 'balao',
    alvo: 'densimetro',
  },
  {
    id: 6,
    titulo: 'Realizar Leitura',
    descricao: 'Clique no densímetro para iniciar a leitura de densidade e teor alcoólico.',
    item: null,
    alvo: 'densimetro',
  },
  {
    id: 7,
    titulo: 'Registrar Resultado',
    descricao: 'Leitura concluída. Anote o valor de °GL exibido. Lembre: % Álcool = leitura / 5.',
    item: null,
    alvo: null,
  },
];
