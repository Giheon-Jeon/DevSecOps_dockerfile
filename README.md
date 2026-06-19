# Container Security Lab

## 취약한 Docker 이미지를 스캔하고, CIS Benchmark로 보안을 강화하는 DevSecOps 실습 프로젝트

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Trivy](https://img.shields.io/badge/Trivy-1904DA?style=for-the-badge&logo=aquasecurity&logoColor=white)
![Grype](https://img.shields.io/badge/Grype-6236FF?style=for-the-badge&logo=anchore&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)

---

## 프로젝트 소개

이 프로젝트는 **컨테이너 이미지 보안 강화**를 직접 체험하며 배우기 위한 DevSecOps 실습 레포입니다.

- `vulnerable/` — EOL 이미지, root 실행, 오래된 패키지 등 **의도적 취약점**이 포함된 Dockerfile
- `hardened/` — CIS Docker Benchmark 주요 항목을 적용한 **보안 강화** Dockerfile
- GitHub Actions CI가 push/PR 마다 **Trivy로 자동 스캔**하고, 결과를 GitHub Security 탭에 업로드합니다.

```
container-security-lab/
├── vulnerable/Dockerfile        # 의도적 취약 이미지
├── hardened/Dockerfile          # CIS Benchmark 적용 강화 이미지
├── app/app.py                   # 스캔 대상 Flask 앱
├── app/requirements-vulnerable.txt
├── app/requirements-hardened.txt
├── .github/workflows/security-scan.yml   # Trivy 자동 스캔 워크플로
├── reports/                     # 스캔 결과 SARIF 저장 폴더
└── README.md
```

---

## 로컬 실행 방법

### 1. Trivy 설치

```bash
# macOS
brew install trivy

# Linux (Debian/Ubuntu)
sudo apt-get install wget apt-transport-https gnupg lsb-release
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/trivy.list
sudo apt-get update && sudo apt-get install trivy

# Windows (Scoop)
scoop install trivy
```

### 2. 이미지 빌드

```bash
# 취약 이미지
docker build -f vulnerable/Dockerfile -t lab-vulnerable:latest .

# 강화 이미지
docker build -f hardened/Dockerfile -t lab-hardened:latest .
```

### 3. Trivy 스캔

```bash
# 취약 이미지 스캔 (테이블 출력)
trivy image lab-vulnerable:latest

# 강화 이미지 스캔 (CRITICAL/HIGH만 표시, CI 실패 기준)
trivy image --severity CRITICAL,HIGH --exit-code 1 lab-hardened:latest

# SARIF 형식으로 저장
trivy image --format sarif --output reports/trivy-vulnerable.sarif lab-vulnerable:latest
trivy image --format sarif --output reports/trivy-hardened.sarif  lab-hardened:latest

# JSON 형식으로 저장 (비교 스크립트 입력용)
trivy image --format json --output reports/trivy-vulnerable.json lab-vulnerable:latest
trivy image --format json --output reports/trivy-hardened.json   lab-hardened:latest
```

### 4. Grype 설치 및 스캔

```bash
# macOS / Linux 설치
curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | sh -s -- -b /usr/local/bin

# Windows (Scoop)
scoop install grype

# 취약 이미지 스캔
grype lab-vulnerable:latest

# 강화 이미지 스캔 (CRITICAL 발견 시 exit 1)
grype lab-hardened:latest --fail-on critical

# JSON 형식으로 저장 (비교 스크립트 입력용)
grype lab-vulnerable:latest -o json > reports/grype-vulnerable.json
grype lab-hardened:latest   -o json > reports/grype-hardened.json
```

### 5. 두 스캐너 결과 비교 (로컬)

```bash
python3 scripts/compare_results.py
```

### 6. 앱 실행 확인

```bash
docker run -p 5000:5000 lab-hardened:latest
curl http://localhost:5000/health
```

---

## Before / After 비교

### 이미지 특성

| 항목 | Vulnerable | Hardened |
|---|---|---|
| 베이스 이미지 | ubuntu:18.04 (EOL) | python:3.12-slim |
| 실행 사용자 | root | appuser (UID 1001) |
| Flask 버전 | 0.12.0 | 3.1.1 |
| 파일 권한 | chmod 777 | 기본값 (644/755) |
| 불필요한 패키지 | curl, wget, vim, telnet, gcc 등 | 없음 |
| HEALTHCHECK | 없음 | 있음 |
| 이미지 크기 | ~450 MB (placeholder) | ~130 MB (placeholder) |

### Trivy 스캔 결과

| 심각도 | Vulnerable | Hardened |
|---|---|---|
| CRITICAL | ~45개 (placeholder) | 0개 (placeholder) |
| HIGH | ~120개 (placeholder) | ~3개 (placeholder) |
| MEDIUM | ~200개 (placeholder) | ~10개 (placeholder) |

### Grype 스캔 결과

| 심각도 | Vulnerable | Hardened |
|---|---|---|
| CRITICAL | ~개 (placeholder) | 0개 (placeholder) |
| HIGH | ~개 (placeholder) | ~개 (placeholder) |
| MEDIUM | ~개 (placeholder) | ~개 (placeholder) |

### 스캐너 간 비교 포인트

| 항목 | Trivy | Grype |
|---|---|---|
| DB 소스 | NVD, GitHub Advisory, OS vendor | NVD, GitHub Advisory, RHSA 등 |
| 검출 방식 | 레이어별 패키지 분석 | SBOM 기반 매칭 |
| SARIF 지원 | O | O |
| 속도 | 빠름 | 보통 |

> 실제 스캔 후 placeholder 값을 교체하세요.

---

## 적용한 CIS Docker Benchmark 항목

| CIS 항목 | 설명 | 적용 위치 |
|---|---|---|
| CIS 4.1 | non-root 사용자 사용 | `USER appuser` |
| CIS 4.2 | 신뢰할 수 있는 베이스 이미지 사용 | `python:3.12-slim` |
| CIS 4.6 | 컨테이너에 불필요한 패키지 추가 금지 | 최소 패키지만 설치 |
| CIS 4.7 | 컨테이너에 SSH 설치 금지 | SSH 관련 패키지 없음 |
| CIS 4.9 | COPY 사용 (ADD 대신) + 소유권 지정 | `COPY --chown=appuser:appgroup` |
| CIS 5.1 | 최소 권한 원칙 적용 | root 미사용, 파일 권한 최소화 |
| CIS 5.25 | HEALTHCHECK 설정 | `HEALTHCHECK` 지시어 추가 |

---

## 사용 기술 스택

| 분류 | 기술 |
|---|---|
| 컨테이너 | Docker |
| 앱 프레임워크 | Python / Flask |
| 취약점 스캐너 | Trivy (Aqua Security), Grype (Anchore) |
| CI/CD | GitHub Actions |
| 보안 기준 | CIS Docker Benchmark v1.6 |
| 결과 포맷 | SARIF (GitHub Security tab 연동) |
