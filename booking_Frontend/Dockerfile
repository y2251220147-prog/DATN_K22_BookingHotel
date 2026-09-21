FROM node:24-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_URL_API
ARG NEXT_PUBLIC_PUSHER_KEY
ARG NEXT_PUBLIC_GGSHEETID
ARG NEXT_PUBLIC_API_GGSHEET

ENV NEXT_PUBLIC_URL_API=${NEXT_PUBLIC_URL_API}
ENV NEXT_PUBLIC_PUSHER_KEY=${NEXT_PUBLIC_PUSHER_KEY}
ENV NEXT_PUBLIC_GGSHEETID=${NEXT_PUBLIC_GGSHEETID}
ENV NEXT_PUBLIC_API_GGSHEET=${NEXT_PUBLIC_API_GGSHEET}

RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
