# Step 1: Build both projects: Angular and Astro
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/wiki/package.json ./packages/wiki/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build:all


# Step 2: Wiki server
FROM node:22-alpine AS wiki
WORKDIR /app
RUN corepack enable
COPY --from=builder /app ./
EXPOSE 4321
CMD ["pnpm", "start:wiki"]

# Step 3: Nginx server
FROM nginx:alpine AS nginx-server
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
