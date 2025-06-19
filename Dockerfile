# Usa uma imagem base oficial do Node.js
FROM node:24-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código da aplicação para o diretório de trabalho
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build 

# Expõe a porta em que a aplicação Node.js irá rodar
EXPOSE 3000

# Comando para iniciar a aplicação (roda o código compilado)
CMD ["node", "dist/index.js"]
