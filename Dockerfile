# 1. Imagen base oficial de Node.js en su versión ligera (alpine)
FROM node:20-alpine

# 2. Definir el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3. Copiar solo los manifiestos de dependencias
# (Aprovecha la caché de capas de Docker para no reinstalar dependencias si el código cambia)
COPY package*.json ./

# 4. Instalar únicamente las dependencias de producción de forma limpia
RUN npm ci --only=production

# 5. Copiar el resto del código fuente del proyecto
COPY . .

# 6. Crear directorio para uploads y dar permisos al usuario de node
RUN mkdir -p uploads && chown -R node:node /usr/src/app

# 7. Usar un usuario sin privilegios por seguridad (buena práctica)
USER node

# 8. Exponer el puerto donde escucha la API (usualmente el 8080 según tu env.config)
EXPOSE 8080

# 9. Comando para arrancar la aplicación
CMD ["npm", "start"]