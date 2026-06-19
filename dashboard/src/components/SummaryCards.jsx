import styles from "./SummaryCards.module.css";

const SEVS = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

function totalCve(scanners) {
  const all = Object.values(scanners);
  return SEVS.reduce((sum, s) => {
    const avg = Math.round(all.reduce((a, sc) => a + (sc[s] ?? 0), 0) / all.length);
    return sum + avg;
  }, 0);
}

function Card({ label, image, highlight }) {
  const trivy = image.trivy;
  const grype = image.grype;
  const total = totalCve({ trivy, grype });

  return (
    <div className={`${styles.card} ${highlight ? styles.danger : styles.safe}`}>
      <div className={styles.cardHeader}>
        <span className={styles.label}>{label}</span>
        <span className={styles.base}>{image.baseImage}</span>
      </div>
      <div className={styles.totalRow}>
        <span className={styles.totalNum}>{total}</span>
        <span className={styles.totalLabel}>평균 총 CVE</span>
      </div>
      <div className={styles.pills}>
        {SEVS.map((s) => {
          const avg = Math.round(((trivy[s] ?? 0) + (grype[s] ?? 0)) / 2);
          return (
            <span key={s} className={styles.pill} data-sev={s.toLowerCase()}>
              <b>{avg}</b> {s}
            </span>
          );
        })}
      </div>
      <div className={styles.tags}>
        <span className={image.runAsRoot ? styles.tagBad : styles.tagGood}>
          {image.runAsRoot ? "root 실행" : "non-root 실행"}
        </span>
      </div>
    </div>
  );
}

export default function SummaryCards({ images }) {
  return (
    <section>
      <h2 className={styles.sectionTitle}>요약</h2>
      <div className={styles.grid}>
        <Card label="Vulnerable" image={images.vulnerable} highlight />
        <Card label="Hardened" image={images.hardened} highlight={false} />
      </div>
    </section>
  );
}
