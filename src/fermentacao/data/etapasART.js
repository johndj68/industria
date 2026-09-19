/**
 * etapasART.js — Etapas do Simulador ART (Açúcares Redutores Totais)
 *
 * 22 etapas do protocolo TE-088 pelo método de Fehling.
 */
export const etapas = [
  { id: 0,  titulo: "Montar Filtração",                              descricao: "Arraste o funil para encaixar no coletor",                                       itemNecessario: "funil",    alvo: "coletor"       },
  { id: 1,  titulo: "Filtrar Amostra",                               descricao: "Arraste a amostra para o funil",                                                 itemNecessario: "amostra",  alvo: "coletor"       },
  { id: 2,  titulo: "Posicionar Balão na Balança",                   descricao: "Arraste o balão até a balança",                                                  itemNecessario: "balao",    alvo: "balanca"       },
  { id: 3,  titulo: "Pesar Amostra",                                 descricao: "Arraste a amostra filtrada até a balança",                                       itemNecessario: "coletor",  alvo: "balanca"       },
  { id: 4,  titulo: "Carregar Pipeta",                               descricao: "Arraste a pipeta de 20mL até o NaOH 20%",                                       itemNecessario: "pipeta",   alvo: "naoh"          },
  { id: 5,  titulo: "Transferir NaOH",                               descricao: "Arraste a pipeta até o balão da bancada",                                        itemNecessario: "pipeta",   alvo: "balao-bancada" },
  { id: 6,  titulo: "Aquecer no Microondas",                         descricao: "Arraste o balão até o microondas",                                               itemNecessario: "balao",    alvo: "microondas"    },
  { id: 7,  titulo: "Carregar Pipeta com Açúcar Invertido",          descricao: "Arraste a pipeta até o Açúcar Invertido",                                        itemNecessario: "pipeta",   alvo: "acucar"        },
  { id: 8,  titulo: "Transferir Açúcar Invertido",                   descricao: "Arraste a pipeta até o balão da bancada",                                        itemNecessario: "pipeta",   alvo: "balao-bancada" },
  { id: 9,  titulo: "Adicionar Fenolftaleína",                       descricao: "Arraste a Fenolftaleína até o balão da bancada",                                 itemNecessario: "fenol",    alvo: "balao-bancada" },
  { id: 10, titulo: "Carregar Pipeta com HCl",                       descricao: "Arraste a pipeta até o HCl",                                                    itemNecessario: "pipeta",   alvo: "acido"         },
  { id: 11, titulo: "Titular com HCl",                               descricao: "Goteje o HCl até atingir o ponto vermelho cereja",                              itemNecessario: "pipeta",   alvo: "balao-bancada" },
  { id: 12, titulo: "Preparar EDTA 4%",                              descricao: "Leve a pipeta até o frasco de EDTA 4% e encha até a metade",                   itemNecessario: "pipeta",   alvo: "edta4"         },
  { id: 13, titulo: "Adicionar EDTA 4%",                             descricao: "Leve a pipeta com EDTA 4% até o balão para neutralizar a solução",              itemNecessario: "pipeta",   alvo: "balao-bancada" },
  { id: 14, titulo: "Completar volume com água",                     descricao: "Arraste a água até o balão e complete o volume até o menisco",                  itemNecessario: "agua",     alvo: "balao-bancada" },
  { id: 15, titulo: "Adicionar Fehling A ao TE-088",                 descricao: "Leve o Fehling A até o Determinador TE-088",                                    itemNecessario: "fehlingA", alvo: "te088"         },
  { id: 16, titulo: "Adicionar Fehling B ao TE-088",                 descricao: "Leve o Fehling B até o Determinador TE-088",                                    itemNecessario: "fehlingB", alvo: "te088"         },
  { id: 17, titulo: "Ligar Determinador TE-088",                     descricao: "Clique no Determinador TE-088 para iniciar o aquecimento",                                         alvo: "te088"         },
  { id: 18, titulo: "Adicionar Azul de Metileno",                    descricao: "Leve a pipeta até o Azul de Metileno e encha-a",                                itemNecessario: "pipeta",   alvo: "azul-metileno" },
  { id: 19, titulo: "adicionar 3 gotas de azul de metileno no TE-088", descricao: "Leve a pipeta com Azul de Metileno até o TE-088",                             itemNecessario: "pipeta",   alvo: "te088"         },
  { id: 20, titulo: "Transferir solução para a bureta do TE-088",    descricao: "Leve o balão da bancada até o TE-088",                                          itemNecessario: "balao",    alvo: "te088"         },
  { id: 21, titulo: "Realizar titulação na bureta",                  descricao: "Clique na bureta direita para iniciar a titulação",                                               alvo: "bureta-direita"},
];
