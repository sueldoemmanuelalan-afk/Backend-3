# ShipNow Backend API 🚚

API RESTful para la gestión de entregas y logística de ShipNow, desarrollada con Node.js, Express y MongoDB.

---

## 🚀 Requisitos Previos

- **Node.js**: v18 o superior
- **Docker** y **Docker Compose**
- **MongoDB**: Instancia local o URI de MongoDB Atlas

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basado en la plantilla `.env.example`:

```bash
cp .env.example .env
```
Ejemplo de configuración:

```
PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shipnow
LOG_LEVEL=info
```

🛠️ Instalación y Ejecución Local
Opción 1: Desarrollo local sin Docker
Instalar dependencias:
```
npm install
```
Iniciar en modo desarrollo:
```
npm run dev
```
Iniciar en modo producción:
```
npm start
```
Opción 2: Despliegue con Docker 🐳
Construir la imagen de Docker:
```
docker build -t shipnow-api .
```
Ejecutar el contenedor:
```
docker run -d -p 8080:8080 --env-file .env --name shipnow-container shipnow-api
```

🩺 Monitoreo y Health Check
La API incluye un endpoint para monitorear el estado del servicio:

GET /api/health

Respuesta de ejemplo (200 OK):
{
  "status": "OK",
  "environment": "development",
  "uptime": "120s",
  "timestamp": "2026-08-27T15:19:00.000Z"
}

⚡ Performance y Paginación
Paginación: Los endpoints de lectura masiva (como GET /api/orders) implementan paginación mediante page y limit en la URL (?page=1&limit=10).

Gestión de Archivos: La subida de comprobantes y documentos está limitada a un máximo de 5 MB y restringida a formatos seguros (.jpg, .png, .webp, .pdf).