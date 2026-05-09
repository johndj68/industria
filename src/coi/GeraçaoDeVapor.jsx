import { useState, useEffect, useCallback } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatClock(d) {
  return d.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  }).replace(",", "");
}
 
// ─── Modal component ──────────────────────────────────────────────────────────
function EquipModal({ modal, equipState, onClose, onSetStatus, onSetMode, onReset }) {
  if (!modal) return null;
  const { id, name } = modal;
  const st = equipState[id] || { status: "OPERANDO", mode: "AUTO", value: "50.0", alarm: false };
  const hasAlarm = id.includes("ET007") || id.includes("MB3") || id.includes("DESMIN");
 
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-title">[{id}] {name}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-row"><label>TAG:</label><span className="mval">{id}</span></div>
          <div className="modal-row"><label>Descrição:</label><span className="mval" style={{ color: "#94a3b8" }}>{name}</span></div>
          <div className="modal-row"><label>Status:</label><span className={`mval${st.alarm ? " alarm" : ""}`}>{st.status}</span></div>
          <div className="modal-row"><label>Modo:</label><span className="mval" style={{ color: "#60a5fa" }}>{st.mode}</span></div>
          <div className="modal-row"><label>Valor Atual:</label><span className="mval">+{st.value}</span></div>
          <div className="modal-row"><label>Timestamp:</label><span className="mval" style={{ color: "#94a3b8" }}>{new Date().toLocaleString("pt-BR")}</span></div>
          {hasAlarm && (
            <div className="modal-row"><label>⚠ ALARME ATIVO</label><span className="mval alarm">SOBRECARGA / TRIP</span></div>
          )}
          <div className="modal-btn-row">
            <button className="modal-btn btn-liga"    onClick={() => onSetStatus(id, "LIGADO")}>LIGA</button>
            <button className="modal-btn btn-desliga" onClick={() => onSetStatus(id, "DESLIGADO")}>DESLIGA</button>
          </div>
          <div className="modal-btn-row">
            <button className="modal-btn btn-auto"   onClick={() => onSetMode(id, "AUTO")}>AUTO</button>
            <button className="modal-btn btn-manual" onClick={() => onSetMode(id, "MANUAL")}>MANUAL</button>
            <button className="modal-btn btn-reset"  onClick={() => onReset(id)}>RESET</button>
          </div>
        </div>
      </div>
    </div>
  );
}
 
// ─── Alarm Panel modal ────────────────────────────────────────────────────────
function AlarmModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div className="modal-title">⚠ PAINEL DE ALARMES ATIVOS</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ fontSize: 11, fontFamily: "monospace" }}>
          {[
            { lvl: "🔴 CRIT", color: "#ff4444", msg: "SOBRECARGA ESTEIRA 171-ET-007" },
            { lvl: "🔴 TRIP", color: "#ff4444", msg: "MOTOBOMBA 3 ÁGUA - MOTOR EM TRIP" },
            { lvl: "🔴 TRIP", color: "#ff4444", msg: "BOMBA ÁGUA DESMINERALIZADA - TRIP" },
            { lvl: "🔴 FALHA", color: "#ff4444", msg: "COMPORTA TT-03 - FALHA" },
            { lvl: "🟡 WARN", color: "#ffaa00", msg: "CALDEIRA 1 - EQUILÍBRIO DESABILITADO" },
            { lvl: "🟡 WARN", color: "#ffaa00", msg: "ESTEIRA 1 - DESABILITADA/TRIP" },
            { lvl: "🟡 WARN", color: "#ffaa00", msg: "NÍVEL CAPTAÇÃO - EXTRA BAIXO" },
          ].map(({ lvl, color, msg }, i) => (
            <div key={i} className="modal-row" style={{ borderColor: color }}>
              <label style={{ color }}>{lvl}</label>
              <span className="mval" style={{ color }}>{msg}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: 8, background: "#0a1628", borderRadius: 3, color: "#94a3b8", fontSize: 10 }}>
            Última atualização: {new Date().toLocaleString("pt-BR")}<br />
            Operador: JOHN | Turno: B
          </div>
          <div className="modal-btn-row">
            <button className="modal-btn btn-auto"  onClick={onClose}>RECONHECER ALARMES</button>
            <button className="modal-btn btn-reset" onClick={onClose}>FECHAR</button>
          </div>
        </div>
      </div>
    </div>
  );
}


 
// ─── PANEL 1 — Caldeiras Master View ─────────────────────────────────────────
function PanelMaster({ open, temperaturaCaldeira = 88.6 }) {
  

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">◈ Caldeiras — Visão Master</div>
        <div style={{ fontSize: 9, color: "#94a3b8", fontFamily: "monospace" }}>EC_MASTER_VIEW</div>
        <div className="panel-status-pills">
          <span className="pill pill-a">A</span>
          <span className="pill pill-u">U</span>
          <span className="pill pill-m">M</span>
        </div>
      </div>
      <div className="panel-svg-container">
        <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
          <rect width="800" height="500" fill="#0a0e1a" />
          <text x="400" y="260" className="lobby-mark" textAnchor="middle">LOBBY</text>
          <line x1="400" y1="0" x2="400" y2="500" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
          <line x1="0" y1="250" x2="800" y2="250" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />
 
          {/* MASTER CENTER BOX */}
          <g className="clickable" onClick={() => open("MASTER", "Sistema Master de Caldeiras")}>
            <rect x="290" y="60" width="220" height="120" fill="#0a1628" stroke="#2563eb" strokeWidth="2" rx="3" />
            <rect x="290" y="60" width="220" height="22" fill="#0d2048" rx="3" />
            <text x="400" y="76" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="Arial">MASTER</text>
            <text x="320" y="100" fill="#94a3b8" fontSize="9" fontFamily="monospace">GERADORES</text>
            <rect x="305" y="104" width="90" height="16" fill="#0a1628" stroke="#1e3a5f" strokeWidth="1" rx="1" />
            <text x="350" y="115" fill="#00ff88" fontSize="10" fontFamily="monospace" textAnchor="middle">+0.00 Kgf/cm²</text>
            <text x="470" y="100" fill="#94a3b8" fontSize="9" fontFamily="monospace" textAnchor="middle">CALDEIRAS</text>
            <rect x="420" y="104" width="80" height="16" fill="#0a1628" stroke="#1e3a5f" strokeWidth="1" rx="1" />
            <text x="460" y="115" fill="#00ff88" fontSize="10" fontFamily="monospace" textAnchor="middle">+0.0 Kgf/cm²</text>
            <rect x="305" y="125" width="90" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="350" y="135" fill="#ffaa00" fontSize="10" fontFamily="monospace" textAnchor="middle">+67.0 Kgf/cm²</text>
            <rect x="400" y="125" width="90" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="445" y="135" fill="#60a5fa" fontSize="10" fontFamily="monospace" textAnchor="middle">+0.0 Kgf/cm²</text>
            <rect x="305" y="141" width="90" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="350" y="151" fill="#00ff88" fontSize="10" fontFamily="monospace" textAnchor="middle">+100.0 %</text>
            <text x="340" y="172" fill="#60a5fa" fontSize="10" fontFamily="monospace" textAnchor="middle">+0.0 Ton/h</text>
            <text x="460" y="172" fill="#60a5fa" fontSize="10" fontFamily="monospace" textAnchor="middle">+0.0 Ton/h</text>
            <rect x="330" y="178" width="140" height="24" fill="#1a0000" stroke="#dc2626" strokeWidth="1.5" rx="2" />
            <text x="400" y="189" fill="#ff4444" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="Arial">EQUILÍBRIO</text>
            <text x="400" y="199" fill="#ff4444" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="Arial">DESABILITADO</text>
          </g>
 
          {/* AJUSTE CARGA C1 */}

          <g transform="translate(0,-20)" className="clickable" onClick={() => open("AJUSTE_C1", "Ajuste de Carga Caldeira 1")}>
            <rect x="135" y="120" width="100" height="30" fill="#0a1628" stroke="#2a3f6f" strokeWidth="1" rx="2" />
            <text x="185" y="132" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="Arial">AJUSTE CARGA C1</text>
            <text x="185" y="145" fill="#00ff88" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">+1.000</text>
          </g>
 
          {/* AJUSTE CARGA C2 */}
          <g transform="translate(0,-20)" className="clickable" onClick={() => open("AJUSTE_C2", "Ajuste de Carga Caldeira 2")}>
            <rect x="565" y="120" width="100" height="30" fill="#0a1628" stroke="#2a3f6f" strokeWidth="1" rx="2" />
            <text x="615" y="132" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="Arial">AJUSTE CARGA C2</text>
            <text x="615" y="145" fill="#00ff88" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">+1.000</text>
          </g>
 
          <line x1="290" y1="125" x2="240" y2="125" stroke="#60a5fa" strokeWidth="3" className="pipe-flow" />
          <line x1="510" y1="125" x2="560" y2="125" stroke="#60a5fa" strokeWidth="3" className="pipe-flow-rev" />
 
          {/* CALDEIRA 1 */}
         <g transform="translate(0, 5)">
          <text x="100" y="220" fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="Arial">CALDEIRA 1</text>
          <rect x="30" y="228" width="80" height="60" fill="#061020" stroke="#2a3f6f" strokeWidth="1" rx="2" />
          <text x="70" y="241" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="Arial">LOCAL</text>
          <circle cx="48" cy="252" r="5" fill="#00ff44" />
          <text x="56" y="256" fill="#00ff88" fontSize="9" fontFamily="Arial">LOCAL</text>
          <circle cx="48" cy="265" r="5" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          <text x="56" y="269" fill="#94a3b8" fontSize="9" fontFamily="Arial">MASTER</text>
          <circle cx="48" cy="278" r="5" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          <text x="56" y="282" fill="#94a3b8" fontSize="9" fontFamily="Arial">LEAF</text>
          </g>
          <rect x="130" y="225" width="60" height="160" fill="#0d1f3a" stroke="#2563eb" strokeWidth="2" rx="4" />
          {[140,150,160,170,180].map(x => <line key={x} x1={x} y1="240" x2={x} y2="380" stroke="#1e3a5f" strokeWidth="1" />)}
          <rect x="130" y="225" width="60" height="160" fill="transparent" className="clickable" onClick={() => open("CALDEIRA1", "Caldeira 1 - Geração de Vapor")} />
 
          <rect x="130" y="385" width="60" height="16" fill="#061020" stroke="#2a3f6f" strokeWidth="1" rx="1" />
          <text x="160" y="396" fill="#ffaa00" fontSize="9" fontFamily="monospace" textAnchor="middle">
          +{temperaturaCaldeira.toFixed(1)} °C
        </text>
          <rect x="200" y="345" width="45" height="18" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="1" rx="2" className="clickable" onClick={() => open("AUTO_C1", "Modo Automático C1")} />
          <text x="222" y="357" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="Arial">AUTO</text>
          <rect x="200" y="368" width="45" height="18" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" rx="2" className="clickable" onClick={() => open("AJUSTE_C1_BTN", "Ajuste Fino C1")} />
          <text x="222" y="380" fill="#60a5fa" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="Arial">AJUSTE</text>
 
          <rect x="28" y="295" width="95" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="75" y="305" fill="#ffaa00" fontSize="9" fontFamily="monospace" textAnchor="middle">+67.0 Kgf/cm²</text>
          <rect x="28" y="311" width="95" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="75" y="321" fill="#60a5fa" fontSize="9" fontFamily="monospace" textAnchor="middle">+0.1 Kgf/cm²</text>
          <rect x="28" y="327" width="95" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="75" y="337" fill="#00ff88" fontSize="9" fontFamily="monospace" textAnchor="middle">+8.0 %</text>
          <rect x="28" y="344" width="95" height="16" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1" rx="2" />
          <text x="75" y="355" fill="#fca5a5" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="Arial">DESAB</text>
 
          <rect x="130" y="402" width="60" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="160" y="412" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">+2.0 mmca</text>
          <rect x="130" y="418" width="60" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="160" y="428" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">+2.0 mmca</text>
          <rect x="130" y="434" width="60" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="160" y="444" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+12.3 %</text>
          <text x="160" y="462" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="Arial">MEDIA</text>
          <rect x="140" y="464" width="40" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" rx="1" />
          <text x="160" y="474" fill="#00ff88" fontSize="9" fontFamily="monospace" textAnchor="middle">7.8 %</text>
 
          {/* REL DOS 1-7 (C1) */}
          {[
            { tag:"REL_DOS_1", label:"REL DOS 1", x:265, a:"+4.5 A", pct:"+7.9 %" },
            { tag:"REL_DOS_3", label:"REL DOS 3", x:325, a:"+2.2 A", pct:"+7.9 %" },
            { tag:"REL_DOS_5", label:"REL DOS 5", x:385, a:"+2.5 A", pct:"+7.7 %" },
            { tag:"REL_DOS_7", label:"REL DOS 7", x:445, a:"+4.0 A", pct:"+7.9 %" },
          ].map(({ tag, label, x, a, pct }) => (
            <g key={tag} className="clickable" onClick={() => open(tag, `${label} - Caldeira 1`)}>
              <text x={x} y="307" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">{label}</text>
              <rect x={x-25} y="310" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
              <text x={x} y="319" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">1.000</text>
              <circle cx={x} cy="335" r="14" fill="#7f1d1d" stroke="#dc2626" strokeWidth="2" />
              <text x={x} y="339" fill="#fca5a5" fontSize="7" fontWeight="bold" textAnchor="middle">TRIP</text>
              <rect x={x-25} y="352" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
              <text x={x} y="361" fill="#ff4444" fontSize="8" fontFamily="monospace" textAnchor="middle">{a}</text>
              <rect x={x-25} y="365" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
              <text x={x} y="374" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">{pct}</text>
            </g>
          ))}
 
          {[
            { tag:"REL_DOS_2", label:"REL DOS 2", x:265, a:"+4.0 A", pct:"+8.1 %" },
            { tag:"REL_DOS_4", label:"REL DOS 4", x:325, a:"+4.2 A", pct:"+7.8 %" },
            { tag:"REL_DOS_6", label:"REL DOS 6", x:385, a:"+4.5 A", pct:"+7.6 %" },
          ].map(({ tag, label, x, a, pct }) => (
            <g key={tag} className="clickable" onClick={() => open(tag, `${label} - Caldeira 1`)}>
              <text x={x} y="393" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">{label}</text>
              <rect x={x-25} y="396" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
              <text x={x} y="405" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">1.000</text>
              <circle cx={x} cy="420" r="14" fill="#7f1d1d" stroke="#dc2626" strokeWidth="2" />
              <text x={x} y="424" fill="#fca5a5" fontSize="7" fontWeight="bold" textAnchor="middle">TRIP</text>
              <rect x={x-25} y="437" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
              <text x={x} y="446" fill="#ff4444" fontSize="8" fontFamily="monospace" textAnchor="middle">{a}</text>
              <rect x={x-25} y="451" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
              <text x={x} y="460" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">{pct}</text>
            </g>
          ))}
 
          {/* C2 REL DOS 1 */}
          <g className="clickable" onClick={() => open("REL_C2_DOS1", "Relé Dosagem 1 - Caldeira 2")}>
            <text x="520" y="307" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">REL DOS 1</text>
            <rect x="495" y="310" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="520" y="319" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">1.000</text>
            <circle cx="520" cy="335" r="14" fill="#7f1d1d" stroke="#dc2626" strokeWidth="2" />
            <text x="520" y="339" fill="#fca5a5" fontSize="7" fontWeight="bold" textAnchor="middle">TRIP</text>
            <rect x="495" y="352" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="520" y="361" fill="#ff4444" fontSize="8" fontFamily="monospace" textAnchor="middle">+2.1 A</text>
            <rect x="495" y="365" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="520" y="374" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+0.0 %</text>
          </g>
 
          {/* CALDEIRA 2 */}
          <text x="680" y="220" fill="#e2e8f0" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="Arial">CALDEIRA 2</text>
          <rect x="610" y="225" width="60" height="160" fill="#0d1f3a" stroke="#2563eb" strokeWidth="2" rx="4" />
          {[620,630,640,650,660].map(x => <line key={x} x1={x} y1="240" x2={x} y2="380" stroke="#1e3a5f" strokeWidth="1" />)}
          <rect x="610" y="225" width="60" height="160" fill="transparent" className="clickable" onClick={() => open("CALDEIRA2", "Caldeira 2 - Geração de Vapor")} />
          <rect x="610" y="385" width="60" height="16" fill="#061020" stroke="#2a3f6f" strokeWidth="1" rx="1" />
          <text x="640" y="396" fill="#ffaa00" fontSize="9" fontFamily="monospace" textAnchor="middle">+39.1 °C</text>
 
          <rect x="688" y="228" width="80" height="60" fill="#061020" stroke="#2a3f6f" strokeWidth="1" rx="2" />
          <text x="728" y="241" fill="#e2e8f0" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="Arial">LOCAL</text>
          <circle cx="700" cy="252" r="5" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          <text x="708" y="256" fill="#94a3b8" fontSize="9" fontFamily="Arial">LOCAL</text>
          <circle cx="700" cy="265" r="5" fill="#00ff44" />
          <text x="708" y="269" fill="#00ff88" fontSize="9" fontFamily="Arial">MASTER</text>
          <circle cx="700" cy="278" r="5" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1" />
          <text x="708" y="282" fill="#94a3b8" fontSize="9" fontFamily="Arial">LEAF</text>
 
          <rect x="680" y="295" width="95" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="728" y="305" fill="#ffaa00" fontSize="9" fontFamily="monospace" textAnchor="middle">+57.8 Kgf/cm²</text>
          <rect x="680" y="311" width="95" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="728" y="321" fill="#60a5fa" fontSize="9" fontFamily="monospace" textAnchor="middle">+0.1 Kgf/cm²</text>
          <rect x="680" y="327" width="95" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="728" y="337" fill="#00ff88" fontSize="9" fontFamily="monospace" textAnchor="middle">+100.0 %</text>
          <text x="640" y="462" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="Arial">MEDIA</text>
          <rect x="620" y="464" width="40" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" rx="1" />
          <text x="640" y="474" fill="#00ff88" fontSize="9" fontFamily="monospace" textAnchor="middle">0.0 %</text>
 
          {/* VENTILADORES HT/LT C1 */}
          <g className="clickable" onClick={() => open("VHT_C1", "Ventilador HT - Caldeira 1")}>
            <text x="75" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="Arial">VENTILADOR HT</text>
            <circle cx="75" cy="185" r="22" fill="#0d1f3a" stroke="#2563eb" strokeWidth="2" />
            <text x="75" y="192" fill="#60a5fa" fontSize="18" textAnchor="middle">⊕</text>
            <rect x="52" y="208" width="46" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="75" y="217" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+145.7 A</text>
            <rect x="52" y="221" width="46" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="75" y="230" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+20.0 %</text>
          </g>
          <g className="clickable" onClick={() => open("VLT_C1", "Ventilador LT - Caldeira 1")}>
            <text x="160" y="155" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="Arial">VENTILADOR LT</text>
            <circle cx="160" cy="185" r="22" fill="#0d1f3a" stroke="#2563eb" strokeWidth="2" />
            <text x="160" y="192" fill="#60a5fa" fontSize="18" textAnchor="middle">⊕</text>
            <rect x="137" y="208" width="46" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="160" y="217" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+49.0 A</text>
            <rect x="137" y="221" width="46" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="160" y="230" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+10.0 %</text>
          </g>
 
          {/* O2 Caldeira 1 */}
        <g transform="translate(0, -70)">
          <rect x="2" y="140" width="65" height="70" fill="#061020" stroke="#2a3f6f" strokeWidth="1" rx="2" />
          <text x="34" y="153" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="Arial">O2 CALDEIRA 1</text>

          <rect x="6" y="157" width="57" height="12" fill="#0a1628" stroke="#2a3f6f" strokeWidth="1" />
          <text x="34" y="166" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+4.0 O2</text>

          <rect x="6" y="172" width="57" height="12" fill="#0a1628" stroke="#2a3f6f" strokeWidth="1" />
          <text x="34" y="181" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">+20.0 A</text>

          <rect x="6" y="187" width="57" height="12" fill="#1a0000" stroke="#dc2626" strokeWidth="1" />
          <text x="34" y="196" fill="#ff4444" fontSize="8" fontFamily="monospace" textAnchor="middle">+0.0 %</text>
        </g>
 
          {/* Chart area */}
          <g transform="translate(0, -5)">
          <rect x="250" y="50" width="300" height="250" fill="#050d1a" stroke="#1e3a5f" strokeWidth="1" rx="2" />
          {[["250.0",65],["200.0",100],["150.0",140],["100.0",180],["50.0",225],["0.0",285]].map(([v,y]) => (
            <text key={v} x="270" y={y} fill="#94a3b8" fontSize="8" fontFamily="monospace">{v}</text>
          ))}
          <line x1="285" y1="285" x2="545" y2="285" stroke="#1e3a5f" strokeWidth="0.5" />
          <line x1="285" y1="225" x2="545" y2="225" stroke="#1e3a5f" strokeWidth="0.5" strokeDasharray="2,4" />
          <line x1="285" y1="180" x2="545" y2="180" stroke="#1e3a5f" strokeWidth="0.5" strokeDasharray="2,4" />
          <line x1="285" y1="70" x2="545" y2="70" stroke="#00ff44" strokeWidth="2" opacity="0.7" />
          <polyline points="285,285 330,200 345,200 360,195 375,190 390,188 405,185 420,183 435,182 460,180 480,178 500,175 520,173 540,172" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
         </g>
        </svg>
        
        
      </div>
    </div>
  );
}
 
// ─── PANEL 2 — Caldeira 1 Detail ──────────────────────────────────────────────
function PanelCaldeira1Detail({
  open,
  etapaAtual,
  bombasLigadas = [],
  onBombaClick,
  proximaBomba = null,
  queimadoresLigados = [],
  onQueimadorClick,
  proximoQueimador = null,
  temperaturaCaldeira = 88.6
}) {


const queimadorLigado = (n) => queimadoresLigados.includes(n);
const queimadorPiscando = (n) => proximoQueimador === n;

const getQueimadorVisual = (n) => ({
  stroke: queimadorLigado(n) ? "#22c55e" : queimadorPiscando(n) ? "#60a5fa" : "#f97316",
  chama: queimadorLigado(n) ? "#00ff88" : queimadorPiscando(n) ? "#60a5fa" : "#f97316",
  brilho: queimadorPiscando(n) && !queimadorLigado(n)
    ? "0 0 12px rgba(96,165,250,0.95)"
    : queimadorLigado(n)
    ? "0 0 12px rgba(34,197,94,0.75)"
    : "none"
});

  const bombaLigada = (n) => bombasLigadas.includes(n);
  const bombaPiscando = (n) => proximaBomba === n;

  const getBombaVisual = (n) => ({
    stroke: bombaLigada(n) ? "#22c55e" : bombaPiscando(n) ? "#60a5fa" : "#2563eb",
    simbolo: bombaLigada(n) ? "#00ff88" : bombaPiscando(n) ? "#60a5fa" : "#f10000",
    brilho: bombaPiscando(n) && !bombaLigada(n)
      ? "0 0 12px rgba(96,165,250,0.95)"
      : bombaLigada(n)
      ? "0 0 10px rgba(34,197,94,0.75)"
      : "none"
  });
  
  const burners = [
    { n:1, cy:90,  pct:"+76.0 %A", a:"+4.5 A", p:"+7.8 %" },
    { n:2, cy:145, pct:"+70.0 %A", a:"+3.9 A", p:"+7.8 %" },
    { n:3, cy:200, pct:"+63.0 %A", a:"+2.2 A", p:"+7.9 %" },
    { n:4, cy:255, pct:"+53.0 %A", a:"+4.4 A", p:"+8.4 %" },
    { n:5, cy:310, pct:"+77.0 %A", a:"+2.4 A", p:"+8.1 %" },
    { n:6, cy:365, pct:"+22.0 %A", a:"+4.5 A", p:"+7.7 %" },
    { n:7, cy:420, pct:"+41.0 %A", a:"+4.1 A", p:"+7.8 %" },
  ];
   const bombasConfig = [
    { id: "PNEUMATICO",  num: 0, cx: 200, a: "+132.0 A", label: "Pneumatico",  tipo: "pneumatico" },
    { id: "EXAUSTOR_1",  num: 1, cx: 570, a: "+140.2 A", label: "Exaustor2",   tipo: "exaustor" },
    { id: "EXAUSTOR_2",   num: 2, cx: 510, a: "+146.4 A", label: "Exaustor1",   tipo: "exaustor" },
    { id: "VENTILADOR_1", num: 3, cx: 830, a: "+208.5 A", label: "Ventilador2", tipo: "ventilador" },
    { id: "VENTILADOR_2",  num: 4, cx: 770, a: "+201.8 A", label: "Ventilador1", tipo: "ventilador" }
  ]

  const bombasTutorialAtivas = etapaAtual === 2 ? [4, 3, 2, 1,0] : [];

  const isBombaTutorial = (num) => bombasTutorialAtivas.includes(num);

  const getBombaLabel = (num) =>
    bombasConfig.find((bomba) => bomba.num === num)?.label || `Bomba ${num}`;




  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">◈ Caldeira 1 — Detalhe Processo</div>
        <div style={{ fontSize: 9, color: "#94a3b8", fontFamily: "monospace" }}>EC_06C/MVM_A_171_MET_007</div>
        <div className="panel-status-pills">
          <span className="pill pill-a">A</span>
          <span className="pill pill-u">U</span>
          <span className="pill pill-s">S</span>
        </div>
      </div>
      <div className="panel-svg-container">
        <svg viewBox="0 0 860 580" preserveAspectRatio="xMidYMid meet">
          <rect width="860" height="580" fill="#0a0e1a" />
          <text x="430" y="300" className="lobby-mark" textAnchor="middle">LOBBY</text>
 
          <text x="200" y="29" fill="#e2e8f0" fontSize="16" fontWeight="bold" fontFamily="Arial">CALDEIRA 1</text>
          <text x="30" y="40" fill="#ff4444" fontSize="10" fontFamily="Arial">DESAB</text>
 
          {/* AJUSTE CARGA C1 */}
          
          <g transform="translate(0,-12)" className="clickable" onClick={() => open("AJUSTE_C1_DET", "Ajuste Carga C1")}>
            <rect x="25" y="55" width="103" height="32" fill="#0a1628" stroke="#2a3f6f" strokeWidth="1" rx="2" />
            <text x="75" y="68" fill="#94a3b8" fontSize="9" textAnchor="middle" fontFamily="Arial">AJUSTE CARGA C1</text>
            <text x="75" y="82" fill="#00ff88" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">+1.000</text>
          </g>
        
 
          {/* Main boiler body */}
          <rect x="190" y="45" width="110" height="420" fill="#0d1f3a" stroke="#2563eb" strokeWidth="2" rx="3" />
          <rect
            x="192"
            y={465 - ((temperaturaCaldeira - 88.6) / (800 - 88.6)) * 418}
            width="106"
            height={((temperaturaCaldeira - 88.6) / (800 - 88.6)) * 418}
            fill="url(#caldeiraHeat)"
            opacity="0.35"
            style={{ transition: "all 0.5s ease" }}
          />

          <defs>
            <linearGradient id="caldeiraHeat" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#ff3b00" />
              <stop offset="55%" stopColor="#ff8c00" />
              <stop offset="100%" stopColor="#ffd166" />
            </linearGradient>
          </defs>
          {[205,215,225,235,245,255,265,275,285].map(x => (
            <line key={x} x1={x} y1="55" x2={x} y2="460" stroke="#1e3a5f" strokeWidth="1.5" />
          ))}
          <rect x="190" y="45" width="110" height="420" fill="transparent" className="clickable" onClick={() => open("C1_BODY", "Corpo Caldeira 1")} />
 
          {/* Burners */}
           {burners.map(({ n, cy, pct, a, p }) => {
  const visual = getQueimadorVisual(n);
  const controladoTutorial = etapaAtual === 3;
  const ligado = queimadorLigado(n);

  return (
    <g
      key={n}
      className="clickable"
      onClick={() => {
        if (controladoTutorial) {
          onQueimadorClick?.(n);
        }
      }}
    >
      <circle
        cx="170"
        cy={cy}
        r="18"
        fill="#1a0a00"
        stroke={visual.stroke}
        strokeWidth="2"
        style={{ filter: controladoTutorial ? visual.brilho : "none" }}
        className={
          controladoTutorial && proximoQueimador === n && !ligado
            ? "piscando"
            : ""
        }
      />

      <text
        x="170"
        y={cy - 4}
        fill={visual.chama}
        fontSize="14"
        textAnchor="middle"
      >
        🔥
      </text>

      <text
        x="170"
        y={cy + 7}
        fill={visual.chama}
        fontSize="7"
        textAnchor="middle"
      >
        Q{n}
      </text>

      <rect x="80" y={cy - 8} width="70" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
      <text x="115" y={cy + 1} fill={ligado ? "#00ff88" : "#ffaa00"} fontSize="8" fontFamily="monospace" textAnchor="middle">
        {ligado ? "LIGADO" : pct}
      </text>

      <rect x="80" y={cy + 6} width="35" height="10" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
      <text x="97" y={cy + 14} fill="#ff4444" fontSize="7" fontFamily="monospace" textAnchor="middle">{a}</text>

      <rect x="117" y={cy + 6} width="33" height="10" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
      <text x="133" y={cy + 14} fill="#00ff88" fontSize="7" fontFamily="monospace" textAnchor="middle">{p}</text>

      <line x1="152" y1={cy} x2="190" y2={cy} stroke={visual.chama} strokeWidth="2" className="pipe-flow" />
    </g>
  );
})}
 
          <rect x="130" y="455" width="70" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="165" y="465" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+40.1 A</text>
 
          {/* Steam pipe top */}
          
          <path d="M250 75 L600 75 L1000 70 100" fill="none" stroke="#ffffff" strokeWidth="3" className="pipe-flow" />
          <g transform="translate(0,20)">
          <rect x="190" y="12" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="217" y="21" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+490.0 °C</text>
          <rect x="245" y="12" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="267" y="21" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+58.4 °C</text>
          <rect x="300" y="12" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="327" y="21" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+0.0 %</text>
           </g>
          {/* Steam drum */}
          <g transform="translate(0, 20)">
          <ellipse cx="270" cy="60" rx="30" ry="25" fill="#1a2a4a" stroke="#60a5fa" strokeWidth="2" className="clickable" onClick={() => open("STEAM_DRUM", "Tambor de Vapor")} />
          <text x="270" y="56" fill="#60a5fa" fontSize="8" textAnchor="middle" fontFamily="Arial">TAMBOR</text>
          <text x="270" y="67" fill="#60a5fa" fontSize="7" textAnchor="middle" fontFamily="Arial">VAPOR</text>
          <rect x="243" y="83" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="270" y="91" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+99.7 %</text>
            </g>
          {/* Separators */}
          <g transform="translate(0,20) "> 
          <ellipse cx="630" cy="310" rx="40" ry="80" fill="#1a2a4a" stroke="#60a5fa" strokeWidth="2" className="clickable" onClick={() => open("SEP1", "Separador 1")} />
          <text x="630" y="308" fill="#60a5fa" fontSize="8" textAnchor="middle" fontFamily="Arial">SEP.1</text>
          <rect x="585" y="392" width="90" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="630" y="401" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+31.5 %</text>
 
          <ellipse cx="720" cy="310" rx="40" ry="80" fill="#1a2a4a" stroke="#60a5fa" strokeWidth="2" className="clickable" onClick={() => open("SEP2", "Separador 2")} />
          <text x="720" y="308" fill="#60a5fa" fontSize="8" textAnchor="middle" fontFamily="Arial">SEP.2</text>
          <rect x="675" y="392" width="90" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="720" y="401" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+22.1 %</text>
          </g>
             {/* Duto Exaustor2 → Caldeira 2 (abaixo do meio) */}
          <path
            d="M510 510 L510 360 L300 360"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="3"
            className="pipe-flow"
          />

          {/* Duto C1_1 → Caldeira 2 (meio) */}
          <path
            d="M570 510 L570 320 L300 320"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="3"
            className="pipe-flow"
          />


               {/* Duto Caldeira 2 → SEP1 */}
          <path
            d="M590 300 L300 300 L300 310 L590 310"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="3"
            className="pipe-flow"
          />

          

            {/* Duto SEP1 / SEP2 para Chimney */}
          <g>
            <line x1="640" y1="250" x2="760" y2="250" stroke="#60a5fa" strokeWidth="3" className="pipe-flow" />
            <line x1="760" y1="250" x2="760" y2="230" stroke="#60a5fa" strokeWidth="3" className="pipe-flow" />
            <line x1="760" y1="230" x2="795" y2="230" stroke="#60a5fa" strokeWidth="3" className="pipe-flow" />

            <line x1="760" y1="250" x2="760" y2="250" stroke="#60a5fa" strokeWidth="3" className="pipe-flow" />
          </g>
          

          {/* Chimney */}
          <rect x="780" y="20" width="30" height="490" fill="#0d1f3a" stroke="#2a3f6f" strokeWidth="1" />
          <text x="795" y="13" fill="#94a3b8" fontSize="9" textAnchor="middle">↑</text>
            {/* Nivel/Seletor */}
          <rect x="190" y="200" width="55" height="20" fill="#0a1628" stroke="#2a3f6f" strokeWidth="1" rx="2" className="clickable" onClick={() => open("NIVEL_A", "Nível A")} />
          <text x="217" y="214" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">NÍVEL A</text>
          <rect x="190" y="224" width="55" height="14" fill="#061020" stroke="#1e3a5f" strokeWidth="1" />
          <text x="217" y="233" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">+70.4 %</text>
          <rect x="240" y="200" width="55" height="20" fill="#0a1628" stroke="#2a3f6f" strokeWidth="1" rx="2" className="clickable" onClick={() => open("SELETOR", "Seletor")} />
          <text x="270" y="214" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">SELETOR</text>
          <rect x="240" y="224" width="55" height="14" fill="#061020" stroke="#1e3a5f" strokeWidth="1" />
          <text x="270" y="233" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">+1.0</text>
          <rect x="295" y="200" width="55" height="20" fill="#0a1628" stroke="#2a3f6f" strokeWidth="1" rx="2" className="clickable" onClick={() => open("NIVEL_B", "Nível B")} />
          <text x="325" y="214" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">NÍVEL B</text>
          <rect x="295" y="224" width="55" height="14" fill="#061020" stroke="#1e3a5f" strokeWidth="1" />
          <text x="325" y="233" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">+69.4 %</text>
 
          {/* CO/O2 */}
          <rect x="340" y="270" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="367" y="279" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">+0.7 CO</text>
          <rect x="400" y="270" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="427" y="279" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+0.4 O2</text>
 

         <g transform="translate(-60, -20)" className="clickable" onClick={() => open("VALV_BLOQUEIO", "Válvula De Bloqueio")}>
          <line x1="615" y1="65" x2="645" y2="65" stroke="#60a5fa" strokeWidth="3" />

          <polygon points="620,65 628,58 628,72" fill="#1a2a4a" stroke="#60a5fa" strokeWidth="1.5" />
          <polygon points="640,65 632,58 632,72" fill="#1a2a4a" stroke="#60a5fa" strokeWidth="1.5" />

          <circle cx="640" cy="65" r="4" fill="#0a1628" stroke="#60a5fa" strokeWidth="1.5" />

          
          <circle cx="610" cy="65" r="4" fill="#0d1f3a" stroke="#3bb2f6" strokeWidth="1.5" />
          

         
        </g>
 
          {/* Valve main steam */}
          <g transform="translate(0, -70)">
        <g transform="translate(0, 30)" className="clickable" onClick={() => open("VALV_VAPOR_PRIN", "Válvula Principal de Vapor")}>
          <line x1="615" y1="65" x2="645" y2="65" stroke="#60a5fa" strokeWidth="3" />

          <polygon points="620,65 628,58 628,72" fill="#1a2a4a" stroke="#60a5fa" strokeWidth="1.5" />
          <polygon points="640,65 632,58 632,72" fill="#1a2a4a" stroke="#60a5fa" strokeWidth="1.5" />

          <circle cx="630" cy="65" r="4" fill="#0a1628" stroke="#60a5fa" strokeWidth="1.5" />

          <line x1="630" y1="61" x2="630" y2="47" stroke="#60a5fa" strokeWidth="1.5" />
          <circle cx="630" cy="43" r="6" fill="#0d1f3a" stroke="#3b82f6" strokeWidth="1.5" />
          <line x1="624" y1="43" x2="636" y2="43" stroke="#60a5fa" strokeWidth="1.2" />
          <line x1="630" y1="37" x2="630" y2="49" stroke="#60a5fa" strokeWidth="1.2" />

          <rect x="616" y="77" width="28" height="10" fill="#061020" stroke="#2a3f6f" strokeWidth="1" rx="1" />
          <text x="630" y="84" fill="#00ff88" fontSize="7" textAnchor="middle" fontFamily="Arial">ABERTA</text>
        </g>
        {/* Linha Caldeira → Válvula Vapor 2 */}
           <path
             d="M300 155 L570 155"
             fill="none"
             stroke="#e2e8f0"
             strokeWidth="2"
             
             />

         <g transform="translate(-60, 90)" className="clickable" onClick={() => open("VALV_VAPOR_PRIN2", "Válvula Principal de Vapor2")}>
          <line x1="615" y1="65" x2="645" y2="65" stroke="#60a5fa" strokeWidth="3" />

          <polygon points="620,65 628,58 628,72" fill="#1a2a4a" stroke="#60a5fa" strokeWidth="1.5" />
          <polygon points="640,65 632,58 632,72" fill="#1a2a4a" stroke="#60a5fa" strokeWidth="1.5" />

          <circle cx="630" cy="65" r="4" fill="#0a1628" stroke="#60a5fa" strokeWidth="1.5" />

          <line x1="630" y1="61" x2="630" y2="47" stroke="#60a5fa" strokeWidth="1.5" />
          <circle cx="630" cy="43" r="6" fill="#0d1f3a" stroke="#3b82f6" strokeWidth="1.5" />
          <line x1="624" y1="43" x2="636" y2="43" stroke="#60a5fa" strokeWidth="1.2" />
          <line x1="630" y1="37" x2="630" y2="49" stroke="#60a5fa" strokeWidth="1.2" />

          <rect x="616" y="77" width="28" height="10" fill="#061020" stroke="#2a3f6f" strokeWidth="1" rx="1" />
          <text x="630" y="84" fill="#00ff88" fontSize="7" textAnchor="middle" fontFamily="Arial">ABERTA</text>
        </g>

        {/* Linha entre válvulas de vapor */}
          <path
            d="M620 95 L600 95 L600 155 L584 155"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="2"
            
          />
          </g>
       
          {/* MANUAL / FALHA */}
          <rect x="300" y="305" width="60" height="16" fill="#78350f" stroke="#f59e0b" strokeWidth="1" rx="2" />
          <text x="330" y="316" fill="#fcd34d" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="Arial">MANUAL</text>
          <rect x="300" y="370" width="60" height="16" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1.5" rx="2" className="led-alarm" />
          <text x="330" y="381" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="Arial">FALHA</text>
          <rect x="85" y="480" width="75" height="16" fill="#78350f" stroke="#f59e0b" strokeWidth="1" rx="2" />
          <text x="122" y="491" fill="#fcd34d" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="Arial">MANUAL</text>
 
            {/* Bottom pumps */}
          {bombasConfig.map(({ id, num, cx, a, label, tipo }) => {
            const visual = getBombaVisual(num);
            const controladaTutorial = isBombaTutorial(num);
            const ligada = bombaLigada(num);

            return (
              <g
                key={id}
                className="clickable"
                onClick={() => {
                  if (controladaTutorial) {
                    onBombaClick?.(num);
                  }
                }}
              >
                {/* Corpo externo */}
                <circle
                  cx={cx}
                  cy="510"
                  r="25"
                  fill="#091220"
                  stroke={controladaTutorial ? visual.stroke : "#7b818f"}
                  strokeWidth="2"
                  style={{ filter: controladaTutorial ? visual.brilho : "none" }}
                  className={
                    controladaTutorial && proximaBomba === num && !ligada
                      ? "piscando"
                      : ""
                  }
                />

                {/* Anel interno */}
                <circle
                  cx={cx}
                  cy="510"
                  r="18"
                  fill="#0f1c31"
                  stroke={controladaTutorial ? visual.stroke : "#42506a"}
                  strokeWidth="1.2"
                  opacity="0.95"
                />

                {/* Tipo visual */}
                {tipo === "pneumatico" && (
                  <g>
                    <circle
                      cx={cx}
                      cy="510"
                      r="7"
                      fill="#0a1628"
                      stroke={controladaTutorial ? visual.simbolo : "#b8b8be"}
                      strokeWidth="1.4"
                    />
                    <line x1={cx - 10} y1="510" x2={cx - 4} y2="510" stroke={controladaTutorial ? visual.simbolo : "#b8b8be"} strokeWidth="1.6" />
                    <line x1={cx + 4} y1="510" x2={cx + 10} y2="510" stroke={controladaTutorial ? visual.simbolo : "#b8b8be"} strokeWidth="1.6" />
                    <line x1={cx} y1="500" x2={cx} y2="504" stroke={controladaTutorial ? visual.simbolo : "#b8b8be"} strokeWidth="1.6" />
                    <line x1={cx} y1="516" x2={cx} y2="520" stroke={controladaTutorial ? visual.simbolo : "#b8b8be"} strokeWidth="1.6" />
                  </g>
                )}

                {tipo === "exaustor" && (
                  <g>
                    <circle
                      cx={cx}
                      cy="510"
                      r="6"
                      fill="#0a1628"
                      stroke={controladaTutorial ? visual.simbolo : "#b8b8be"}
                      strokeWidth="1.2"
                    />
                    <path
                      d={`M ${cx} 501 Q ${cx + 10} 505 ${cx + 4} 512`}
                      fill="none"
                      stroke={controladaTutorial ? visual.simbolo : "#b8b8be"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M ${cx - 9} 513 Q ${cx - 2} 500 ${cx + 3} 508`}
                      fill="none"
                      stroke={controladaTutorial ? visual.simbolo : "#b8b8be"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M ${cx - 2} 520 Q ${cx + 10} 518 ${cx + 1} 506`}
                      fill="none"
                      stroke={controladaTutorial ? visual.simbolo : "#b8b8be"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {tipo === "ventilador" && (
                  <g>
                    <circle
                      cx={cx}
                      cy="510"
                      r="5"
                      fill="#0a1628"
                      stroke={controladaTutorial ? visual.simbolo : "#b8b8be"}
                      strokeWidth="1.2"
                    />
                    <polygon
                      points={`${cx},500 ${cx+4},508 ${cx},510`}
                      fill={controladaTutorial ? visual.simbolo : "#b8b8be"}
                      opacity="0.95"
                    />
                    <polygon
                      points={`${cx+10},510 ${cx+2},514 ${cx},510`}
                      fill={controladaTutorial ? visual.simbolo : "#b8b8be"}
                      opacity="0.95"
                    />
                    <polygon
                      points={`${cx},520 ${cx-4},512 ${cx},510`}
                      fill={controladaTutorial ? visual.simbolo : "#b8b8be"}
                      opacity="0.95"
                    />
                    <polygon
                      points={`${cx-10},510 ${cx-2},506 ${cx},510`}
                      fill={controladaTutorial ? visual.simbolo : "#b8b8be"}
                      opacity="0.95"
                    />
                  </g>
                )}

                {/* Label superior */}
                <rect
                  x={cx - 28}
                  y="521"
                  width="56"
                  height="11"
                  rx="2"
                  fill="#0a1628"
                  stroke="#2a3f6f"
                  strokeWidth="0.8"
                />
                <text
                  x={cx}
                  y="529"
                  fill="#60a5fa"
                  fontSize="6.5"
                  textAnchor="middle"
                  fontWeight="bold"
                  fontFamily="Arial"
                >
                  {label}
                </text>

                {/* Box inferior */}
                <rect
                  x={cx - 25}
                  y="538"
                  width="50"
                  height="12"
                  fill={controladaTutorial && ligada ? "#14532d" : "#061020"}
                  stroke={controladaTutorial && ligada ? "#22c55e" : "#2a3f6f"}
                  strokeWidth="1"
                  rx="1.5"
                />

                <text
                  x={cx}
                  y="547"
                  fill={controladaTutorial && ligada ? "#bbf7d0" : "#ffaa00"}
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {controladaTutorial && ligada ? "LIGADA" : a}
                </text>
              </g>
            );
          })}

          
          {/* Conditions checkboxes */}
          <g transform="translate(0, -90)">
          <rect x="650" y="140" width="8" height="8" fill="none" stroke="#60a5fa" strokeWidth="1" />
          <text x="650" y="148" fill="#00ff44" fontSize="8">✓</text>
          <text x="659" y="148" fill="#94a3b8" fontSize="8" fontFamily="Arial">PRESSÃO &gt; 72 KFCM²</text>
          <rect x="650" y="155" width="8" height="8" fill="none" stroke="#60a5fa" strokeWidth="1" />
          <text x="650" y="163" fill="#00ff44" fontSize="8">✓</text>
          <text x="659" y="163" fill="#94a3b8" fontSize="8" fontFamily="Arial">VAZÃO &lt; 60 TN/H</text>
          <rect x="650" y="170" width="8" height="8" fill="none" stroke="#60a5fa" strokeWidth="1" />
          <text x="650" y="178" fill="#00ff44" fontSize="8">✓</text>
          <text x="659" y="178" fill="#94a3b8" fontSize="8" fontFamily="Arial">TEMP &gt; 510 °C</text>
          </g>
          {/* MASTER box right */}
          <g transform="translate(0, -10)">
          <rect x="745" y="55" width="100" height="85" fill="#0a1628" stroke="#2563eb" strokeWidth="1.5" rx="2" />
          <text x="795" y="70" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="Arial">MASTER</text>
          <rect x="750" y="75" width="90" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="795" y="84" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+67.0 Kgf/cm²</text>
          <rect x="750" y="89" width="90" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="795" y="98" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">+0.0 Kgf/cm²</text>
          <rect x="750" y="103" width="90" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="795" y="112" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+100.0 %</text>
          <circle cx="795" cy="130" r="6" fill="#00ff44" />
          </g>
           {/*box right */}
          <g transform="translate(0, 105)">
          <rect x="750" y="75" width="90" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="795" y="84" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+0.700 Kgf/cm²</text>
          <rect x="750" y="89" width="90" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="795" y="98" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">+0.800 Kgf/cm²</text>
          <rect x="750" y="103" width="90" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="795" y="112" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+100.0 %</text>
          <circle cx="795" cy="130" r="6" fill="#00ff44" />
          </g>
 
          {/* AR COMPRIMIDO */}
          <g transform="translate (0, -220)">
          <rect x="695" y="220" width="80" height="30" fill="#0a1628" stroke="#2a3f6f" strokeWidth="1" rx="2" />
          <text x="735" y="233" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="Arial">AR COMPRIMIDO</text>
          <text x="735" y="244" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+6.5 Kgf/cm²</text>
          </g>

          {/* Water pipe */}
          <line x1="305" y1="465" x2="510" y2="465" stroke="#34d399" strokeWidth="2" className="pipe-flow" />
          <rect x="308" y="453" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="335" y="462" fill="#34d399" fontSize="8" fontFamily="monospace" textAnchor="middle">+89.0 °C</text>
 
          {/* Temp right side */}
          <rect x="313" y="140" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="340" y="149" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+72.2 °C</text>
          <rect x="313" y="160" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="340" y="169" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+53.7 °C</text>
 
          {/* Bottom temps */}
          {[{ x:730, y:440, v:"+139.5 °C", c:"#ffaa00" },{ x:730, y:454, v:"+12.5 %A", c:"#60a5fa" },
            { x:790, y:440, v:"+22.8 °C",  c:"#ffaa00" },{ x:790, y:454, v:"+21.1 °C",  c:"#ffaa00" }
          ].map(({ x, y, v, c }) => (
            <g key={`${x}${y}`}>
              <rect x={x} y={y} width="65" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
              <text x={x+32} y={y+9} fill={c} fontSize="8" fontFamily="monospace" textAnchor="middle">{v}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
 
// ─── PANEL 3 — Esteiras Bagaço ────────────────────────────────────────────────
function PanelEsteiras({ open, motoresLigados = [], onMotorClick, proximoMotor = null }) {
 const motorLigado = (n) => motoresLigados.includes(n);
 const Piscando = (n) => proximoMotor === n;

 const getMotorVisual = (n) => ({
  strokeMotor: motorLigado(n) ? "#22c55e" : Piscando(n) ? "#60a5fa" : "#ff4444",
  simboloCor: motorLigado(n) ? "#00ff88" : Piscando(n) ? "#60a5fa" : "#ff4444",
  boxFill: motorLigado(n) ? "#14532d" : "#7f1d1d",
  boxStroke: motorLigado(n) ? "#22c55e" : "#dc2626",
  textoStatus: motorLigado(n) ? "LIGADO" : "DESABILITADO",
  textoStatusCor: motorLigado(n) ? "#bbf7d0" : "#fca5a4",
  brilhoMotor: Piscando(n) && !motorLigado(n)
    ? "0 0 12px rgba(96,165,250,0.95)"
    : motorLigado(n)
    ? "0 0 10px rgba(34,197,94,0.75)"
    : "none"
});
   const linhaEsteiraPontos = (cx, cy, dx, dy, corteInicio = 0, corteFim = 0) => {
    const comprimento = Math.sqrt(dx * dx + dy * dy);

    const ux = dx / comprimento;
    const uy = dy / comprimento;

    const x1 = cx - dx / 2 + ux * corteInicio;
    const y1 = cy - dy / 2 + uy * corteInicio;

    const x2 = cx + dx / 2 - ux * corteFim;
    const y2 = cy + dy / 2 - uy * corteFim;

    return { x1, y1, x2, y2, ux, uy, comprimento: Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) };
  };

   const desenhaEsteira = (
    cx,
    cy,
    dx,
    dy,
    corteInicio = 0,
    corteFim = 0,
    largura = 18
  ) => {
    const { x1, y1, x2, y2, comprimento } = linhaEsteiraPontos(cx, cy, dx, dy, corteInicio, corteFim);

    const vx = x2 - x1;
    const vy = y2 - y1;
    const len = Math.sqrt(vx * vx + vy * vy) || 1;

    const px = -(vy / len) * (largura / 2);
    const py =  (vx / len) * (largura / 2);

    const trilho1x1 = x1 + px;
    const trilho1y1 = y1 + py;
    const trilho1x2 = x2 + px;
    const trilho1y2 = y2 + py;

    const trilho2x1 = x1 - px;
    const trilho2y1 = y1 - py;
    const trilho2x2 = x2 - px;
    const trilho2y2 = y2 - py;

    const corpo = [
      `${trilho1x1},${trilho1y1}`,
      `${trilho1x2},${trilho1y2}`,
      `${trilho2x2},${trilho2y2}`,
      `${trilho2x1},${trilho2y1}`
    ].join(" ");

    const qtdTravessas = Math.max(3, Math.floor(comprimento / 26));
    const travessas = Array.from({ length: qtdTravessas }, (_, i) => {
      const t = (i + 1) / (qtdTravessas + 1);
      const mx = x1 + vx * t;
      const my = y1 + vy * t;

      return (
        <line
          key={`travessa-${i}`}
          x1={mx + px * 0.85}
          y1={my + py * 0.85}
          x2={mx - px * 0.85}
          y2={my - py * 0.85}
          stroke="#1e3a5f"
          strokeWidth="1"
          opacity="0.9"
        />
      );
    });

    const qtdApoios =
      comprimento < 90 ? 2 :
      comprimento < 170 ? 2 :
      3;

    const apoios = Array.from({ length: qtdApoios }, (_, i) => {
      const t = (i + 1) / (qtdApoios + 1);

      const mx = x1 + vx * t;
      const my = y1 + vy * t;

      const baseX = mx;
      const topoY = my + py * 0.9;
      const baseY = 339;

      return (
        <g key={`apoio-${i}`}>
          <line
            x1={baseX}
            y1={topoY}
            x2={baseX}
            y2={baseY}
            stroke="#4b5563"
            strokeWidth="2"
          />
          <line
            x1={baseX - 6}
            y1={baseY}
            x2={baseX + 6}
            y2={baseY}
            stroke="#2a3f6f"
            strokeWidth="2"
          />
          <circle
            cx={baseX}
            cy={topoY}
            r="2.2"
            fill="#0a1628"
            stroke="#60a5fa"
            strokeWidth="0.8"
          />
        </g>
      );
    });

    return (
      <g>
        {apoios}

        <polygon
          points={corpo}
          fill="#0d1a2e"
          stroke="#2a3f6f"
          strokeWidth="1.2"
        />

        <line
          x1={trilho1x1}
          y1={trilho1y1}
          x2={trilho1x2}
          y2={trilho1y2}
          stroke="#2a3f6f"
          strokeWidth="2"
        />
        <line
          x1={trilho2x1}
          y1={trilho2y1}
          x2={trilho2x2}
          y2={trilho2y2}
          stroke="#2a3f6f"
          strokeWidth="2"
        />

        {travessas}

        <circle cx={x1} cy={y1} r="4.5" fill="#0a1628" stroke="#2563eb" strokeWidth="1" />
        <circle cx={x2} cy={y2} r="4.5" fill="#0a1628" stroke="#2563eb" strokeWidth="1" />
      </g>
    );
  };
    const trilhosEsteira = {
    e1: {
      l1: { cx: 65,cy: 320, dx: 110, dy: -80,  corteInicio: 15, corteFim: 0 },
      l2: { cx: 97.5, cy: 330, dx: 85,  dy: -60,  corteInicio: 13, corteFim: 0  },
    },
    e2: {
      l1: { cx: 255, cy: 230, dx: 190, dy: -140,  corteInicio: -35, corteFim: 40  },
      l2: { cx: 295, cy: 230, dx: 190, dy: -140,  corteInicio: -55, corteFim: 90 },
    },
    e3: {
      l1: { cx: 850, cy: 190, dx: 100, dy: 0,  corteInicio: 20, corteFim: 0  },
      l2: { cx: 850, cy: 210, dx: 80, dy: 0, corteInicio: 10, corteFim: -10 },
    },
    e4: {
      l1: { cx: 850, cy: 240, dx: 80, dy: 0,  corteInicio: 20, corteFim: -10  },
      l2: { cx: 850, cy: 260, dx: 80, dy: 0,  corteInicio: 20, corteFim: -10 },
    },
    e5: {
      l1: { cx: 685, cy: 225, dx: 180, dy: -60,  corteInicio: 50, corteFim: -50  },
      l2: { cx: 655, cy: 210, dx: 190, dy: -60,  corteInicio: 80, corteFim: -60  },
    },
    e6: {
      l1: { cx: 790, cy: 245, dx: 100, dy: 60, corteInicio: -120, corteFim: 0  },
      l2: { cx: 810, cy: 280, dx: 100, dy: 60,  corteInicio: -140, corteFim: 40 },
    },
    e7: {
      l1: { cx: 520, cy: 205, dx: 100, dy: 0, corteInicio: -140, corteFim: -80  },
      l2: { cx: 810, cy: 280, dx: 100, dy: 60,  corteInicio: -140, corteFim: 40 },
    },
  };
  const esteiras = [

    
    { n:1, lx:300,  rx:100, mx:35,  alarm:true,  vals:["-39.0","-0.8"],  trip:true  },
    { n:2, lx:120, rx:280, mx:185, alarm:false, vals:["0.0","NA"],   trip:false },
    { n:4, lx:380, rx:460, mx:455, alarm:true,  vals:["+195.1","+90.0"], trip:false, extra:"+53.0 %A" },
    { n:5, lx:720, rx:790, mx:760, alarm:false, vals:["+95.0","—"],   trip:false },
    { n:6, lx:830, rx:870, mx:865, alarm:true,  vals:["+181.5","—"],  trip:true  },
  ];
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">◈ Esteiras Dosadoras Bagaço</div>
        <div style={{ fontSize: 9, color: "#ff4444", fontFamily: "monospace", animation: "blink 1s infinite" }}>⚠ SOBRECARGA 171-ET-007</div>
        <div className="panel-status-pills">
          <span className="pill pill-a">A</span>
          <span className="pill pill-u">U</span>
          <span className="pill pill-s">S</span>
        </div>
      </div>
      <div className="panel-svg-container">
        <svg viewBox="0 0 900 520" preserveAspectRatio="xMidYMid meet">
          <rect width="900" height="520" fill="#0a0e1a" />
          <text x="450" y="260" className="lobby-mark" textAnchor="middle" fontSize="24">LOBBY</text>
 
          {/* Boiler silhouettes */}
          <g transform="translate(0,58)">
          <rect x="320" y="30" width="100" height="250" fill="#0d1a2e" stroke="#1e3a5f" strokeWidth="1" opacity="0.5" rx="3" />
          <rect x="540" y="30" width="100" height="250" fill="#0d1a2e" stroke="#1e3a5f" strokeWidth="1" opacity="0.5" rx="3" />
          <rect x="360" y="10" width="20" height="30" fill="#0d1a2e" stroke="#1e3a5f" strokeWidth="1" opacity="0.4" />
          <rect x="580" y="10" width="20" height="30" fill="#0d1a2e" stroke="#1e3a5f" strokeWidth="1" opacity="0.4" />
          </g>
          {/* % RETORNO box */}
          <g className="clickable" onClick={() => open("RETORNO_BAGACO", "% Retorno de Bagaço para Caldeiras")}>
            <rect x="370" y="85" width="120" height="75" fill="#0a1628" stroke="#2563eb" strokeWidth="1.5" rx="2" />
            <text x="430" y="99" fill="#60a5fa" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="Arial">% RETORNO DE BAGAÇO</text>
            <line x1="370" y1="102" x2="490" y2="102" stroke="#2563eb" strokeWidth="1" />
            <text x="395" y="114" fill="#94a3b8" fontSize="8" textAnchor="middle">RS</text>
            <text x="435" y="114" fill="#94a3b8" fontSize="8" textAnchor="middle">RS</text>
            <text x="475" y="114" fill="#ffaa00" fontSize="8" textAnchor="middle">MAN</text>
            <rect x="375" y="116" width="40" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="395" y="126" fill="#00ff88" fontSize="9" fontFamily="monospace" textAnchor="middle">+95.0</text>
            <rect x="417" y="116" width="40" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="437" y="126" fill="#00ff88" fontSize="9" fontFamily="monospace" textAnchor="middle">+95.0</text>
            <rect x="459" y="116" width="25" height="14" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
            <text x="471" y="126" fill="#fcd34d" fontSize="9" fontFamily="monospace" textAnchor="middle">MAN</text>
            <rect x="375" y="132" width="40" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="395" y="142" fill="#00ff88" fontSize="9" fontFamily="monospace" textAnchor="middle">+100</text>
            <rect x="417" y="132" width="40" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="437" y="142" fill="#00ff88" fontSize="9" fontFamily="monospace" textAnchor="middle">+100</text>
          </g>
 
          {/* % retorno caldeiras */}
          <rect x="465" y="280" width="110" height="30" fill="#0a1628" stroke="#2563eb" strokeWidth="1" rx="2" />
          <text x="520" y="292" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="Arial">% DE RETORNO</text>
          <text x="520" y="303" fill="#94a3b8" fontSize="7" textAnchor="middle" fontFamily="Arial">PARA AS CALDEIRAS</text>
          <rect x="490" y="310" width="60" height="14" fill="#061020" stroke="#dc2626" strokeWidth="1.5" />
          <text x="520" y="321" fill="#ff4444" fontSize="9" fontFamily="monospace" textAnchor="middle" className="led-alarm">-95.0 %</text>
 
          {/* ET-007 popup */}
          <g transform="translate(100, -250)">
          <g  className="clickable" onClick={() => open("ET007", "Esteira Dosadora Bagaço 171-ET-007")}>
            <rect x="640" y="85" width="145" height="120" fill="#0a1628" stroke="#dc2626" strokeWidth="2" rx="2" />
            <text x="712" y="99" fill="#ff4444" fontSize="9" fontWeight="bold" textAnchor="middle">ESTEIRA DOSADORA</text>
            <text x="712" y="110" fill="#ff4444" fontSize="8" textAnchor="middle">BAGAÇO 171-ET-007</text>
            <line x1="640" y1="113" x2="785" y2="113" stroke="#dc2626" strokeWidth="1" />
            <circle cx="712" cy="145" r="20" fill="#7f1d1d" stroke="#dc2626" strokeWidth="2" className="led-alarm" />
            <text x="712" y="141" fill="#fca5a5" fontSize="7" fontWeight="bold" textAnchor="middle">INTER</text>
            <text x="712" y="151" fill="#fca5a5" fontSize="7" fontWeight="bold" textAnchor="middle">LOCK</text>
          </g>
          <g className="clickable" onClick={() => open("ET007_LIGA", "Ligar ET-007")}>
            <rect x="650" y="168" width="50" height="16" fill="#16a34a" stroke="#22c55e" strokeWidth="1" rx="2" />
            <text x="675" y="179" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">LIGA</text>
          </g>
          <g className="clickable" onClick={() => open("ET007_DESLIGA", "Desligar ET-007")}>
            <rect x="720" y="168" width="55" height="16" fill="#dc2626" stroke="#ef4444" strokeWidth="1" rx="2" />
            <text x="747" y="179" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">DESLIGA</text>
          </g>
          <rect x="650" y="188" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="677" y="197" fill="#ff4444" fontSize="8" fontFamily="monospace" textAnchor="middle">+65.5 A</text>
          <rect x="710" y="188" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="737" y="197" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+9.7 %</text>
          <rect x="650" y="202" width="125" height="12" fill="#16a34a" stroke="#22c55e" strokeWidth="1" rx="1" />
          <text x="712" y="211" fill="#fff" fontSize="8" fontWeight="bold" textAnchor="middle">INTER HABILITADO</text>
          <rect x="650" y="218" width="35" height="14" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
          <text x="667" y="228" fill="#fcd34d" fontSize="9" fontFamily="monospace" textAnchor="middle">MAN</text>
          <rect x="690" y="218" width="50" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="715" y="228" fill="#00ff88" fontSize="9" fontFamily="monospace" textAnchor="middle">+7.8 %</text>
          <rect x="640" y="235" width="145" height="14" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1" rx="1" className="led-alarm" />
          <text x="712" y="245" fill="#fca5a5" fontSize="8" fontWeight="bold" textAnchor="middle">SOBRECARGA ESTEIRA...</text>
          </g>
 
          {/* Floor */}
          <rect x="0" y="340" width="900" height="10" fill="#0d1f3a" stroke="#2a3f6f" strokeWidth="1" />
                {/* Esteira 1 */}
          <g
            className="clickable"
            onClick={() => {
              onMotorClick?.(1);
             
            }}
          >
            {desenhaEsteira(
              trilhosEsteira.e1.l1.cx,
              trilhosEsteira.e1.l1.cy,
              trilhosEsteira.e1.l1.dx,
              trilhosEsteira.e1.l1.dy,
              trilhosEsteira.e1.l1.corteInicio,
              trilhosEsteira.e1.l1.corteFim
            )}

            {(() => {
              const visual = getMotorVisual(1);

              return (
                <g transform="translate(-745, -80)">
                  <text x="865" y="350" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">1</text>

                  <circle
                    transform="translate(0 , 1)"
                    cx="865"
                    cy="360"
                    r="6"
                    fill="#0d1f3a"
                    stroke={visual.strokeMotor}
                    strokeWidth="2"
                    style={{ filter: visual.brilhoMotor }}
                    className={proximoMotor === 1 && !motorLigado(1) ? "piscando" : ""}
                  />
                  <text x="865" y="364" fill={visual.simboloCor} fontSize="12" textAnchor="middle">⊗</text>

                  <rect x="846" y="369" width="40" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
                  <text x="867" y="377" fill="#ffaa00" fontSize="6" fontFamily="monospace" textAnchor="middle">+181.5 %</text>

                  <rect
                    x="846"
                    y="382"
                    width="40"
                    height="11"
                    fill={visual.boxFill}
                    stroke={visual.boxStroke}
                    strokeWidth="1"
                    rx="1"
                  />
                  <text
                    x="867"
                    y="390"
                    fill={visual.textoStatusCor}
                    fontSize="5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {visual.textoStatus}
                  </text>
                </g>
              );
            })()}
          </g>

          {/* Esteira 2 */}
          <g
            className="clickable"
            onClick={() => {
              onMotorClick?.(2);
              
            }}
          >
            {desenhaEsteira(
              trilhosEsteira.e2.l1.cx,
              trilhosEsteira.e2.l1.cy,
              trilhosEsteira.e2.l1.dx,
              trilhosEsteira.e2.l1.dy,
              trilhosEsteira.e2.l1.corteInicio,
              trilhosEsteira.e2.l1.corteFim
            )}

            {(() => {
              const visual = getMotorVisual(2);

              return (
                <g transform="translate(-548, -178)">
                  <text x="865" y="350" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">2</text>

                  <circle
                    transform="translate(0 , 1)"
                    cx="865"
                    cy="360"
                    r="6"
                    fill="#0d1f3a"
                    stroke={visual.strokeMotor}
                    strokeWidth="2"
                    style={{ filter: visual.brilhoMotor }}
                    className={proximoMotor === 2 && !motorLigado(2) ? "piscando" : ""}
                  />
                  <text x="865" y="364" fill={visual.simboloCor} fontSize="12" textAnchor="middle">⊗</text>

                  <rect x="846" y="369" width="40" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="2" />
                  <text x="867" y="377" fill="#ffaa00" fontSize="6" fontFamily="monospace" textAnchor="middle">+181.5 %</text>

                  <rect
                    x="846"
                    y="382"
                    width="40"
                    height="11"
                    fill={visual.boxFill}
                    stroke={visual.boxStroke}
                    strokeWidth="1"
                    rx="1"
                  />
                  <text
                    x="867"
                    y="390"
                    fill={visual.textoStatusCor}
                    fontSize="5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {visual.textoStatus}
                  </text>
                </g>
              );
            })()}
          </g>

          {/* Esteira 3 */}
          <g
            className="clickable"
            onClick={() => {
              onMotorClick?.(3);
             
            }}
          >
            {desenhaEsteira(
              trilhosEsteira.e7.l1.cx,
              trilhosEsteira.e7.l1.cy,
              trilhosEsteira.e7.l1.dx,
              trilhosEsteira.e7.l1.dy,
              trilhosEsteira.e7.l1.corteInicio,
              trilhosEsteira.e7.l1.corteFim
            )}

            {(() => {
              const visual = getMotorVisual(3);

              return (
                <g transform="translate(-215, -158)">
                  <text x="695" y="365" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">3</text>

                  <circle
                    transform="translate(0 , 1)"
                    cx="865"
                    cy="360"
                    r="6"
                    fill="#0d1f3a"
                    stroke={visual.strokeMotor}
                    strokeWidth="2"
                    style={{ filter: visual.brilhoMotor }}
                    className={proximoMotor === 3 && !motorLigado(3) ? "piscando" : ""}

                  />
                  <text x="865" y="364" fill={visual.simboloCor} fontSize="12" textAnchor="middle">⊗</text>

                  <rect x="846" y="369" width="40" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="2" />
                  <text x="867" y="377" fill="#ffaa00" fontSize="6" fontFamily="monospace" textAnchor="middle">+181.5 %</text>

                  <rect
                    x="846"
                    y="382"
                    width="40"
                    height="11"
                    fill={visual.boxFill}
                    stroke={visual.boxStroke}
                    strokeWidth="1"
                    rx="1"
                  />
                  <text
                    x="867"
                    y="390"
                    fill={visual.textoStatusCor}
                    fontSize="5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {visual.textoStatus}
                  </text>
                </g>
              );
            })()}
          </g>

          {/* Esteira 6 */}
          <g
            className="clickable"
            onClick={() => {
              onMotorClick?.(6);
              
            }}
          >
            {desenhaEsteira(
              trilhosEsteira.e3.l2.cx,
              trilhosEsteira.e3.l2.cy,
              trilhosEsteira.e3.l2.dx,
              trilhosEsteira.e3.l2.dy,
              trilhosEsteira.e3.l2.corteInicio,
              trilhosEsteira.e3.l2.corteFim,
              trilhosEsteira.e3.l2.corteFim
            )}

            {(() => {
              const visual = getMotorVisual(6);

              return (
                <g transform="translate(138,-145)">
                  <text x="755" y="345" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">6</text>

                  <circle
                    transform="translate(15,0)"
                    cx="740"
                    cy="355"
                    r="6"
                    fill="#0d1f3a"
                    stroke={visual.strokeMotor}
                    strokeWidth="2"
                    style={{ filter: visual.brilhoMotor }}
                    className={proximoMotor === 6 && !motorLigado(6) ? "piscando" : ""}
                  />
                  <text transform="translate(15,0)" x="740" y="359" fill={visual.simboloCor} fontSize="12" textAnchor="middle">⊕</text>

                  <rect x="720" y="365" width="40" height="9" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
                  <text x="740" y="372" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+95.0 %</text>

                  <rect
                    x="720"
                    y="375"
                    width="40"
                    height="11"
                    fill={visual.boxFill}
                    stroke={visual.boxStroke}
                    strokeWidth="1"
                    rx="1"
                  />
                  <text
                    x="740"
                    y="382"
                    fill={visual.textoStatusCor}
                    fontSize="5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {visual.textoStatus}
                  </text>
                </g>
              );
            })()}
          </g>

          {/* COMPORTA TT-03 */}
          <g className="clickable" onClick={() => open("COMPORTA_TT03", "Comporta TT-03")}>
            <rect x="470" y="350" width="85" height="40" fill="#0a1628" stroke="#dc2626" strokeWidth="1.5" rx="2" />
            <text x="512" y="365" fill="#94a3b8" fontSize="8" textAnchor="middle">COMPORTA TT-03</text>
            <rect x="478" y="370" width="70" height="16" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1" rx="1" className="led-alarm" />
            <text x="513" y="381" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">FALHA</text>
          </g>

          {/* Esteira 7 */}
          <g
            className="clickable"
            onClick={() => {
              onMotorClick?.(7);
              
            }}
          >
            {desenhaEsteira(
              trilhosEsteira.e4.l1.cx,
              trilhosEsteira.e4.l1.cy,
              trilhosEsteira.e4.l1.dx,
              trilhosEsteira.e4.l1.dy,
              trilhosEsteira.e4.l1.corteInicio,
              trilhosEsteira.e4.l1.corteFim
            )}

            {(() => {
              const visual = getMotorVisual(7);

              return (
                <g transform="translate(140,-115)">
                  <text x="740" y="358" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">7</text>

                  <circle
                    transform="translate(15,0)"
                    cx="740"
                    cy="355"
                    r="6"
                    fill="#0d1f3a"
                    stroke={visual.strokeMotor}
                    strokeWidth="2"
                    style={{ filter: visual.brilhoMotor }}
                    className={proximoMotor === 7 && !motorLigado(7) ? "piscando" : ""}
                  />
                  <text transform="translate(15,0)" x="740" y="359" fill={visual.simboloCor} fontSize="12" textAnchor="middle">⊕</text>

                  <rect x="720" y="365" width="40" height="9" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
                  <text x="740" y="372" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+95.0 %</text>

                  <rect
                    x="720"
                    y="375"
                    width="40"
                    height="11"
                    fill={visual.boxFill}
                    stroke={visual.boxStroke}
                    strokeWidth="1"
                    rx="1"
                  />
                  <text
                    x="740"
                    y="382"
                    fill={visual.textoStatusCor}
                    fontSize="5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {visual.textoStatus}
                  </text>
                </g>
              );
            })()}
          </g>

          {/* Esteira 4 */}
          <g
            className="clickable"
            onClick={() => {
              onMotorClick?.(4);
              
            }}
          >
            {desenhaEsteira(
              trilhosEsteira.e5.l1.cx,
              trilhosEsteira.e5.l1.cy,
              trilhosEsteira.e5.l1.dx,
              trilhosEsteira.e5.l1.dy,
              trilhosEsteira.e5.l1.corteInicio,
              trilhosEsteira.e5.l1.corteFim
            )}

            {(() => {
              const visual = getMotorVisual(4);

              return (
                <g transform="translate(83,-175)">
                  <text x="740" y="340" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">4</text>

                  <circle
                    cx="740"
                    cy="355"
                    r="6"
                    fill="#0d1f3a"
                    stroke={visual.strokeMotor}
                    strokeWidth="2"
                    style={{ filter: visual.brilhoMotor }}
                    className={proximoMotor === 4 && !motorLigado(4) ? "piscando" : ""}
                  />
                  <text x="740" y="359" fill={visual.simboloCor} fontSize="12" textAnchor="middle">⊕</text>

                  <rect x="720" y="365" width="40" height="9" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
                  <text x="740" y="372" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+95.0 %</text>

                  <rect
                    x="720"
                    y="375"
                    width="40"
                    height="11"
                    fill={visual.boxFill}
                    stroke={visual.boxStroke}
                    strokeWidth="1"
                    rx="1"
                  />
                  <text
                    x="740"
                    y="382"
                    fill={visual.textoStatusCor}
                    fontSize="5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {visual.textoStatus}
                  </text>
                </g>
              );
            })()}
          </g>

          {/* Esteira 5 */}
          <g
            className="clickable"
            onClick={() => {
              onMotorClick?.(5);
            }}
          >
            {desenhaEsteira(
              trilhosEsteira.e6.l1.cx,
              trilhosEsteira.e6.l1.cy,
              trilhosEsteira.e6.l1.dx,
              trilhosEsteira.e6.l1.dy,
              trilhosEsteira.e6.l1.corteInicio,
              trilhosEsteira.e6.l1.corteFim
            )}

            {(() => {
              const visual = getMotorVisual(5);

              return (
                <g transform="translate(-230, -208)">
                  <text x="865" y="350" fill="#94a3b8" fontSize="12" fontWeight="bold" textAnchor="middle">5</text>

                  <circle
                    transform="translate(0 , 1)"
                    cx="865"
                    cy="360"
                    r="6"
                    fill="#0d1f3a"
                    stroke={visual.strokeMotor}
                    strokeWidth="2"
                    style={{ filter: visual.brilhoMotor }}
                    className={proximoMotor === 5 && !motorLigado(5) ? "piscando" : ""}
                  />
                  <text x="865" y="364" fill={visual.simboloCor} fontSize="12" textAnchor="middle">⊗</text>

                  <rect x="846" y="369" width="40" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
                  <text x="867" y="377" fill="#ffaa00" fontSize="6" fontFamily="monospace" textAnchor="middle">+181.5 %</text>

                  <rect
                    x="846"
                    y="382"
                    width="40"
                    height="11"
                    fill={visual.boxFill}
                    stroke={visual.boxStroke}
                    strokeWidth="1"
                    rx="1"
                  />
                  <text
                    x="867"
                    y="390"
                    fill={visual.textoStatusCor}
                    fontSize="5"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {visual.textoStatus}
                  </text>
                </g>
              );
            })()}
          </g>
           
          <g transform="translate(0 -190)">
 
          <text x="580" y="260" fill="#00ff88" fontSize="10" fontWeight="bold" textAnchor="middle">LAP 100% RETORNO CALDEIRA</text>
          <text x="740" y="275" fill="#ffaa00" fontSize="10" fontWeight="bold" textAnchor="middle">0% DESCARTE</text>
          <rect x="835" y="280" width="55" height="14" fill="#061020" stroke="#00ff44" strokeWidth="1.5" rx="1" />
          <text x="862" y="290" fill="#00ff88" fontSize="9" fontFamily="monospace" textAnchor="middle">MET-05+</text>
          </g>
          {/* Bottom bar relações */}
          <rect x="0" y="455" width="900" height="60" fill="#060b14" stroke="#1e3a5f" strokeWidth="1" />
          {[
            { label:"NÍVEL ÁGUA POTÁVEL", val:"+143.4 %", x:20 },
            { label:"RELAÇÃO ESTEIRA 1:", val:"100.0 %",  x:110 },
            { label:"RELAÇÃO ESTEIRA 2:", val:"100.0 %",  x:200 },
            { label:"RELAÇÃO ESTEIRA 3:", val:"100.0 %",  x:290 },
            { label:"RELAÇÃO ESTEIRA 4:", val:"100.0 %",  x:380 },
            { label:"RELAÇÃO ESTEIRA 5:", val:"100.0 %",  x:470 },
            { label:"RELAÇÃO ESTEIRA 6:", val:"100.0 %",  x:560 },
            { label:"MASTER DE ROTAÇÃO", val:"100.0 %",  x:650 },
          ].map(({ label, val, x }) => (
            <g key={x} className="clickable" onClick={() => open(`REL_${x}`, label)}>
              <text x={x} y="472" fill="#94a3b8" fontSize="7" fontFamily="Arial">{label}</text>
              <rect x={x} y="476" width="70" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
              <text x={x+35} y="487" fill="#00ff88" fontSize="9" fontFamily="monospace" textAnchor="middle">{val}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
 
// ─── PANEL 4 — Desaerador / Água Alimentação ──────────────────────────────────
function PanelDesaerador({ open }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">◈ Desaerador — Água Alimentação Caldeiras</div>
        <div style={{ fontSize: 9, color: "#94a3b8", fontFamily: "monospace" }}>EC_06C/MVM_A_210_DES_001</div>
        <div className="panel-status-pills">
          <span className="pill pill-a">A</span>
          <span className="pill pill-u">U</span>
          <span className="pill pill-s">S</span>
        </div>
      </div>
      <div className="panel-svg-container">
        <svg viewBox="0 0 900 560" preserveAspectRatio="xMidYMid meet">
          <rect width="900" height="560" fill="#0a0e1a" />
          <text x="450" y="280" className="lobby-mark" textAnchor="middle">LOBBY</text>
 
          {/* BOMBA ÁGUA DESMIN */}
          <rect x="5" y="5" width="130" height="45" fill="#0a1628" stroke="#2a3f6f" strokeWidth="1" rx="2" />
          <text x="70" y="19" fill="#94a3b8" fontSize="8" textAnchor="middle">BOMBA ÁGUA</text>
          <text x="70" y="30" fill="#94a3b8" fontSize="8" textAnchor="middle">DESMINERALIZADA</text>
          <rect x="10" y="33" width="120" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="70" y="43" fill="#00ff88" fontSize="9" fontFamily="monospace" textAnchor="middle">+0.0 m³/h</text>
          <rect x="5" y="55" width="130" height="40" fill="#061020" stroke="#2a3f6f" strokeWidth="1" rx="2" />
          <text x="70" y="70" fill="#60a5fa" fontSize="9" fontFamily="monospace" textAnchor="middle">+477.2 m³</text>
 
          {/* Pump left (TRIP) */}
          <g className="clickable" onClick={() => open("BOMBA_DESMIN", "Bomba Água Desmineralizada")}>
            <circle cx="35" cy="110" r="20" fill="#1a0000" stroke="#dc2626" strokeWidth="2" />
            <text x="35" y="114" fill="#ff4444" fontSize="14" textAnchor="middle">⊗</text>
            <rect x="10" y="133" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="35" y="142" fill="#ff4444" fontSize="8" fontFamily="monospace" textAnchor="middle">+98.3 %</text>
            <rect x="10" y="147" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="35" y="156" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+27.6 A</text>
            <circle cx="70" cy="110" r="12" fill="#7f1d1d" stroke="#dc2626" strokeWidth="2" className="led-alarm" />
            <text x="70" y="114" fill="#fca5a5" fontSize="7" fontWeight="bold" textAnchor="middle">TRIP</text>
          </g>
 
          {/* Water pipe */}
          <line x1="100" y1="70" x2="320" y2="70" stroke="#34d399" strokeWidth="3" className="pipe-flow" />
          <text x="140" y="60" fill="#60a5fa" fontSize="8" fontFamily="monospace">+5.9 %</text>
 
          {/* DESAERADOR */}
          <g className="clickable" onClick={() => open("DESAERADOR", "Desaerador 210-D-001")}>
            <rect x="320" y="55" width="220" height="95" fill="#0d2a3a" stroke="#60a5fa" strokeWidth="2" rx="5" />
            <rect x="325" y="100" width="210" height="45" fill="#0a3a5a" rx="3" />
            <rect x="325" y="100" width="145" height="45" fill="#0a4a6a" rx="3" />
            <text x="430" y="82" fill="#60a5fa" fontSize="12" fontWeight="bold" textAnchor="middle">210 D 001</text>
            <text x="430" y="95" fill="#94a3b8" fontSize="9" textAnchor="middle">DESAERADOR</text>
            {[330,345,360,375,390,405,420,435,450].map(x => (
              <line key={x} x1={x} y1="105" x2={x} y2="145" stroke="#34d399" strokeWidth="1" opacity="0.5" />
            ))}
            <rect x="325" y="155" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="350" y="164" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+68.0 %</text>
            <rect x="380" y="155" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="405" y="164" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+65.8 %</text>
            <rect x="435" y="155" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="462" y="164" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+9.5 %</text>
            <rect x="325" y="169" width="60" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="355" y="178" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+115.1 °C</text>
          </g>
 
          <text x="430" y="48" fill="#94a3b8" fontSize="9" textAnchor="middle">VAPOR DE ESCAPE</text>
          <rect x="320" y="30" width="80" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="360" y="39" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">+0.400 Kgf/cm²</text>
          <rect x="320" y="44" width="80" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="360" y="53" fill="#60a5fa" fontSize="8" fontFamily="monospace" textAnchor="middle">+0.766 Kgf/cm²</text>
 
          {/* Valve vapor escape */}
          <g className="clickable" onClick={() => open("VALV_VAPOR_ESCAPE", "Válvula Vapor de Escape")}>
            <rect x="480" y="35" width="25" height="18" fill="#1a2a4a" stroke="#60a5fa" strokeWidth="1.5" rx="2" />
            <line x1="480" y1="44" x2="505" y2="44" stroke="#60a5fa" strokeWidth="2" />
            <line x1="492" y1="35" x2="492" y2="28" stroke="#60a5fa" strokeWidth="1.5" />
            <circle cx="492" cy="25" r="5" fill="#00ff44" />
          </g>
 
          {/* MOTOBOMBA 3 popup */}
          <g className="clickable" onClick={() => open("MOTOBOMBA3", "Motobomba 3 Água Alimentação Caldeiras")}>
            <rect x="5" y="185" width="175" height="155" fill="#0a1628" stroke="#2563eb" strokeWidth="1.5" rx="2" />
            <text x="92" y="200" fill="#60a5fa" fontSize="10" fontWeight="bold" textAnchor="middle">MOTOBOMBA 3 ÁGUA</text>
            <text x="92" y="212" fill="#60a5fa" fontSize="9" textAnchor="middle">ALIMENTAÇÃO CALDEIRAS</text>
            <line x1="5" y1="215" x2="180" y2="215" stroke="#2563eb" strokeWidth="1" />
            <rect x="15" y="220" width="160" height="18" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1" rx="2" className="led-alarm" />
            <text x="95" y="232" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">TRIP - DESLIGADO</text>
          </g>
          <g className="clickable" onClick={() => open("MB3_LIGA", "Ligar Motobomba 3")}>
            <rect x="35" y="242" width="60" height="16" fill="#16a34a" stroke="#22c55e" strokeWidth="1" rx="2" />
            <text x="65" y="253" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">LIGA</text>
          </g>
          <g className="clickable" onClick={() => open("MB3_DESLIGA", "Desligar Motobomba 3")}>
            <rect x="105" y="242" width="60" height="16" fill="#dc2626" stroke="#ef4444" strokeWidth="1" rx="2" />
            <text x="135" y="253" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">DESLIGA</text>
          </g>
          <rect x="10" y="294" width="165" height="18" fill="#16a34a" stroke="#22c55e" strokeWidth="1.5" rx="2" />
          <text x="92" y="306" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">INTER. HABILITADO</text>
          <rect x="10" y="315" width="165" height="18" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" rx="2" className="led-alarm" />
          <text x="92" y="327" fill="#fcd34d" fontSize="10" fontWeight="bold" textAnchor="middle">MOTOR EM TRIP</text>
 
          {/* PRESSÃO DESAERADOR panel */}
          <g className="clickable" onClick={() => open("PRESS_DESAERADOR", "Pressão Desaerador - Controlador")}>
            <rect x="760" y="40" width="135" height="230" fill="#0a1628" stroke="#2563eb" strokeWidth="1.5" rx="2" />
            <text x="827" y="56" fill="#60a5fa" fontSize="10" fontWeight="bold" textAnchor="middle">PRESSÃO DESAERADOR</text>
            <line x1="760" y1="60" x2="895" y2="60" stroke="#2563eb" strokeWidth="1" />
            <text x="790" y="74" fill="#94a3b8" fontSize="9" textAnchor="middle">PV</text>
            <text x="850" y="74" fill="#94a3b8" fontSize="9" textAnchor="middle">MV</text>
          </g>
          {["+5.000","+4.500","+4.000","+3.500","+3.000","+2.500","+2.000","+1.500","+1.000","+0.500"].map((v, i) => (
            <g key={v}>
              <rect x="765" y={95+i*12} width="50" height="10" fill={i>=4&&i<=5?"#0a3020":"#061020"} stroke="#2a3f6f" strokeWidth="0.5" />
              <text x="790" y={103+i*12} fill={i>=4&&i<=5?"#00ff88":"#94a3b8"} fontSize="7" fontFamily="monospace" textAnchor="middle">{v}</text>
            </g>
          ))}
          <rect x="812" y="155" width="12" height="30" fill="#1d4ed8" rx="1" />
          <polygon points="808,155 824,155 816,148" fill="#60a5fa" />
          <rect x="765" y="78" width="50" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="790" y="87" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+0.400</text>
          <rect x="825" y="78" width="40" height="12" fill="#78350f" stroke="#f59e0b" strokeWidth="1" />
          <text x="845" y="87" fill="#fcd34d" fontSize="8" fontFamily="monospace" textAnchor="middle">MAN</text>
 
          {/* Main horizontal pipe */}
          <line x1="185" y1="300" x2="750" y2="300" stroke="#34d399" strokeWidth="3" className="pipe-flow" />
 
          {/* Valves */}
          {[{ id:"VALV_ALIM_1", x:195, flow:"+160.0 m³/h", press:"+2.6 Kgf/cm²", label:"MUITO FECHADA" },
            { id:"VALV_ALIM_2", x:355, flow:"+160.0 m³/h", press:"+2.1 Kgf" },
            { id:"VALV_ALIM_3", x:510, flow:"+160.0 m³/h", press:"+277.3 m³/h" },
          ].map(({ id, x, flow, press, label }) => (
            <g key={id} className="clickable" onClick={() => open(id, `Válvula ${id.slice(-1)} Alimentação`)}>
              <rect x={x} y="285" width="25" height="18" fill="#1a2a4a" stroke="#34d399" strokeWidth="1.5" rx="2" />
              <line x1={x} y1="294" x2={x+25} y2="294" stroke="#34d399" strokeWidth="2" />
              <rect x={x-10} y="265" width="65" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
              <text x={x+22} y="274" fill="#00ff88" fontSize="7" fontFamily="monospace" textAnchor="middle">{flow}</text>
              <rect x={x-10} y="308" width="65" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
              <text x={x+22} y="317" fill="#ffaa00" fontSize="7" fontFamily="monospace" textAnchor="middle">{press}</text>
              {label && (
                <>
                  <rect x={x-10} y="355" width="90" height="14" fill="#78350f" stroke="#f59e0b" strokeWidth="1" rx="1" />
                  <text x={x+35} y="365" fill="#fcd34d" fontSize="8" fontWeight="bold" textAnchor="middle">{label}</text>
                </>
              )}
            </g>
          ))}
 
          {/* AUX pump */}
          <g className="clickable" onClick={() => open("MOTOR_AUX_DES", "Motor Auxiliar")}>
            <text x="195" y="440" fill="#94a3b8" fontSize="9" textAnchor="middle">AUX.</text>
            <circle cx="195" cy="470" r="28" fill="#1a0000" stroke="#dc2626" strokeWidth="2" />
            <text x="195" y="474" fill="#ff4444" fontSize="18" textAnchor="middle">⊗</text>
            <rect x="165" y="514" width="70" height="14" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1" rx="1" className="led-alarm" />
            <text x="200" y="524" fill="#fca5a5" fontSize="8" fontWeight="bold" textAnchor="middle">TRIP</text>
          </g>
 
          {/* Pump 2A */}
          <g className="clickable" onClick={() => open("BOMBA_2A", "Bomba de Água 2A")}>
            <text x="360" y="435" fill="#94a3b8" fontSize="9" textAnchor="middle">2 A</text>
            <circle cx="360" cy="470" r="28" fill="#0d1f3a" stroke="#2563eb" strokeWidth="2" />
            <text x="360" y="474" fill="#60a5fa" fontSize="18" textAnchor="middle">⊕</text>
            <rect x="310" y="415" width="60" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="340" y="424" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+60.0 °C</text>
            <rect x="330" y="500" width="35" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="347" y="509" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+526.5</text>
            <rect x="367" y="500" width="40" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="387" y="509" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+99.7 %</text>
          </g>
          <g className="clickable" onClick={() => open("LIGA_2A", "Ligar Bomba 2A")}>
            <rect x="320" y="514" width="60" height="16" fill="#16a34a" stroke="#22c55e" strokeWidth="1" rx="2" />
            <text x="350" y="525" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">LIGA</text>
          </g>
          <g className="clickable" onClick={() => open("DESLIGA_2A", "Desligar Bomba 2A")}>
            <rect x="383" y="514" width="60" height="16" fill="#dc2626" stroke="#ef4444" strokeWidth="1" rx="2" />
            <text x="413" y="525" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">DESLIGA</text>
          </g>
 
          {/* Pump 2B */}
          <g className="clickable" onClick={() => open("BOMBA_2B", "Bomba de Água 2B")}>
            <text x="535" y="435" fill="#94a3b8" fontSize="9" textAnchor="middle">2 B</text>
            <circle cx="535" cy="470" r="28" fill="#0d1f3a" stroke="#2563eb" strokeWidth="2" />
            <text x="535" y="474" fill="#60a5fa" fontSize="18" textAnchor="middle">⊕</text>
            <rect x="490" y="415" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="517" y="424" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+56.5 °C</text>
            <rect x="505" y="500" width="35" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="522" y="509" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+582.7</text>
            <rect x="542" y="500" width="45" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="564" y="509" fill="#00ff88" fontSize="8" fontFamily="monospace" textAnchor="middle">+100.0 %</text>
          </g>
          <g className="clickable" onClick={() => open("LIGA_2B", "Ligar Bomba 2B")}>
            <rect x="500" y="514" width="60" height="16" fill="#16a34a" stroke="#22c55e" strokeWidth="1" rx="2" />
            <text x="530" y="525" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">LIGA</text>
          </g>
          <g className="clickable" onClick={() => open("DESLIGA_2B", "Desligar Bomba 2B")}>
            <rect x="563" y="514" width="60" height="16" fill="#dc2626" stroke="#ef4444" strokeWidth="1" rx="2" />
            <text x="593" y="525" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">DESLIGA</text>
          </g>
 
          {/* Pump PARADO/LIBERADA */}
          <g className="clickable" onClick={() => open("BOMBA_PARADO", "Bomba Estado Parado/Liberado")}>
            <circle cx="670" cy="470" r="28" fill="#1a2a00" stroke="#00ff44" strokeWidth="2" />
            <text x="670" y="474" fill="#00ff88" fontSize="13" textAnchor="middle">⊕</text>
            <rect x="635" y="415" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="662" y="424" fill="#ffaa00" fontSize="8" fontFamily="monospace" textAnchor="middle">+58.1 °C</text>
            <rect x="635" y="500" width="70" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="670" y="509" fill="#94a3b8" fontSize="8" fontFamily="monospace" textAnchor="middle">+0.0 RPM</text>
          </g>
          <rect x="625" y="514" width="55" height="16" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1" rx="2" />
          <text x="652" y="525" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">PARADO</text>
          <rect x="685" y="514" width="55" height="16" fill="#16a34a" stroke="#22c55e" strokeWidth="1" rx="2" />
          <text x="712" y="525" fill="#fff" fontSize="9" fontWeight="bold" textAnchor="middle">LIBERADA</text>
 
          {/* Vazão captação */}
          <g className="clickable" onClick={() => open("VAZAO_CAPTACAO", "Vazão de Captação")}>
            <rect x="755" y="430" width="130" height="80" fill="#0a1628" stroke="#2a3f6f" strokeWidth="1" rx="2" />
            <text x="820" y="445" fill="#94a3b8" fontSize="9" textAnchor="middle">Vazão captação</text>
            <rect x="760" y="450" width="120" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="820" y="460" fill="#ffaa00" fontSize="9" fontFamily="monospace" textAnchor="middle">+941.4 m³/h</text>
            <rect x="760" y="466" width="120" height="14" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
            <text x="820" y="476" fill="#60a5fa" fontSize="9" fontFamily="monospace" textAnchor="middle">+6814.2 m³</text>
            <circle cx="775" cy="498" r="10" fill="#1a0000" stroke="#dc2626" strokeWidth="2" className="led-alarm" />
            <text x="775" y="502" fill="#ff4444" fontSize="7" textAnchor="middle">⊗</text>
          </g>
          <rect x="755" y="507" width="130" height="16" fill="#7f1d1d" stroke="#dc2626" strokeWidth="1.5" rx="1" className="led-alarm" />
          <text x="820" y="518" fill="#fca5a5" fontSize="9" fontWeight="bold" textAnchor="middle">EXTRA BAIXO</text>
 
          {/* Flow to caldeiras */}
          <line x1="750" y1="300" x2="895" y2="300" stroke="#34d399" strokeWidth="3" className="pipe-flow" />
          <rect x="760" y="275" width="65" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="792" y="284" fill="#00ff88" fontSize="7" fontFamily="monospace" textAnchor="middle">+276.0 m³/h</text>
          <rect x="830" y="275" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="857" y="284" fill="#60a5fa" fontSize="7" fontFamily="monospace" textAnchor="middle">+134.5 m³/h</text>
          <rect x="830" y="288" width="55" height="12" fill="#061020" stroke="#2a3f6f" strokeWidth="1" />
          <text x="857" y="297" fill="#ffaa00" fontSize="7" fontFamily="monospace" textAnchor="middle">+93.7 Kgf</text>
 
          {/* Pressure 1.4 */}
          <g className="clickable" onClick={() => open("PRESS_1721", "Pressão 1.4 Kgf/cm²")}>
            <rect x="640" y="305" width="80" height="30" fill="#0a1628" stroke="#2563eb" strokeWidth="1.5" rx="2" />
            <text x="680" y="322" fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">+1.4 Kgf/cm²</text>
          </g>
 
          <text x="30" y="542" fill="#94a3b8" fontSize="8">TORRE RESFRIAMENTO MANCAIS</text>
          <text x="30" y="555" fill="#94a3b8" fontSize="7">TORRE RESFRIAMENTO MANCAIS (ÁGUA RETORNO)</text>
          <text x="875" y="450" fill="#94a3b8" fontSize="8" textAnchor="middle">VAPOR</text>
          <text x="875" y="350" fill="#94a3b8" fontSize="8" textAnchor="middle"
            transform="rotate(90,875,350)">ÁGUA ALIM. CALDEIRAS</text>
        </svg>
      </div>
    </div>
  );
}
 
// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
const COISimulator= () =>  {
  const [clock, setClock] = useState(() => formatClock(new Date()));
  const [activeNav, setActiveNav] = useState("vapor");
  const [modal, setModal] = useState(null);         // { id, name }
  const [showAlarms, setShowAlarms] = useState(false);
  const [equipState, setEquipState] = useState({});
  const [mostrarTutorial, setMostrarTutorial] = useState(false);  

  const [mensagemParabens, setMensagemParabens] = useState("");
  const [bombasLigadas, setBombasLigadas] = useState([]);
  const [mensagemErroBomba, setMensagemErroBomba] = useState("");
  const sequenciaBombas = [4, 3,2,1,0];
  

  const [queimadoresLigados, setQueimadoresLigados] = useState([]);
  const [mensagemErroQueimador, setMensagemErroQueimador] = useState("");
  const [temperaturaCaldeira, setTemperaturaCaldeira] = useState(88.6);
  const sequenciaQueimadores = [1, 2, 3, 4, 5, 6, 7];

  const [etapaAtual, setEtapaAtual] = useState(0);

  const etapasPartida = [
    {
      id: 0,
      titulo: "Vamos dar partida na caldeira",
      descricao: "Clique na seta para iniciar a sequência operacional.",
      tipo: "intro"
    },
    {
      id: 1,
      titulo: "PASSO 1: PARTIDA DAS ESTEIRAS DE BAGAÇO",
      descricao: "Ligue os motores na sequência correta: REGRA Para esteira 1 e 2 Esteira 1 e 2 só dar partida junto com o início do difusor. MOTIVO: elas são as esteiras da saida do difusor q inicialmente nao tera necessidade de ligar a mesma. Se ligarem antes, esvaziam a linha e as caldeiras ficam sem bagaço ",
      destaque: "6 → 4 → 3 → 5 → 7",
      tipo: "sequencia"
    },
    {
    id: 2,
    titulo: "PASSO 2: PARTIDA NOS EXAUSTORES E NOS VENTILADORES",
    descricao: "Ligue os exautores e ventiladores na sequência correta:",
    destaque: "Ventilador1 →Ventilador2 → Exaustor1 → Exaustor2,Pneumatico",
    tipo: "bombas"
  },
  {
    id: 3,
    titulo: "PASSO 3: PARTIDA DOS QUEIMADORES",
    descricao: "Ligue os 7 queimadores na sequência correta para elevar a temperatura da caldeira.",
    destaque: "1 → 2 → 3 → 4 → 5 → 6 → 7",
    tipo: "queimadores"
  }
  ];
  const etapa = etapasPartida[etapaAtual];

  const sequenciaMotores = [6, 4, 3, 5, 7];
  const [motoresLigados, setMotoresLigados] = useState([]);
  const [mensagemErroEtapa, setMensagemErroEtapa] = useState("");

  function handleCliqueMotorEsteira(motor) {
  if (!mostrarTutorial || etapaAtual !== 1) return;

  if (motoresLigados.includes(motor)) return;

  const proximo = sequenciaMotores[motoresLigados.length];

  if (motor === proximo) {
    const novaSequencia = [...motoresLigados, motor];
    setMotoresLigados(novaSequencia);
    setMensagemErroEtapa("");

    if (novaSequencia.length === sequenciaMotores.length) {
      setMensagemParabens("Parabéns! Todas as esteiras foram ligadas com sucesso.");

      setTimeout(() => {
        setMensagemParabens("");
        setEtapaAtual(2);
      }, 1800);
    }

    return;
  }

  setMensagemErroEtapa(`Sequência incorreta. Ligue primeiro o motor ${proximo}.`);

  setTimeout(() => {
    setMensagemErroEtapa("");
  }, 2200);
}
const labelBombas = {
  0: "Pneumatico",
  1: "Exaustor2",
  2: "Exaustor1",
  3: "Ventilador2",
  4: "Ventilador1"
};

function handleCliqueBombaC1(num) {
  if (!mostrarTutorial || etapaAtual !== 2) return;

  if (bombasLigadas.includes(num)) return;

  const proxima = sequenciaBombas[bombasLigadas.length];

  if (num === proxima) {
    const novaSequencia = [...bombasLigadas, num];
    setBombasLigadas(novaSequencia);
    setMensagemErroBomba("");

    if (novaSequencia.length === sequenciaBombas.length) {
      setMensagemParabens("Parabéns! Todas as bombas da sequência foram ligadas com sucesso.");

      setTimeout(() => {
        setMensagemParabens("");
        setEtapaAtual(3);

      }, 1800);
    }

    return;
  }

  const nomeEsperado = labelBombas[proxima];

  setMensagemErroBomba(`Sequência incorreta. Ligue primeiro o ${nomeEsperado}.`);

  setTimeout(() => {
    setMensagemErroBomba("");
  }, 2200);
}

function handleCliqueQueimador(num) {
  if (!mostrarTutorial || etapaAtual !== 3) return;

  if (queimadoresLigados.includes(num)) return;

  const proximo = sequenciaQueimadores[queimadoresLigados.length];

  if (num === proximo) {
    const novaSequencia = [...queimadoresLigados, num];
    setQueimadoresLigados(novaSequencia);
    setMensagemErroQueimador("");

    const temperaturaInicial = 88.6;
    const temperaturaFinal = 800;
    const incremento = (temperaturaFinal - temperaturaInicial) / sequenciaQueimadores.length;
    const novaTemperatura = Math.min(
      temperaturaFinal,
      temperaturaInicial + incremento * novaSequencia.length
    );

    setTemperaturaCaldeira(Number(novaTemperatura.toFixed(1)));

    if (novaSequencia.length === sequenciaQueimadores.length) {
      setMensagemParabens("Parabéns! Todos os queimadores foram ligados e a caldeira atingiu 800 °C.");
    }

    return;
  }

  setMensagemErroQueimador(`Sequência incorreta. Ligue primeiro o queimador ${proximo}.`);

  setTimeout(() => {
    setMensagemErroQueimador("");
  }, 2200);
}

const proximoMotorTutorial =
  mostrarTutorial && etapaAtual === 1
    ? sequenciaMotores[motoresLigados.length] ?? null
    : null;

const proximaBombaTutorial =
  mostrarTutorial && etapaAtual === 2
    ? sequenciaBombas[bombasLigadas.length] ?? null
    : null;
const proximoQueimadorTutorial =
  mostrarTutorial && etapaAtual === 3
    ? sequenciaQueimadores[queimadoresLigados.length] ?? null
    : null;

  
 
  // Inject CSS once
  useEffect(() => {
    if (!document.getElementById("coi-styles")) {
      const style = document.createElement("style");
      style.id = "coi-styles";
      style.textContent = CSS;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById("coi-styles");
      if (el) el.remove();
    };
  }, []);
 
  // Clock
  useEffect(() => {
    const t = setInterval(() => setClock(formatClock(new Date())), 1000);
    return () => clearInterval(t);
  }, []);
 
  // ESC close
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") { setModal(null); setShowAlarms(false); } };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);
 
  const openModal = useCallback((id, name) => {
    setEquipState(prev => {
      if (!prev[id]) {
        return { ...prev, [id]: { status: "OPERANDO", mode: "AUTO", value: (Math.random() * 100).toFixed(1), alarm: false } };
      }
      return prev;
    });
    setModal({ id, name });
  }, []);
 
  const handleSetStatus = useCallback((id, status) => {
    setEquipState(prev => ({ ...prev, [id]: { ...(prev[id] || {}), status } }));
  }, []);
 
  const handleSetMode = useCallback((id, mode) => {
    setEquipState(prev => ({ ...prev, [id]: { ...(prev[id] || {}), mode } }));
  }, []);
 
  const handleReset = useCallback((id) => {
    setEquipState(prev => ({
      ...prev, [id]: { status: "OPERANDO", mode: "AUTO", value: (Math.random() * 100).toFixed(1), alarm: false }
    }));
  }, []);
 
  const navItems = [
    { key: "difusor",  label: "Difusor" },
    { key: "caldo",   label: "Tratamento Caldo" },
    { key: "util",    label: "Utilidades" },
    { key: "vapor",   label: "Geração Vapor" },
    { key: "energia", label: "Geração Energia" },
    { key: "agua",    label: "Tratamento Água" },
    { key: "ferm",    label: "Fermentação" },
    { key: "dest",    label: "Destilaria" },
    { key: "manut",   label: "Manutenção" },
  ];
 
  return (
    <div className="coi-root">
 
      {/* TOP BAR */}
      <div className="coi-topbar">
        <div className="coi-logo">▲ LOBBY</div>
        <div style={{ width: 1, height: 20, background: "#2a3f6f" }} />
        <span style={{ fontSize: 11, color: "#94a3b8" }}>COI - CENTRO DE OPERAÇÕES INDUSTRIAIS</span>
        <div style={{ width: 1, height: 20, background: "#2a3f6f" }} />
        <div className="coi-clock">{clock}</div>
        <div style={{ width: 1, height: 20, background: "#2a3f6f" }} />
        <span className="status-dot dot-red" />
        <div className="coi-alarm-global">⚠ SOBRECARGA - ESTEIRA DOSADORA BAGAÇO 171-ET-007</div>
        <span className="coi-alarm-count">| 7 ALARMES ATIVOS</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 10, color: "#94a3b8" }}>OP: JOHN</span>
          <span className="status-dot dot-green" />
          <span style={{ fontSize: 10, color: "#94a3b8" }}>CONECTADO</span>
        </div>
      </div>
 
      {/* NAV BAR */}
      <div className="coi-navbar">
        {navItems.map(({ key, label }, i) => (
          <span key={key} style={{ display: "contents" }}>
            {i > 0 && <div className="nav-sep" />}
            <button
              className={`nav-btn${activeNav === key ? " active" : ""}`}
              onClick={() => setActiveNav(key)}
            >{label}</button>
          </span>
        ))}
        <div className="nav-sep" />
        <button className="nav-btn alarm-nav" onClick={() => setShowAlarms(true)}>⚠ ALARMES (7)</button>
      </div>

      
 
      {/* 4-PANEL GRID */}
      
      <div className="coi-main">
       <PanelMaster open={openModal} />
       <PanelCaldeira1Detail
            open={openModal}
            etapaAtual={etapaAtual}
            bombasLigadas={bombasLigadas}
            onBombaClick={handleCliqueBombaC1}
            proximaBomba={proximaBombaTutorial}
            queimadoresLigados={queimadoresLigados}
            onQueimadorClick={handleCliqueQueimador}
            proximoQueimador={proximoQueimadorTutorial}
            temperaturaCaldeira={temperaturaCaldeira}
          />
        <PanelEsteiras open={openModal} motoresLigados={motoresLigados} onMotorClick={handleCliqueMotorEsteira} proximoMotor={proximoMotorTutorial}/>
        <PanelDesaerador open={openModal} />
      </div>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 50
      }}>

        {/* Overlay */}

     <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          zIndex: 50
        }}>

          {/* BOTÃO COMEÇAR */}
          {!mostrarTutorial && (
            <div
              className="clickable"
              onClick={() => {
                setMostrarTutorial(true);
                setEtapaAtual(0);
              }}
              style={{
                pointerEvents: "auto",
                position: "absolute",
                top: "45%",
                background: "#0a1628",
                border: "2px solid #ffaa00",
                borderRadius: 6,
                padding: "14px 40px",
                boxShadow: "0 0 25px #ffaa00"
              }}
            >
              <span style={{
                color: "#ffaa00",
                fontWeight: "bold",
                fontSize: 16,
                fontFamily: "Arial"
              }}>
                COMEÇAR
              </span>
            </div>
          )}

          {/* ETAPAS DO TUTORIAL */}
          {mostrarTutorial && etapa && (
            <div style={{
              pointerEvents: "auto",
              position: "absolute",
              top: "31%",
              maxWidth: 500,
              background: "#061020",
              border: "2px solid #60a5fa",
              borderRadius: 10,
              padding: "16px 22px",
              color: "#e2e8f0",
              boxShadow: "0 0 22px rgba(96,165,250,0.4)",
              textAlign: "center"
            }}>
              <div style={{
                color: "#60a5fa",
                fontWeight: "bold",
                fontSize: 15,
                fontFamily: "Arial",
                marginBottom: 10
              }}>
                {etapa.titulo}
              </div>

              <div style={{
                color: "#e2e8f0",
                fontSize: 13,
                fontFamily: "Arial",
                marginBottom: etapa.destaque ? 10 : 0
              }}>
                {etapa.descricao}
              </div>

              {etapa.id === 1 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 6
              }}>
                {sequenciaMotores
                  .filter((motor) => !motoresLigados.includes(motor))
                  .map((motor, index, listaRestante) => (
                    <div key={motor} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        minWidth: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#00ff88",
                        fontWeight: "bold",
                        fontSize: 18,
                        fontFamily: "Arial"
                      }}>
                        <span>{motor}</span>
                      </div>

                      {index < listaRestante.length - 1 && (
                        <span style={{ color: "#00ff88", fontWeight: "bold", fontSize: 16 }}>
                          →
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}

            {etapa.id === 2 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 6
              }}>
                {sequenciaBombas
                  .filter((bomba) => !bombasLigadas.includes(bomba))
                  .map((bomba, index, listaRestante) => (
                    <div key={bomba} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        minWidth: 56,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#00ff88",
                        fontWeight: "bold",
                        fontSize: 18,
                        fontFamily: "Arial"
                      }}>
                        <span>{labelBombas[bomba]}</span>
                      </div>

                      {index < listaRestante.length - 1 && (
                        <span style={{ color: "#00ff88", fontWeight: "bold", fontSize: 16 }}>
                          →
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}
             {mensagemParabens && (
            <div style={{
              marginTop: 12,
              background: "#052e16",
              border: "1px solid #22c55e",
              borderRadius: 6,
              padding: "8px 12px",
              color: "#bbf7d0",
              fontSize: 12,
              fontWeight: "bold",
              fontFamily: "Arial",
              boxShadow: "0 0 12px rgba(34,197,94,0.35)"
            }}>
              {mensagemParabens}
            </div>
          )}

          {mensagemErroBomba && etapaAtual === 2 && (
            <div style={{
              marginTop: 12,
              background: "#1a0000",
              border: "1px solid #dc2626",
              borderRadius: 6,
              padding: "8px 12px",
              color: "#fca5a5",
              fontSize: 12,
              fontWeight: "bold",
              fontFamily: "Arial",
              boxShadow: "0 0 12px rgba(220,38,38,0.35)"
            }}>
              {mensagemErroBomba}
            </div>
          )}

          {etapa.id === 3 && (
              <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 6
              }}>
                {sequenciaQueimadores
                  .filter((q) => !queimadoresLigados.includes(q))
                  .map((q, index, listaRestante) => (
                    <div key={q} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        minWidth: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#00ff88",
                        fontWeight: "bold",
                        fontSize: 18,
                        fontFamily: "Arial"
                      }}>
                        <span>{q}</span>
                      </div>

                      {index < listaRestante.length - 1 && (
                        <span style={{ color: "#00ff88", fontWeight: "bold", fontSize: 16 }}>
                          →
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            )}

              
              {mensagemErroEtapa && etapaAtual === 1 && (
                <div style={{
                  marginTop: 12,
                  background: "#1a0000",
                  border: "1px solid #dc2626",
                  borderRadius: 6,
                  padding: "8px 12px",
                  color: "#fca5a5",
                  fontSize: 12,
                  fontWeight: "bold",
                  fontFamily: "Arial",
                  boxShadow: "0 0 12px rgba(220,38,38,0.35)"
                }}>
                  {mensagemErroEtapa}
                </div>
              )}

              {mensagemErroQueimador && etapaAtual === 3 && (
                  <div style={{
                    marginTop: 12,
                    background: "#1a0000",
                    border: "1px solid #dc2626",
                    borderRadius: 6,
                    padding: "8px 12px",
                    color: "#fca5a5",
                    fontSize: 12,
                    fontWeight: "bold",
                    fontFamily: "Arial",
                    boxShadow: "0 0 12px rgba(220,38,38,0.35)"
                  }}>
                    {mensagemErroQueimador}
                  </div>
                )}

              {etapa.tipo === "intro" && (
                <div
                  className="clickable"
                  onClick={() => setEtapaAtual(1)}
                  style={{
                    margin: "14px auto 0",
                    width: 42,
                    height: 42,
                    borderRadius: "50%",
                    background: "#0a1628",
                    border: "2px solid #60a5fa",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 18px rgba(96,165,250,0.45)",
                    cursor: "pointer"
                  }}
                >
                  <span style={{
                    color: "#60a5fa",
                    fontSize: 24,
                    fontWeight: "bold",
                    lineHeight: 1,
                    fontFamily: "Arial"
                  }}>
                    ↓
                  </span>
                </div>
              )}

              <div style={{
                position: "absolute",
                bottom: -10,
                left: "50%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "10px solid #60a5fa"
              }} />
            </div>
          )}

        </div>
      

    </div>


 
      {/* BOTTOM BAR */}
      <div className="coi-bottombar">
        <span>EC_06C/MVM_A_171_MET_007/A171_MET_007</span>
        <span className="alarm-msg">⚠ SOBRECARGA - ESTEIRA DOSADORA BAGAÇO 171-ET-007</span>
        <span style={{ marginLeft: "auto" }}>
          Geração Vapor: <span style={{ color: "#00ff88" }}>ATIVO</span>
        </span>
        <span>|</span>
        <span style={{ color: "#00ff88" }}>{clock}</span>
      </div>
      
 
      {/* EQUIPMENT MODAL */}
      {modal && (
        <EquipModal
          modal={modal}
          equipState={equipState}
          onClose={() => setModal(null)}
          onSetStatus={handleSetStatus}
          onSetMode={handleSetMode}
          onReset={handleReset}
        />
      )}
 
      {/* ALARM MODAL */}
      {showAlarms && <AlarmModal onClose={() => setShowAlarms(false)} />}
    </div>
  );
}
 export default COISimulator;
 