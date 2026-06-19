"""
Trivy / Grype JSON 결과 파일을 읽어 심각도별 CVE 수를 비교 출력합니다.
사용법: python3 scripts/compare_results.py
"""

import json
import os

REPORTS_DIR = os.path.join(os.path.dirname(__file__), "..", "reports")
SEVERITIES = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "NEGLIGIBLE", "UNKNOWN"]

FILES = {
    "Trivy  / Vulnerable": "trivy-vulnerable.json",
    "Grype  / Vulnerable": "grype-vulnerable.json",
    "Trivy  / Hardened  ": "trivy-hardened.json",
    "Grype  / Hardened  ": "grype-hardened.json",
}


def count_by_severity(path: str) -> dict:
    if not os.path.exists(path):
        return {}

    with open(path, encoding="utf-8") as f:
        data = json.load(f)

    counts: dict = {}

    # Trivy JSON 형식
    for result in data.get("Results", []):
        for vuln in result.get("Vulnerabilities", []) or []:
            sev = vuln.get("Severity", "UNKNOWN").upper()
            counts[sev] = counts.get(sev, 0) + 1

    # Grype JSON 형식
    for match in data.get("matches", []):
        sev = match.get("vulnerability", {}).get("severity", "UNKNOWN").upper()
        counts[sev] = counts.get(sev, 0) + 1

    return counts


def main() -> None:
    col_w = 11
    label_w = 26

    header = f"{'Scanner / Image':<{label_w}} | " + " | ".join(
        f"{s:>{col_w}}" for s in SEVERITIES
    )
    sep = "-" * len(header)

    print(sep)
    print(header)
    print(sep)

    for label, filename in FILES.items():
        path = os.path.join(REPORTS_DIR, filename)
        counts = count_by_severity(path)
        missing = not os.path.exists(path)
        row = f"{label} | " + " | ".join(
            f"{'N/A':>{col_w}}" if missing else f"{counts.get(s, 0):>{col_w}}"
            for s in SEVERITIES
        )
        print(row)

    print(sep)
    print("\n* N/A = 해당 JSON 파일이 reports/ 에 없습니다. 먼저 스캔을 실행하세요.")


if __name__ == "__main__":
    main()
