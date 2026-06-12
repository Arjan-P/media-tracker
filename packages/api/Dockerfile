# ---------- Build Stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY tsconfig.json .

COPY packages/shared/package.json packages/shared/
COPY packages/api/package.json packages/api/

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate
RUN pnpm install --frozen-lockfile

COPY packages/shared packages/shared
COPY packages/api packages/api

RUN pnpm --filter @media-tracker/shared build
RUN pnpm --filter @media-tracker/api build

# ---------- Runtime Stage ----------
FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json .
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY tsconfig.json .

COPY packages/shared/package.json packages/shared/
COPY packages/api/package.json packages/api/

RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/packages/shared/dist packages/shared/dist
COPY --from=builder /app/packages/api/dist packages/api/dist

EXPOSE 5000

CMD ["node", "packages/api/dist/start.js"]
