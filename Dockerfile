# Imagen oficial de Node.js (ligera)
FROM node:20-alpine

# Crear directorio de la app
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --production

# Copiar el resto del código
COPY . .

# Comando para ejecutar el bot
CMD ["node", "--max-old-space-size=128", "index.js"]