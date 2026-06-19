import { useState } from "react";
import styles from "./ComparisonTable.module.css";

const ALL_SEVS = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "NEGLIGIBLE", "UNKNOWN"];
const SEV_COLOR = {
  CRITICAL: "var(--critical)", HIGH: "var(--high)",
  MEDIUM: "var(--medium)", LOW: "var(--low)",
  NEGLIGIBLE: "var(--negligible)", UNKNOWN: "var(--negligible)",
};

function Delta({ vuln, hard }) {
  const diff = hard - vuln;
  if (diff === 0) return <span className={styles.neutral}>—</span>;
  const pct = vuln > 0 ? Math.round((Math.abs(diff) / vuln) * 100) : 0;
  return diff < 0
    ? <span className={styles.good}>▼ {Math.abs(diff)}<em>{pct}%↓</em></span>
    : <span className={styles.bad}>▲ {diff}</span>;
}

export default function ComparisonTable({ images }) {
  const [scanner, setScanner] = useState("trivy");
  const [filter, setFilter] = useState("ALL");

  const sevs = filter === "ALL" ? ALL_SEVS : [filter];
  const vuln = images.vulnerable[scanner];
  const hard = images.hardened[scanner];

  return (
    <section>
      <div className={styles.titleRow}>
        <p className="section-title" style={{ marginBottom: 0 }}>Vulnerable vs Hardened 상세 비교</p>
        <div className={styles.controls}>
          {/* 스캐너 토글 */}
          <div className={styles.tabs}>
            {["trivy", "grype"].map((s) => (
              <button
                key={s}
                className={`${styles.tab} ${scanner === s ? styles.tabActive : ""}`}
                data-scanner={s}
                onClick={() => setScanner(s)}
              >
                {s === "trivy" ? "Trivy" : "Grype"}
              </button>
            ))}
          </div>
          {/* 심각도 필터 */}
          <div className={styles.tabs}>
            {["ALL", ...ALL_SEVS.slice(0, 4)].map((sv) => (
              <button
                key={sv}
                className={`${styles.tab} ${filter === sv ? styles.tabActive : ""}`}
                style={filter === sv && sv !== "ALL" ? { color: SEV_COLOR[sv] } : {}}
                onClick={() => setFilter(sv)}
              >
                {sv === "ALL" ? "전체" : sv.charAt(0) + sv.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>심각도</th>
              <th className={styles.right}>Vulnerable</th>
              <th className={styles.right}>Hardened</th>
              <th className={styles.right}>변화</th>
            </tr>
          </thead>
          <tbody>
            {sevs.map((sev) => (
              <tr key={sev} className={styles.row}>
                <td>
                  <span className={styles.sevBadge} style={{ "--c": SEV_COLOR[sev] }}>
                    {sev}
                  </span>
                </td>
                <td className={styles.right}>
                  <span className={styles.num}>{vuln[sev] ?? 0}</span>
                </td>
                <td className={styles.right}>
                  <span className={styles.num}>{hard[sev] ?? 0}</span>
                </td>
                <td className={styles.right}>
                  <Delta vuln={vuln[sev] ?? 0} hard={hard[sev] ?? 0} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
