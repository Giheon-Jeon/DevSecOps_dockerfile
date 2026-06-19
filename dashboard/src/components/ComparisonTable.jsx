import styles from "./ComparisonTable.module.css";

const SEVS = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "NEGLIGIBLE", "UNKNOWN"];

function Delta({ vuln, hard }) {
  const diff = hard - vuln;
  if (diff === 0) return <span className={styles.neutral}>-</span>;
  const pct = vuln > 0 ? Math.round((Math.abs(diff) / vuln) * 100) : 0;
  return diff < 0
    ? <span className={styles.good}>▼ {Math.abs(diff)} ({pct}%↓)</span>
    : <span className={styles.bad}>▲ {diff}</span>;
}

function Row({ scanner, images }) {
  const vuln = images.vulnerable[scanner];
  const hard = images.hardened[scanner];
  return SEVS.map((sev) => (
    <tr key={`${scanner}-${sev}`}>
      <td><span className={styles.scannerBadge} data-scanner={scanner}>{scanner}</span></td>
      <td><span className={styles.sevBadge} data-sev={sev.toLowerCase()}>{sev}</span></td>
      <td className={styles.num}>{vuln[sev] ?? 0}</td>
      <td className={styles.num}>{hard[sev] ?? 0}</td>
      <td><Delta vuln={vuln[sev] ?? 0} hard={hard[sev] ?? 0} /></td>
    </tr>
  ));
}

export default function ComparisonTable({ images }) {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Vulnerable vs Hardened 상세 비교</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>스캐너</th>
              <th>심각도</th>
              <th>Vulnerable</th>
              <th>Hardened</th>
              <th>변화</th>
            </tr>
          </thead>
          <tbody>
            <Row scanner="trivy" images={images} />
            <Row scanner="grype" images={images} />
          </tbody>
        </table>
      </div>
    </section>
  );
}
