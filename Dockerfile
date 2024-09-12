# Baseado em uma imagem leve de Node.js
FROM node:18 AS builder

# Diretório de trabalho no container
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./

# Instalar dependências
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Rodar o build da aplicação para produção
RUN npm run build

FROM node:18

# Copiar os arquivos buildados da etapa anterior
COPY --from=builder /app/dist ./dist

EXPOSE 8080

# Iniciar o servidor NGINX
CMD ["npm", "run", "serve"]
