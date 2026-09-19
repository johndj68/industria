/**
 * TuboEnsaio.jsx — Tubo de Ensaio Cônico 10 mL (Tubo 1 / Amostra)
 * Wrapper fino sobre TuboConicoSVG com id padrão 'main'.
 */
import React from 'react';
import TuboConicoSVG from './TuboConicoSVG';

const TuboEnsaio = (props) => <TuboConicoSVG id="main" {...props} />;

export default TuboEnsaio;
