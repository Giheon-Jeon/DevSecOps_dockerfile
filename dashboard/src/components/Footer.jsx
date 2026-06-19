import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.copy}>Container Security Lab — DevSecOps 학습 프로젝트</span>
        <div className={styles.links}>
          <a href="https://github.com/Giheon-Jeon/DevSecOps_dockerfile" target="_blank" rel="noreferrer">GitHub</a>
          <span className={styles.sep}>·</span>
          <a href="https://aquasecurity.github.io/trivy/" target="_blank" rel="noreferrer">Trivy Docs</a>
          <span className={styles.sep}>·</span>
          <a href="https://github.com/anchore/grype" target="_blank" rel="noreferrer">Grype Docs</a>
          <span className={styles.sep}>·</span>
          <a href="https://www.cisecurity.org/benchmark/docker" target="_blank" rel="noreferrer">CIS Benchmark</a>
        </div>
      </div>
    </footer>
  );
}
