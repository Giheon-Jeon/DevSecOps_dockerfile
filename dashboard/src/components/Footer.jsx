import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>Container Security Lab — DevSecOps 학습 프로젝트</span>
        <span>
          <a href="https://github.com/Giheon-Jeon/DevSecOps_dockerfile" target="_blank" rel="noreferrer">
            GitHub
          </a>
          {" · "}
          <a href="https://aquasecurity.github.io/trivy/" target="_blank" rel="noreferrer">Trivy</a>
          {" · "}
          <a href="https://github.com/anchore/grype" target="_blank" rel="noreferrer">Grype</a>
        </span>
      </div>
    </footer>
  );
}
