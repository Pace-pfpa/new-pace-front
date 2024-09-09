# Baseado em uma imagem leve de Node.js
FROM node:18-alpine AS build

# Diretório de trabalho no container
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Rodar o build da aplicação para produção
RUN npm run build

# ---- Segunda etapa: Servindo arquivos estáticos ----
FROM nginx:alpine

# Copiar os arquivos buildados da etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do NGINX (se necessário)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expor a porta para o NGINX servir a aplicação
EXPOSE 80

# Iniciar o servidor NGINX
CMD ["nginx", "-g", "daemon off;"]
