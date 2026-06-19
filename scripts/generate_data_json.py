"""
Trivy / Grype JSON 스캔 결과를 읽어 dashboard/public/data.json 을 생성합니다.
CI에서 compare-results 잡 이후에 실행됩니다.
"""

import json
import os
from datetime import datetime, timezone

REPORTS_DIR = os.path.join(os.path.dirname(__file__), "..", "reports")
OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "dashboard", "public", "data.json")

SEVS = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "NEGLIGIBLE", "UNKNOWN"]


def parse_trivy(path: str) -> dict:
    counts = {s: 0 for s in SEVS}
    if not os.path.exists(path):
        return counts
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    for result in data.get("Results", []):
        for vuln in result.get("Vulnerabilities", []) or []:
            sev = vuln.get("Severity", "UNKNOWN").upper()
            if sev in counts:
                counts[sev] += 1
    return counts


def parse_grype(path: str) -> dict:
    counts = {s: 0 for s in SEVS}
    if not os.path.exists(path):
        return counts
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    for match in data.get("matches", []):
        sev = match.get("vulnerability", {}).get("severity", "UNKNOWN").upper()
        if sev in counts:
            counts[sev] += 1
    return counts


def main():
    output = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "placeholder": False,
        "images": {
            "vulnerable": {
                "baseImage": "ubuntu:18.04",
                "runAsRoot": True,
                "trivy": parse_trivy(os.path.join(REPORTS_DIR, "trivy-vulnerable.json")),
                "grype":  parse_grype(os.path.join(REPORTS_DIR, "grype-vulnerable.json")),
            },
            "hardened": {
                "baseImage": "python:3.12-slim",
                "runAsRoot": False,
                "trivy": parse_trivy(os.path.join(REPORTS_DIR, "trivy-hardened.json")),
                "grype":  parse_grype(os.path.join(REPORTS_DIR, "grype-hardened.json")),
            },
        },
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"data.json 생성 완료: {OUT_PATH}")


if __name__ == "__main__":
    main()
