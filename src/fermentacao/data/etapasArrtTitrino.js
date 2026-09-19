/**
 * etapasArrtTitrino.js — ARRT em Dornas · Método Titrino com Micro-ondas
 *
 * 25 etapas · Filtração em algodão → Micro-ondas → Reagentes → Titrino Plus
 * Fonte: COR-IND-QUA-PO-07 (método Dorna)
 */
export const etapas = [
  { id:  0, titulo: 'Acoplar Funil ao Béquer 400 mL',              descricao: 'Arraste o funil até o béquer de 400 mL para acoplá-lo.',                          item: 'funil',      alvo: 'bequer400'  },
  { id:  1, titulo: 'Colocar Algodão no Funil',                    descricao: 'Arraste o algodão até o funil acoplado no béquer de 400 mL.',               item: 'algodao',    alvo: 'bequer400'  },
  { id:  2, titulo: 'Filtrar a Amostra de Dorna',                  descricao: 'Arraste a Amostra Dorna até o béquer de 400 mL para filtrar em algodão.',          item: 'amostra',    alvo: 'bequer400'  },
  { id:  3, titulo: 'Coletar 15 mL com a Pipeta',                  descricao: 'Arraste a pipeta até o béquer de 400 mL para coletar 15 mL da amostra filtrada.',  item: 'pipeta',     alvo: 'bequer400'  },
  { id:  4, titulo: 'Transferir para o Béquer 150 mL',             descricao: 'Arraste a pipeta até o béquer de 150 mL para transferir os 15 mL.',               item: 'pipeta',     alvo: 'bequer150'  },
  { id:  5, titulo: 'Aquecer no Micro-ondas (30 s)',               descricao: 'Arraste o béquer de 150 mL até o micro-ondas — 30 segundos em ebulição.',         item: 'bequer150',  alvo: 'microondas' },
  { id:  6, titulo: 'Coletar 2 mL de HCl 6,34 N',                 descricao: 'Arraste a pipeta até o frasco de Ácido Clorídrico 6,34 N.',                       item: 'pipeta',     alvo: 'hcl'        },
  { id:  7, titulo: 'Adicionar HCl ao Béquer',                     descricao: 'Arraste a pipeta até o béquer de 150 mL para adicionar o HCl e aguardar resfriar.', item: 'pipeta',   alvo: 'bequer150'  },
  { id:  8, titulo: 'Adicionar 3 Gotas de Fenolftaleína 1%',       descricao: 'Arraste o frasco de Fenolftaleína até o béquer para adicionar 3 gotas.',           item: 'fenol',      alvo: 'bequer150'  },
  { id:  9, titulo: 'Coletar Hidróxido de Sódio 20%',              descricao: 'Arraste a pipeta até o frasco de NaOH 20%.',                                      item: 'pipeta',     alvo: 'naoh'       },
  { id: 10, titulo: 'Neutralizar até Vermelho-Cereja',             descricao: 'Arraste a pipeta até o béquer — neutralize até coloração vermelho-cereja.',       item: 'pipeta',     alvo: 'bequer150'  },
  { id: 11, titulo: 'Coletar 5 mL de Fehling B',                   descricao: 'Arraste a pipeta até o frasco de Fehling B.',                                     item: 'pipeta',     alvo: 'fehlingb'   },
  { id: 12, titulo: 'Adicionar Fehling B ao Béquer',               descricao: 'Arraste a pipeta até o béquer de 150 mL para adicionar Fehling B.',               item: 'pipeta',     alvo: 'bequer150'  },
  { id: 13, titulo: 'Coletar 5 mL de Fehling A',                   descricao: 'Arraste a pipeta até o frasco de Fehling A.',                                     item: 'pipeta',     alvo: 'fehlinga'   },
  { id: 14, titulo: 'Adicionar Fehling A ao Béquer',               descricao: 'Arraste a pipeta até o béquer — líquido fica vermelho muito escuro.',             item: 'pipeta',     alvo: 'bequer150'  },
  { id: 15, titulo: 'Acoplar Vidro Relógio sobre o Béquer',        descricao: 'Arraste o vidro relógio para cobrir o béquer de 150 mL.',                         item: 'vidrorel',   alvo: 'bequer150'  },
  { id: 16, titulo: '2º Aquecimento no Micro-ondas (30 s)',        descricao: 'Arraste o béquer (com vidro relógio) até o micro-ondas.',                         item: 'bequer150',  alvo: 'microondas' },
  { id: 17, titulo: 'Adicionar 35 mL de Água Desmineralizada',     descricao: 'Arraste a água desmineralizada até o béquer e aguarde atingir temperatura ambiente.', item: 'agua',  alvo: 'bequer150'  },
  { id: 18, titulo: 'Coletar 10 mL de Iodeto de Potássio 30%',    descricao: 'Arraste a pipeta até o frasco de Iodeto de Potássio 30%.',                        item: 'pipeta',     alvo: 'iodeto'     },
  { id: 19, titulo: 'Adicionar Iodeto de Potássio ao Béquer',      descricao: 'Arraste a pipeta até o béquer de 150 mL para adicionar o iodeto.',               item: 'pipeta',     alvo: 'bequer150'  },
  { id: 20, titulo: 'Coletar 10 mL de H₂SO₄ 25%',                 descricao: 'Arraste a pipeta até o frasco de Ácido Sulfúrico 25%.',                           item: 'pipeta',     alvo: 'sulfurico'  },
  { id: 21, titulo: 'Adicionar Ácido Sulfúrico ao Béquer',         descricao: 'Arraste a pipeta até o béquer para adicionar o Ácido Sulfúrico.',                 item: 'pipeta',     alvo: 'bequer150'  },
  { id: 22, titulo: 'Levar Béquer ao Titrino Plus',                descricao: 'Arraste o béquer de 150 mL até o Titrino Plus.',                                  item: 'bequer150',  alvo: 'titrino'    },
  { id: 23, titulo: 'Selecionar Método Dorna',                     descricao: 'Clique no botão "DORNA" do Titrino Plus para iniciar a leitura automática.',     item: null,         alvo: 'titrino'    },
  { id: 24, titulo: 'Anotar o Resultado de ARRT',                  descricao: 'Leitura concluída. Registre o valor de ARRT exibido pelo Titrino Plus.',          item: null,         alvo: null         },
];
