import styles from "./Header.module.css";

export default function Header({ generatedAt, isPlaceholder }) {
  const date = generatedAt
    ? new Date(generatedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })
    : "-";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.title}>
          <div className={styles.iconWrap}>
            <span className={styles.icon}>🛡️</span>
          </div>
          <div>
            <h1 className={styles.h1}>Container Security Dashboard</h1>
            <p className={styles.sub}>Trivy &amp; Grype 스캔 결과 비교 · CIS Docker Benchmark</p>
          </div>
        </div>
        <div className={styles.meta}>
          {isPlaceholder && (
            <span className={styles.badge}>
              <span className={styles.dot} />
              PLACEHOLDER
            </span>
          )}
          <div className={styles.timeBox}>
            <span className={styles.timeLabel}>마지막 스캔</span>
            <span className={styles.time}>{date}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
