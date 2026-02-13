FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lockb* ./
COPY prisma ./prisma

RUN bun install
RUN bunx prisma generate

COPY . .

EXPOSE 3000

CMD ["bun", "run", "dev"]