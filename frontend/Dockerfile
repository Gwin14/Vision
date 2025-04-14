# frontend/Dockerfile
FROM node:18

WORKDIR /app

# Copia apenas package.json e package-lock.json para instalar dependências primeiro
COPY package*.json ./

RUN npm install

# Copia o restante dos arquivos (será sobrescrito pelo volume no compose)
COPY . .

EXPOSE 3000

# Comando de desenvolvimento com hot-reload
CMD ["npm", "run", "dev"]
