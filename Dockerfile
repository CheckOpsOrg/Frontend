# Fase de Build
FROM node:20-alpine as build
WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json ./
RUN npm install

# Copia o código fonte e faz o build
COPY . .

# Expõe a variável do Railway no momento do Build para o Vite compilar junto com o HTML/JS
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Fase de Execução (Servidor Web NGINX)
FROM nginx:alpine
# Copia o build do Vite para a pasta de HTML do NGINX
COPY --from=build /app/dist /usr/share/nginx/html

# Copia a configuração do NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Usa a variável de ambiente PORT provida pelo Railway
CMD PORT=${PORT:-8080} && sed -i -e "s/\${PORT}/$PORT/g" /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
