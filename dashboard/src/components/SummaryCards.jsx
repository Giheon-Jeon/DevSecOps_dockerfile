import { useEffect, useRef, useState } from "react";
import styles from "./SummaryCards.module.css";

const SEVS = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const SEV_VAR = { CRITICAL: "--critical", HIGH: "--high", MEDIUM: "--medium", LOW: "--low" };

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setValue(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

function StatBar({ sev, vuln, hard }) {
  const max = Math.max(vuln, 1);
  const pct = Math.min((hard / max) * 100, 100);
  const color = `var(${SEV_VAR[sev]})`;
  return (
    <div className={styles.statBar}>
      <div className={styles.statLabel}>
        <span style={{ color }}>{sev}</span>
        <span className={styles.statNums}>
          <span style={{ color }}>{hard}</span>
          <span className={styles.statSlash}>/</span>
          <span className={styles.statVuln}>{vuln}</span>
        </span>
      </div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${pct}%`, background: color, opacity: hard === 0 ? 0.3 : 0.85 }}
        />
      </div>
    </div>
  );
}

function Card({ label, image, compare, accent, icon }) {
  const total = SEVS.reduce((s, sv) => s + ((image.trivy[sv] ?? 0) + (image.grype[sv] ?? 0)) / 2, 0);
  const animated = useCountUp(Math.round(total));

  return (
    <div className={styles.card} style={{ "--accent-color": accent }}>
      <div className={styles.cardTop}>
        <div className={styles.cardLabel}>
          <span className={styles.cardIcon}>{icon}</span>
          <span>{label}</span>
        </div>
        <code className={styles.baseImg}>{image.baseImage}</code>
      </div>

      <div className={styles.totalBlock}>
        <span className={styles.totalNum}>{animated}</span>
        <div className={styles.totalMeta}>
          <span className={styles.totalLabel}>평균 CVE</span>
          <span className={image.runAsRoot ? styles.tagBad : styles.tagGood}>
            {image.runAsRoot ? "⚠ root" : "✓ non-root"}
          </span>
        </div>
      </div>

      {compare && (
        <div className={styles.bars}>
          {SEVS.map((sv) => (
            <StatBar
              key={sv}
              sev={sv}
              hard={Math.round(((image.trivy[sv] ?? 0) + (image.grype[sv] ?? 0)) / 2)}
              vuln={Math.round(((compare.trivy[sv] ?? 0) + (compare.grype[sv] ?? 0)) / 2)}
            />
          ))}
        </div>
      )}

      {!compare && (
        <div className={styles.pills}>
          {SEVS.map((sv) => {
            const avg = Math.round(((image.trivy[sv] ?? 0) + (image.grype[sv] ?? 0)) / 2);
            return (
              <span key={sv} className={styles.pill} style={{ "--c": `var(${SEV_VAR[sv]})` }}>
                <b>{avg}</b> {sv}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SummaryCards({ images }) {
  return (
    <section>
      <p className="section-title">요약</p>
      <div className={styles.grid}>
        <Card label="Vulnerable" image={images.vulnerable} accent="var(--critical)" icon="💀" />
        <Card label="Hardened"   image={images.hardened}   compare={images.vulnerable} accent="var(--low)" icon="🛡" />
      </div>
    </section>
  );
}
