# 의도적으로 취약점을 포함한 Dockerfile (학습용)
# 절대 프로덕션에 사용하지 마세요.

# [취약점 1] EOL(End-of-Life) 베이스 이미지 — 보안 패치 미지원
FROM ubuntu:18.04

# [취약점 2] 불필요한 패키지 다수 설치 — 공격 표면 확대
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    wget \
    net-tools \
    vim \
    telnet \
    gcc \
    && apt-get clean

WORKDIR /app

COPY app/requirements-vulnerable.txt requirements.txt

# [취약점 3] 오래된 버전의 패키지 (flask==0.12.0) — 알려진 CVE 다수 존재
RUN pip3 install -r requirements.txt

COPY app/ .

# [취약점 4] 과도한 파일 권한 — 모든 사용자 읽기/쓰기/실행 허용
RUN chmod 777 /app -R

# [취약점 5] root 사용자로 실행 — 컨테이너 탈출 시 호스트 권한 획득 위험
# USER 지시어 없음 → 기본값 root

EXPOSE 5000

CMD ["python3", "app.py"]
