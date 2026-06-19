import styles from "./ScannerDiffTable.module.css";

const SEVS = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "NEGLIGIBLE"];

export default function ScannerDiffTable({ images }) {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Trivy vs Grype 스캐너 비교</h2>
      <p className={styles.desc}>
        같은 이미지에 대해 두 스캐너가 보고한 CVE 수의 차이입니다.
        스캐너마다 DB 소스와 매칭 방식이 달라 결과가 다를 수 있습니다.
      </p>
      {["vulnerable", "hardened"].map((img) => (
        <div key={img} className={styles.block}>
          <h3 className={styles.imgLabel}>{img === "vulnerable" ? "Vulnerable" : "Hardened"} 이미지</h3>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>심각도</th>
                  <th>Trivy</th>
                  <th>Grype</th>
                  <th>차이 (Trivy − Grype)</th>
                </tr>
              </thead>
              <tbody>
                {SEVS.map((sev) => {
                  const t = images[img].trivy[sev] ?? 0;
                  const g = images[img].grype[sev] ?? 0;
                  const diff = t - g;
                  return (
                    <tr key={sev}>
                      <td>
                        <span className={styles.sevBadge} data-sev={sev.toLowerCase()}>{sev}</span>
                      </td>
                      <td className={styles.num}>{t}</td>
                      <td className={styles.num}>{g}</td>
                      <td className={styles.num}>
                        {diff === 0
                          ? <span className={styles.neutral}>0</span>
                          : diff > 0
                            ? <span className={styles.pos}>+{diff}</span>
                            : <span className={styles.neg}>{diff}</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </section>
  );
}
