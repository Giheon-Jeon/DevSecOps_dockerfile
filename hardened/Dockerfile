# CIS Docker Benchmark 적용 강화 Dockerfile
# 주요 적용 항목: CIS 4.1, 4.2, 4.6, 4.9, 5.1

# [CIS 4.2] 최신 slim 베이스 이미지 사용 — 불필요한 바이너리 제거
FROM python:3.12-slim

# [CIS 4.1] root가 아닌 전용 사용자 생성
RUN groupadd --gid 1001 appgroup && \
    useradd --uid 1001 --gid appgroup --no-create-home --shell /bin/false appuser

WORKDIR /app

# [CIS 4.6] 최소한의 패키지만 설치, 캐시 즉시 삭제
COPY app/requirements-hardened.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# [CIS 4.9] COPY --chown으로 파일 소유권을 비root 사용자로 설정
COPY --chown=appuser:appgroup app/app.py .

# [CIS 4.1] non-root 사용자로 전환
USER appuser

EXPOSE 5000

# [CIS 4.6] HEALTHCHECK — 컨테이너 상태 모니터링
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:5000/health')" || exit 1

CMD ["python3", "app.py"]
