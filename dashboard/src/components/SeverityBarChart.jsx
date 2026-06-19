import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";
import styles from "./SeverityBarChart.module.css";

const SEVS = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "NEGLIGIBLE"];

const SERIES = {
  all: [
    { key: "Trivy/Vuln",  color: "#ff4d6d" },
    { key: "Grype/Vuln",  color: "#ff8c42" },
    { key: "Trivy/Hard",  color: "#38bdf8" },
    { key: "Grype/Hard",  color: "#c084fc" },
  ],
  trivy: [
    { key: "Trivy/Vuln",  color: "#ff4d6d" },
    { key: "Trivy/Hard",  color: "#38bdf8" },
  ],
  grype: [
    { key: "Grype/Vuln",  color: "#ff8c42" },
    { key: "Grype/Hard",  color: "#c084fc" },
  ],
};

function buildData(images) {
  return SEVS.map((sev) => ({
    name: sev,
    "Trivy/Vuln":  images.vulnerable.trivy[sev] ?? 0,
    "Grype/Vuln":  images.vulnerable.grype[sev] ?? 0,
    "Trivy/Hard":  images.hardened.trivy[sev]   ?? 0,
    "Grype/Hard":  images.hardened.grype[sev]   ?? 0,
  }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: p.fill }} />
          <span>{p.dataKey}</span>
          <b>{p.value}</b>
        </div>
      ))}
    </div>
  );
};

export default function SeverityBarChart({ images }) {
  const [mode, setMode] = useState("all");
  const data = buildData(images);
  const bars = SERIES[mode];

  return (
    <section>
      <div className={styles.titleRow}>
        <p className="section-title" style={{ marginBottom: 0 }}>심각도별 CVE 수 비교</p>
        <div className={styles.tabs}>
          {["all", "trivy", "grype"].map((m) => (
            <button
              key={m}
              className={`${styles.tab} ${mode === m ? styles.tabActive : ""}`}
              onClick={() => setMode(m)}
            >
              {m === "all" ? "전체" : m === "trivy" ? "Trivy만" : "Grype만"}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 12, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2338" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#7882a0", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#7882a0", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            <Legend
              wrapperStyle={{ fontSize: 12, color: "#7882a0", paddingTop: 12 }}
              iconType="circle"
            />
            {bars.map(({ key, color }) => (
              <Bar key={key} dataKey={key} fill={color} radius={[4, 4, 0, 0]} maxBarSize={32} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
