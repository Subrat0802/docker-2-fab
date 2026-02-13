# Docker + Prisma Setup - Step by Step

## Step 1: Create Dockerfile

```dockerfile
FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lockb* ./
COPY prisma ./prisma

RUN bun install
RUN bunx prisma generate

COPY . .

EXPOSE 3000

CMD ["bun", "run", "index.ts"]
```

## Step 2: Create Docker Network

```bash
docker network create docker-2-network
```

## Step 3: Run PostgreSQL Container

```bash
docker run -d \
  --name docker-2-postgres \
  --network docker-2-network \
  -e POSTGRES_PASSWORD=mysecret \
  -e POSTGRES_DB=todoapp \
  -p 5432:5432 \
  postgres
```

**Wait for PostgreSQL to start:**
```bash
sleep 5
docker ps
```

## Step 4: Build Backend Image

```bash
docker build -t docker-2-backend .
```

## Step 5: Run Backend Container

```bash
docker run -d \
  --network docker-2-network \
  --name docker-2-backend \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://postgres:mysecret@docker-2-postgres:5432/todoapp?schema=public" \
  -e JWT_SECRET="your-secret-key-here" \
  docker-2-backend
```

## Step 6: Run Prisma Migrations

```bash
docker exec -it docker-2-backend bunx prisma db push
```

## Step 7: Check If Everything is Running

```bash
# Check running containers
docker ps

# Check backend logs
docker logs docker-2-backend
```

---

## Key Points

- Use **container name** in DATABASE_URL: `@docker-2-postgres:5432` (NOT `@localhost:5432`)
- **Always run migrations** after starting containers
- Wait for PostgreSQL to be ready before starting backend

---

## Useful Commands

```bash
# View logs
docker logs <container-name>

# Stop container
docker stop <container-name>

# Remove container
docker rm <container-name>

# Remove and restart
docker rm -f <container-name>
docker run ...
```

---

## Your App is Ready! 🎉

Access at: `http://localhost:3000`