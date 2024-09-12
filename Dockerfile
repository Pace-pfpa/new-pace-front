# Baseado em uma imagem leve de Node.js
FROM node:18-alpine

# Diretório de trabalho no container
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY vite.config.ts .

# Instalar dependências
RUN npm install

RUN npm i -g serve

# Copiar o restante dos arquivos do projeto
COPY . .

# Rodar o build da aplicação para produção
RUN npm run build

EXPOSE 3000

# Iniciar o servidor NGINX
CMD ["serve", "-s", "dist"]
