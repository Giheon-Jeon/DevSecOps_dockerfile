import { useState } from "react";
import styles from "./ScannerDiffTable.module.css";

const SEVS = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "NEGLIGIBLE"];
const SEV_COLOR = {
  CRITICAL: "var(--critical)", HIGH: "var(--high)",
  MEDIUM: "var(--medium)", LOW: "var(--low)", NEGLIGIBLE: "var(--negligible)",
};

export default function ScannerDiffTable({ images }) {
  const [active, setActive] = useState("vulnerable");

  const img = images[active];

  return (
    <section>
      <div className={styles.titleRow}>
        <p className="section-title" style={{ marginBottom: 0 }}>Trivy vs Grype 스캐너 비교</p>
        <div className={styles.tabs}>
          {["vulnerable", "hardened"].map((k) => (
            <button
              key={k}
              className={`${styles.tab} ${active === k ? styles.tabActive : ""}`}
              onClick={() => setActive(k)}
            >
              {k === "vulnerable" ? "💀 Vulnerable" : "🛡 Hardened"}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.desc}>
        두 스캐너는 CVE DB 소스와 매칭 알고리즘이 달라 동일 이미지에서도 결과가 다를 수 있습니다.
        차이가 클수록 한 쪽 스캐너가 놓치는 취약점이 있을 가능성이 높습니다.
      </p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>심각도</th>
              <th className={styles.right} style={{ color: "var(--trivy)" }}>Trivy</th>
              <th className={styles.right} style={{ color: "var(--grype)" }}>Grype</th>
              <th className={styles.right}>차이</th>
              <th>시각화</th>
            </tr>
          </thead>
          <tbody>
            {SEVS.map((sev) => {
              const t = img.trivy[sev] ?? 0;
              const g = img.grype[sev] ?? 0;
              const diff = t - g;
              const max = Math.max(t, g, 1);

              return (
                <tr key={sev} className={styles.row}>
                  <td>
                    <span className={styles.sevBadge} style={{ "--c": SEV_COLOR[sev] }}>
                      {sev}
                    </span>
                  </td>
                  <td className={styles.right}>
                    <span className={styles.num} style={{ color: "var(--trivy)" }}>{t}</span>
                  </td>
                  <td className={styles.right}>
                    <span className={styles.num} style={{ color: "var(--grype)" }}>{g}</span>
                  </td>
                  <td className={styles.right}>
                    {diff === 0
                      ? <span className={styles.neutral}>—</span>
                      : diff > 0
                        ? <span className={styles.pos}>Trivy +{diff}</span>
                        : <span className={styles.neg}>Grype +{Math.abs(diff)}</span>
                    }
                  </td>
                  <td>
                    <div className={styles.miniChart}>
                      <div className={styles.barT} style={{ width: `${(t / max) * 100}%` }} title={`Trivy: ${t}`} />
                      <div className={styles.barG} style={{ width: `${(g / max) * 100}%` }} title={`Grype: ${g}`} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
