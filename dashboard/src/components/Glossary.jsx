import { useState } from "react";
import styles from "./Glossary.module.css";

const TERMS = [
  {
    term: "CVE",
    full: "Common Vulnerabilities and Exposures",
    tag: "기본 개념",
    color: "var(--accent)",
    desc: "소프트웨어 취약점에 부여되는 고유 식별자입니다. 예: CVE-2021-44228 (Log4Shell). NVD(미국 국가취약점 데이터베이스)에서 관리하며, 스캐너들은 이 목록을 기반으로 이미지의 패키지를 매칭합니다.",
  },
  {
    term: "CRITICAL",
    full: "CVSS Score 9.0 ~ 10.0",
    tag: "심각도",
    color: "var(--critical)",
    desc: "즉시 악용 가능한 수준의 취약점입니다. 원격 코드 실행(RCE)이나 인증 우회가 가능한 경우가 많습니다. 발견 즉시 패치하거나 해당 이미지 사용을 중단해야 합니다.",
  },
  {
    term: "HIGH",
    full: "CVSS Score 7.0 ~ 8.9",
    tag: "심각도",
    color: "var(--high)",
    desc: "심각한 영향을 줄 수 있는 취약점입니다. 특정 조건이 충족될 때 악용 가능하며, 다음 배포 사이클 내에 반드시 수정해야 합니다.",
  },
  {
    term: "MEDIUM",
    full: "CVSS Score 4.0 ~ 6.9",
    tag: "심각도",
    color: "var(--medium)",
    desc: "악용 가능성이 있으나 CRITICAL/HIGH보다 낮은 수준입니다. 우선순위를 정해 계획적으로 패치 작업을 진행합니다.",
  },
  {
    term: "LOW / NEGLIGIBLE",
    full: "CVSS Score 0.1 ~ 3.9",
    tag: "심각도",
    color: "var(--low)",
    desc: "실질적인 악용이 매우 어렵거나 영향이 미미한 취약점입니다. 가능하면 수정하되 우선순위는 낮게 두어도 됩니다.",
  },
  {
    term: "Trivy",
    full: "Aqua Security Trivy",
    tag: "스캐너",
    color: "var(--trivy)",
    desc: "Aqua Security가 개발한 오픈소스 취약점 스캐너입니다. OS 패키지, 언어별 라이브러리, IaC 파일까지 스캔합니다. NVD, GitHub Advisory, OS 벤더 공식 DB를 복합적으로 사용하며 SARIF 출력을 지원합니다.",
  },
  {
    term: "Grype",
    full: "Anchore Grype",
    tag: "스캐너",
    color: "var(--grype)",
    desc: "Anchore가 개발한 오픈소스 컨테이너 이미지 취약점 스캐너입니다. Syft로 생성한 SBOM을 기반으로 CVE를 매칭합니다. Trivy와 DB 소스가 다르므로 두 스캐너를 함께 쓰면 검출률을 높일 수 있습니다.",
  },
  {
    term: "SARIF",
    full: "Static Analysis Results Interchange Format",
    tag: "포맷",
    color: "var(--accent)",
    desc: "정적 분석 결과를 교환하기 위한 JSON 기반 표준 포맷입니다. GitHub Security 탭에 업로드하면 코드/이미지 취약점을 PR과 연동하여 시각화할 수 있습니다.",
  },
  {
    term: "CIS Benchmark",
    full: "Center for Internet Security Benchmark",
    tag: "기준",
    color: "#f59e0b",
    desc: "IT 시스템 보안 설정의 국제 표준입니다. 이 프로젝트에서는 CIS Docker Benchmark v1.6을 기준으로 non-root 실행, 최소 패키지, HEALTHCHECK 등을 hardened 이미지에 적용했습니다.",
  },
  {
    term: "SBOM",
    full: "Software Bill of Materials",
    tag: "개념",
    color: "var(--accent)",
    desc: "소프트웨어에 포함된 컴포넌트 목록입니다. 식품 영양성분표와 비슷합니다. Grype는 내부적으로 Syft를 사용해 SBOM을 생성하고, 이를 CVE DB와 매칭합니다.",
  },
  {
    term: "EOL 이미지",
    full: "End of Life Base Image",
    tag: "취약점 유형",
    color: "var(--critical)",
    desc: "더 이상 보안 패치를 받지 못하는 운영체제 버전을 사용한 이미지입니다. 이 프로젝트의 ubuntu:18.04가 대표적입니다. 새 CVE가 발견돼도 수정이 없으므로 취약점이 빠르게 누적됩니다.",
  },
  {
    term: "CVSS",
    full: "Common Vulnerability Scoring System",
    tag: "기본 개념",
    color: "var(--accent)",
    desc: "취약점 심각도를 0.0 ~ 10.0으로 수치화하는 표준 체계입니다. 공격 벡터(네트워크/로컬), 복잡도, 권한 필요 여부, 영향 범위를 종합해 산출합니다.",
  },
];

const TAGS = ["전체", ...Array.from(new Set(TERMS.map((t) => t.tag)))];

export default function Glossary() {
  const [open, setOpen] = useState(null);
  const [tag, setTag] = useState("전체");

  const filtered = tag === "전체" ? TERMS : TERMS.filter((t) => t.tag === tag);

  return (
    <section>
      <p className="section-title">용어 사전</p>

      <div className={styles.tagRow}>
        {TAGS.map((t) => (
          <button
            key={t}
            className={`${styles.tagBtn} ${tag === t ? styles.tagActive : ""}`}
            onClick={() => setTag(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((item) => {
          const isOpen = open === item.term;
          return (
            <div
              key={item.term}
              className={`${styles.card} ${isOpen ? styles.cardOpen : ""}`}
              style={{ "--c": item.color }}
              onClick={() => setOpen(isOpen ? null : item.term)}
            >
              <div className={styles.cardHead}>
                <div className={styles.left}>
                  <span className={styles.termTag} style={{ color: item.color, borderColor: `color-mix(in srgb, ${item.color} 35%, transparent)`, background: `color-mix(in srgb, ${item.color} 10%, transparent)` }}>
                    {item.tag}
                  </span>
                  <span className={styles.term}>{item.term}</span>
                </div>
                <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>›</span>
              </div>
              <p className={styles.full}>{item.full}</p>
              {isOpen && <p className={styles.desc}>{item.desc}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
