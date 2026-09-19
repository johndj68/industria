/**
 * FrascoReagente.jsx — SVG de frasco de reagente de laboratório
 *
 * Componente compartilhado entre SilicaBaixa e Viabilidade.
 * Renderiza um frasco de vidro com:
 *   - Tampa e gargalo
 *   - Corpo transparente com nível de líquido animável
 *   - Brilho lateral (efeito de vidro)
 *   - Rótulo com nome e sub-nome do reagente
 *
 * Props:
 *   cor      {string}  — cor CSS do líquido (ex: 'rgba(220,160,40,.85)')
 *   label    {string}  — nome principal exibido no rótulo (obrigatório)
 *   sub      {string}  — linha secundária do rótulo (opcional)
 *   nivel    {number}  — percentual de líquido 0–100 (padrão: 70)
 *   w        {number}  — largura do SVG em px (padrão: 54)
 *   h        {number}  — altura base do corpo em px (padrão: 80)
 *   nH       {number}  — altura do gargalo em px (padrão: 26)
 *   extraH   {number}  — espaço extra abaixo do corpo no viewBox (padrão: 18)
 *
 * Uso básico:
 *   <FrascoReagente cor="rgba(220,160,40,.85)" label="Molybdate 3" nivel={72} />
 *
 * Uso com dimensões customizadas (para SilicaBaixa):
 *   <FrascoReagente cor="..." label="..." w={58} h={82} nH={24} extraH={20} />
 */

const FrascoReagente = ({
  cor,
  label,
  sub,
  nivel  = 70,
  w      = 54,
  h      = 80,
  nH     = 26,
  extraH = 18,
}) => {
  // Gera um ID único para os gradientes SVG a partir do label,
  // usando regex robusta que remove qualquer char não alfanumérico
  // (necessário para labels com subscripts como H₂O ou pontos)
  const uid = label.replace(/[^a-zA-Z0-9]/g, '');

  const bx = 4;
  const by = nH + 4;     // topo do corpo do frasco
  const bh = h - by - 2; // altura útil do corpo

  return (
    <svg
      width={w}
      height={h + extraH}
      viewBox={`0 0 ${w} ${h + extraH}`}
      role="img"
      aria-label={`Frasco de ${label}`}
    >
      <defs>
        {/* Gradiente de brilho lateral (efeito vidro) */}
        <linearGradient id={`fg${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.32)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>

        {/* Máscara para o líquido ficar dentro do corpo do frasco */}
        <clipPath id={`fc${uid}`}>
          <rect x={bx} y={by} width={w - bx * 2} height={bh} rx="6" />
        </clipPath>
      </defs>

      {/* Tampa */}
      <rect
        x={w / 2 - 11} y="0" width="22" height="10" rx="4"
        fill="#455a64" stroke="#37474f" strokeWidth="1"
      />

      {/* Gargalo */}
      <rect
        x={w / 2 - 8} y="8" width="16" height={nH}
        fill="rgba(200,235,255,0.14)" stroke="#94a3b8" strokeWidth="1.4"
      />

      {/* Corpo do frasco (vidro) */}
      <rect
        x={bx} y={by} width={w - bx * 2} height={bh} rx="6"
        fill="rgba(200,235,255,0.10)" stroke="#94a3b8" strokeWidth="1.4"
      />

      {/* Líquido — clipped ao corpo, altura proporcional ao nivel */}
      <g clipPath={`url(#fc${uid})`}>
        <rect
          x={bx}
          y={by + bh * (1 - nivel / 100)}
          width={w - bx * 2}
          height={bh * (nivel / 100)}
          fill={cor}
          opacity="0.88"
        />
      </g>

      {/* Brilho lateral — simula reflexo em vidro */}
      <rect
        x={bx + 6} y={by + 8} width="5" height={bh * 0.55} rx="2.5"
        fill={`url(#fg${uid})`}
      />

      {/* Rótulo branco com nome do reagente */}
      <rect
        x={bx + 4} y={by + bh * 0.44}
        width={w - bx * 2 - 8} height="24" rx="3"
        fill="rgba(255,255,255,0.92)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.8"
      />
      <text
        x={w / 2} y={by + bh * 0.585}
        textAnchor="middle" fontSize="7.2" fontWeight="700"
        fill="#0d2137" fontFamily="monospace"
      >
        {label}
      </text>
      {sub && (
        <text
          x={w / 2} y={by + bh * 0.72}
          textAnchor="middle" fontSize="5.8"
          fill="#1a3a5e" fontFamily="sans-serif"
        >
          {sub}
        </text>
      )}
    </svg>
  );
};

export default FrascoReagente;
