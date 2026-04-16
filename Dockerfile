FROM node:18-alpine

# Çalışma dizini
WORKDIR /app

# Paketleri kopyala ve kur
COPY package*.json ./
RUN npm ci --only=production

# Tüm dosyaları kopyala
COPY . .

# HTTP sunucusunu kur
RUN npm install -g http-server

# Port aç
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080 || exit 1

# Sunucuyu başlat
CMD ["http-server", "-p", "8080", "-c-1"]
