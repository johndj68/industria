/**
 * etapasArtMosto.js — ART no Mosto e Caldos
 *
 * 28 etapas · Lane-Eynon / Redutec · Determinador TE-088
 * Fonte: Método padrão de análise ART em mosto/caldo
 */
export const etapas = [
  { id:  0, titulo: 'Acoplar Funil ao Béquer 400 mL',          descricao: 'Arraste o funil até o béquer de 400 mL para acoplá-lo.',                              item: 'funil',     alvo: 'bequer400'    },
  { id:  1, titulo: 'Colocar Algodão no Funil',                 descricao: 'Arraste o algodão até o funil acoplado para preparar a filtração.',                  item: 'algodao',   alvo: 'bequer400'    },
  { id:  2, titulo: 'Filtrar a Amostra de Mosto',               descricao: 'Arraste a Amostra de Mosto até o béquer para filtrar em algodão.',                   item: 'amostra',   alvo: 'bequer400'    },
  { id:  3, titulo: 'Levar Balão 200 mL à Balança',            descricao: 'Arraste o balão volumétrico de 200 mL até a balança de precisão.',                   item: 'balao200',  alvo: 'balanca'      },
  { id:  4, titulo: 'Tarar a Balança',                          descricao: 'Clique na balança para zerar (tarar) com o balão vazio.',                            item: null,        alvo: 'balanca'      },
  { id:  5, titulo: 'Pesar 50 g da Amostra Filtrada',          descricao: 'Arraste o béquer de 400 mL até a balança — pese 50 g ± 0,1 g no balão.',            item: 'bequer400', alvo: 'balanca'      },
  { id:  6, titulo: 'Completar Volume com Água',               descricao: 'Arraste a água desmineralizada até o balão de 200 mL para completar até o menisco.', item: 'agua',      alvo: 'balao200'     },
  { id:  7, titulo: 'Coletar 10 mL com a Pipeta',              descricao: 'Arraste a pipeta até o balão de 200 mL para coletar 10 mL da solução.',              item: 'pipeta',    alvo: 'balao200'     },
  { id:  8, titulo: 'Transferir para 2º Balão de 200 mL',      descricao: 'Arraste a pipeta até o segundo balão de 200 mL para transferir os 10 mL.',           item: 'pipeta',    alvo: 'balao200dois' },
  { id:  9, titulo: 'Adicionar Água ao 2º Balão',              descricao: 'Arraste a água até o 2º balão para cobrir o bulbo do termômetro.',                  item: 'agua',      alvo: 'balao200dois' },
  { id: 10, titulo: 'Aquecer no Micro-ondas (30 s)',           descricao: 'Arraste o 2º balão até o micro-ondas — 30 segundos em aquecimento.',                item: 'balao200dois', alvo: 'microondas' },
  { id: 11, titulo: 'Verificar Temperatura (65 °C)',           descricao: 'Arraste o termômetro até o 2º balão para confirmar 65 °C.',                         item: 'termometro',alvo: 'balao200dois' },
  { id: 12, titulo: 'Coletar HCl 6,34 mol/L',                 descricao: 'Arraste a pipeta até o frasco de Ácido Clorídrico 6,34 mol/L.',                     item: 'pipeta',    alvo: 'hcl'          },
  { id: 13, titulo: 'Adicionar HCl ao 2º Balão',              descricao: 'Arraste a pipeta até o 2º balão para adicionar o HCl e aguardar temperatura ambiente.', item: 'pipeta',  alvo: 'balao200dois' },
  { id: 14, titulo: 'Adicionar 3 Gotas de Fenolftaleína 1%',  descricao: 'Arraste a Fenolftaleína 1% até o 2º balão para adicionar 3 gotas.',                 item: 'fenol',     alvo: 'balao200dois' },
  { id: 15, titulo: 'Coletar Hidróxido de Sódio 20%',         descricao: 'Arraste a pipeta até o frasco de NaOH 20%.',                                        item: 'pipeta',    alvo: 'naoh'         },
  { id: 16, titulo: 'Neutralizar até Rosa Escuro',             descricao: 'Arraste a pipeta até o 2º balão — neutralize até coloração rosa escuro/vinho.',     item: 'pipeta',    alvo: 'balao200dois' },
  { id: 17, titulo: 'Coletar EDTA 4%',                        descricao: 'Arraste a pipeta até o frasco de EDTA 4%.',                                         item: 'pipeta',    alvo: 'edta'         },
  { id: 18, titulo: 'Adicionar EDTA — Eliminar Cor Rósea',    descricao: 'Arraste a pipeta até o 2º balão — adicione EDTA até retornar para incolor.',        item: 'pipeta',    alvo: 'balao200dois' },
  { id: 19, titulo: 'Completar Volume — 2º Balão',            descricao: 'Arraste a água até o 2º balão e complete o volume até o menisco de 200 mL.',        item: 'agua',      alvo: 'balao200dois' },
  { id: 20, titulo: 'Ligar o Determinador TE-088',            descricao: 'Clique no TE-088 para ligar e iniciar o aquecimento da caldeira.',                  item: null,        alvo: 'te088'        },
  { id: 21, titulo: 'Adicionar Fehling A ao TE-088',          descricao: 'Arraste o frasco de Fehling A até o determinador TE-088.',                          item: 'fehlinga',  alvo: 'te088'        },
  { id: 22, titulo: 'Adicionar Fehling B ao TE-088',          descricao: 'Arraste o frasco de Fehling B até o determinador TE-088.',                          item: 'fehlingb',  alvo: 'te088'        },
  { id: 23, titulo: 'Encher Bureta com a Amostra',            descricao: 'Arraste o 2º balão até o TE-088 para encher a bureta com a amostra preparada.',    item: 'balao200dois', alvo: 'te088'   },
  { id: 24, titulo: 'Adicionar Amostra à Caldeira',           descricao: 'Clique na bureta do TE-088 para adicionar ~15 mL da amostra à caldeira.',          item: null,        alvo: 'te088'        },
  { id: 25, titulo: 'Adicionar Azul de Metileno 1%',          descricao: 'Arraste o Azul de Metileno 1% até o TE-088 — adicione 4 gotas ao líquido da caldeira.', item: 'azulmetileno', alvo: 'te088' },
  { id: 26, titulo: 'Titular até Viragem Vermelho Tijolo',    descricao: 'Clique novamente na bureta — titule gota a gota até a viragem do azul para vermelho tijolo.', item: null, alvo: 'te088' },
  { id: 27, titulo: 'Anotar o Volume Gasto',                  descricao: 'Titulação concluída com viragem para vermelho tijolo. Anote o volume gasto.',      item: null,        alvo: null           },
];
