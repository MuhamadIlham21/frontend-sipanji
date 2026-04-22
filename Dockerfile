# =========================
# Stage 1: Build Vue App
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# build untuk production
RUN npm run build


# =========================
# Stage 2: Nginx serve
# =========================
FROM nginx:alpine

# hapus default config
RUN rm /etc/nginx/conf.d/default.conf

# copy config custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy hasil build Vue
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8084

CMD ["nginx", "-g", "daemon off;"]