# ShipNow API - Sistema de Gestión de Logística y Envíos

API RESTful desarrollada en Node.js y Express para la administración integral de usuarios, pedidos, asignación de entregas, simulación de datos (Mocks), registro de eventos (Logger) y documentación interactiva.

---

## 🛠️ Tecnologías Utilizadas

- **Entorno de ejecución:** Node.js (ES Modules)
- **Framework Web:** Express.js
- **Base de Datos:** MongoDB & Mongoose
- **Contenedorización:** Docker & Docker Compose
- **Variables de Entorno:** Dotenv
- **Subida de Archivos:** Multer
- **Testing:** Mocha, Chai & Supertest
- **Logging:** Winston & Winston Daily Rotate File
- **Documentación:** Swagger (OpenAPI 3.0.1) & Swagger UI Express
- **Generación de Mocks:** @faker-js/faker

---

## 🏗️ Arquitectura del Proyecto

El proyecto implementa una **Arquitectura en 4 Capas** desacoplada mediante el patrón **Repository & DAO**:

### 1. **Rutas (Routes):** Reciben las peticiones HTTP y aplican middlewares de validación/subida de archivos.
### 2. **Controladores (Controllers):** Manejan la entrada/salida de la solicitud HTTP, delegando la lógica de negocio al servicio. No ejecutan consultas a la base de datos ni instancian errores genéricos.
### 3. **Servicios (Services):** Contienen la lógica de negocio pura, las validaciones de datos y el lanzamiento de errores estandarizados (`CustomError`).
### 4. **Repositorios / DAOs (Repositories / DAOs):** Encapsulan el acceso a la base de datos mediante Mongoose (`find`, `findById`, `create`, `findByIdAndUpdate`, `findByIdAndDelete`).

```
shipnow-api/
├── src/
│   ├── config/            # Configuración de BD, variables de entorno, Winston y Swagger
│   ├── controllers/       # Controladores HTTP desacoplados
│   ├── docs/              # Documentación YAML para Swagger
│   ├── errors/            # Sistema centralizado de manejo de errores (CustomError, Enum)
│   ├── middlewares/       # Middlewares de manejo de errores, uploads (Multer), etc.
│   ├── models/            # Esquemas de Mongoose
│   ├── repositories/      # Capa de abstracción de acceso a datos (DAOs/Repos)
│   ├── routes/            # Endpoints de la API
│   ├── services/          # Lógica de negocio de la aplicación
│   ├── utils/             # Funciones auxiliares y logger
│   ├── app.js             # Inicialización de Express
│   └── server.js          # Punto de entrada de la aplicación
├── tests/                 # Pruebas integrales de integración con Mocha/Chai/Supertest
├── uploads/               # Directorio para subida de archivos (documentos, licencias, comprobantes)
├── .env.example           # Plantilla de variables de entorno para desarrollo
├── .env.test.example      # Plantilla de variables de entorno para testing
├── docker-compose.yml     # Orquestador de contenedores (App + MongoDB)
├── Dockerfile             # Configuración del contenedor Docker
├── package.json
└── README.md
```
## ⚙️ Configuración y Variables de Entorno
## 1. Variables de Entorno
Crea los archivos .env y .env.test basándote en las plantillas correspondientes.

## Ejemplo de .env (Desarrollo):
```
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow
NODE_ENV=development
```

## Ejemplo de .env.test (Testing):
```
PORT=8081
NODE_ENV=test
MONGODB_URI=mongodb://localhost:27017/shipnow_test
JWT_SECRET=secret_test
LOG_LEVEL=silent
```
Nota: La aplicación admite de forma transparente tanto MONGODB_URI como MONGO_URI para prevenir incoherencias entre distintos entornos y ejecutores de pruebas.

## 🚀 Instalación y Ejecución
Instalación de dependencias
```
npm install
```
## Modo Desarrollo (con Nodemon)
```
npm run dev
```
## Modo Producción
```
npm start
```
## Ejecución con Docker (Contenedores)
Para desplegar la aplicación junto con una instancia de MongoDB mediante Docker Compose:
```
docker-compose up --build
```
Para detener los contenedores:
```
docker-compose down
```

### 🧪 Pruebas Automatizadas (Testing)
Las pruebas integrales evalúan la API mediante Mocha, Chai y Supertest.

## Para ejecutar los tests automatizados:

```
npm test
```
## Ejecutar Reporte de Cobertura de Código (c8):
```
npm run test:coverage
```

Nota: El script ejecuta npx mocha tests/**/*.test.js --timeout 10000 --exit garantizando la ejecución transparente sin requerir una instalación global de Mocha.

### 📑 Documentación Interactiva (Swagger)
La documentación técnica interactiva basada en OpenAPI 3.0.1 está disponible en la siguiente ruta una vez iniciado el servidor:

👉 http://localhost:8080/api/docs

### 📌 Principales Módulos y Endpoints

## 1. Usuarios (/api/users)
GET /api/users - Listado paginado de usuarios (admite query params page y limit).

GET /api/users/:uid - Obtener un usuario por ID.

POST /api/users - Crear un nuevo usuario.

PUT /api/users/:uid - Actualizar información de un usuario.

DELETE /api/users/:uid - Eliminar usuario.

POST /api/users/:uid/documents - Carga de documentación requerida (DNI, LICENSE, PASSPORT, TAX_ID, PROOF_OF_ADDRESS) mediante Multer.

## 2. Pedidos (/api/orders)
GET /api/orders - Listado paginado de pedidos (admite query params page y limit).

GET /api/orders/:oid - Obtener detalle de pedido por ID.

POST /api/orders - Creación de pedido con cálculo automático de montos.

PUT /api/orders/:oid/status - Actualizar el estado del pedido.

DELETE /api/orders/:oid - Cancelar/Eliminar pedido.

POST /api/orders/:oid/proof - Adjuntar comprobante de entrega o firma digital en formato PDF/Imagen.

## 3. Entregas (/api/deliveries)
GET /api/deliveries - Obtener entregas.

POST /api/deliveries - Asignar un repartidor a una orden de entrega.

PUT /api/deliveries/:did/status - Actualizar estado de la entrega.

## 4. Mocks & Logger (/api/mocks y /api/loggerTest)
GET /api/mocks/users?qty=N - Generación dinámica de usuarios simulados mediante Faker.js.

GET /api/mocks/orders?qty=N - Generación dinámica de pedidos simulados.

GET /api/mocks/deliveries?qty=N - Generación dinámica de entregas simuladas.

POST /api/mocks/seed?qty=N - Poblado masivo de datos de prueba en la base de datos MongoDB.

GET /loggerTest - Verificación de registro de logs por niveles (fatal, error, warning, info, http, debug).

### 🚨 Manejo de Errores Estandarizado

Nota: Toda la aplicación utiliza un middleware centralizado de errores combinado con CustomError y enumeradores numéricos (EErrors):

```
{
  "status": "error",
  "error": "NotFoundError",
  "message": "Usuario no encontrado",
  "code": 2,
  "cause": "No se encontró el usuario con ID 65a8fbbd825c82c17e064ea9"
}
```
👤 Autor
Emmanuel Alan Sueldo