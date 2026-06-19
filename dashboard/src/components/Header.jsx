import styles from "./Header.module.css";

export default function Header({ generatedAt, isPlaceholder }) {
  const date = generatedAt
    ? new Date(generatedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
    : "-";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.title}>
          <span className={styles.icon}>🛡️</span>
          <div>
            <h1>Container Security Dashboard</h1>
            <p className={styles.sub}>Trivy &amp; Grype 스캔 결과 비교</p>
          </div>
        </div>
        <div className={styles.meta}>
          {isPlaceholder && (
            <span className={styles.badge}>PLACEHOLDER DATA</span>
          )}
          <span className={styles.time}>마지막 스캔: {date}</span>
        </div>
      </div>
    </header>
  );
}
