import { gerarLeituraGlCo2, calcGlCo2 } from '../utils/glCo2Calculo';

/**
 * useDensimetroGlCo2 — lógica de clique do densímetro digital (step 6).
 *
 * Contém: handleClickDensimetro com geração de leitura simulada e cálculo °GL.
 */
export const useDensimetroGlCo2 = ({
  etapaAtual,
  balaoNoDensimetro,
  densimetroLendo,
  resultadoGl,
  setDensimetroLendo,
  setLeituraRaw,
  setResultadoGl,
  celebrarAcerto,
  proximaEtapa,
}) => {

  const handleClickDensimetro = () => {
    if (etapaAtual !== 6 || !balaoNoDensimetro || densimetroLendo || resultadoGl) return;
    setDensimetroLendo(true);
    setTimeout(() => {
      const raw = gerarLeituraGlCo2();
      const gl  = calcGlCo2(raw);
      setLeituraRaw(raw);
      setResultadoGl(gl);
      setDensimetroLendo(false);
      celebrarAcerto(200);
      proximaEtapa();
    }, 3500);
  };

  return { handleClickDensimetro };
};
