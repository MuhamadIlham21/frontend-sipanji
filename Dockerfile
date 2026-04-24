# ======================
# BUILD STAGE
# ======================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# ======================
# SERVE STAGE
# ======================
FROM nginx:alpine

# hapus default config
RUN rm /etc/nginx/conf.d/default.conf

# copy config custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# copy build result
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]