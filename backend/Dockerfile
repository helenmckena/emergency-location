FROM alpine:3.24 AS tini
RUN apk add --no-cache tini

FROM python:3.13-alpine AS builder
WORKDIR /backend
COPY --from=docker.io/astral/uv:latest /uv /uvx /bin/
COPY pyproject.toml uv.lock ./
RUN uv sync --locked --no-dev --no-install-project

FROM python:3.13-alpine AS runner
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1

WORKDIR /backend
COPY --from=tini /sbin/tini /sbin/tini
COPY --from=builder /backend/.venv ./.venv
COPY . ./

COPY . ./
EXPOSE 8080
ENTRYPOINT ["/sbin/tini", "--", "./entrypoint.sh"]