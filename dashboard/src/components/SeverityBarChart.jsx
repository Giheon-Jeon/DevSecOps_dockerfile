import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import styles from "./SeverityBarChart.module.css";

const SEVS = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "NEGLIGIBLE"];
const SEV_COLORS = {
  CRITICAL: "#f87171",
  HIGH:     "#fb923c",
  MEDIUM:   "#facc15",
  LOW:      "#4ade80",
  NEGLIGIBLE: "#94a3b8",
};

function buildData(images) {
  return SEVS.map((sev) => ({
    name: sev,
    "Trivy / Vuln":  images.vulnerable.trivy[sev] ?? 0,
    "Grype / Vuln":  images.vulnerable.grype[sev] ?? 0,
    "Trivy / Hard":  images.hardened.trivy[sev]   ?? 0,
    "Grype / Hard":  images.hardened.grype[sev]   ?? 0,
  }));
}

const BARS = [
  { key: "Trivy / Vuln", color: "#f87171" },
  { key: "Grype / Vuln", color: "#fb923c" },
  { key: "Trivy / Hard", color: "#60a5fa" },
  { key: "Grype / Hard", color: "#a78bfa" },
];

export default function SeverityBarChart({ images }) {
  const data = buildData(images);

  return (
    <section>
      <h2 className={styles.sectionTitle}>심각도별 CVE 수 비교</h2>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e3347" />
            <XAxis dataKey="name" tick={{ fill: "#8892a4", fontSize: 12 }} />
            <YAxis tick={{ fill: "#8892a4", fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "#1a1d27", border: "1px solid #2e3347", borderRadius: 8 }}
              labelStyle={{ color: "#e2e8f0", fontWeight: 700 }}
              itemStyle={{ color: "#e2e8f0" }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "#8892a4" }} />
            {BARS.map(({ key, color }) => (
              <Bar key={key} dataKey={key} fill={color} radius={[3, 3, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
