import { useEffect } from 'react';

/**
 * useMicrodestiladorGlCo2 — lógica do microdestilador e destilação.
 *
 * Contém: handleClickMicrodestilador + efeito de destilação progressiva.
 */
export const useMicrodestiladorGlCo2 = ({
  etapaAtual,
  balaoAcoplado,
  microdestiladorLigado,
  microdestiladorAquecendo,
  setMicrodestiladorAquecendo,
  setMicrodestiladorLigado,
  setBalaoAcoplado,
  setDestilando,
  setNivelBalao,
  setBalaoComDestilado,
  celebrarAcerto,
  proximaEtapa,
}) => {

  // ── Destilação: timer que preenche o balão ────────────
  useEffect(() => {
    if (etapaAtual !== 4 || !balaoAcoplado) return;
    setDestilando(true);
    let nivel = 0;
    const id = setInterval(() => {
      nivel += 5;
      setNivelBalao(Math.min(nivel, 90));
      if (nivel >= 90) {
        clearInterval(id);
        setDestilando(false);
        setBalaoComDestilado(true);
        setBalaoAcoplado(false);  // desacopla: balão volta para bancada arrastável
        setTimeout(() => { celebrarAcerto(100); proximaEtapa(); }, 800);
      }
    }, 380);
    return () => clearInterval(id);
  }, [etapaAtual, balaoAcoplado]);

  // ── Click: liga o microdestilador (step 1) ────────────
  const handleClickMicrodestilador = () => {
    if (etapaAtual !== 1 || microdestiladorLigado || microdestiladorAquecendo) return;
    setMicrodestiladorAquecendo(true);
    setTimeout(() => {
      setMicrodestiladorAquecendo(false);
      setMicrodestiladorLigado(true);
      celebrarAcerto();
      proximaEtapa();
    }, 3000);
  };

  return { handleClickMicrodestilador };
};
