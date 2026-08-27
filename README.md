# ShipNow API - Pre-entrega Módulo 1

API REST para la gestión de envíos, productos y usuarios refactorizada a una arquitectura profesional en 3 capas.

## 🚀 Instrucciones para correr el proyecto localmente

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/MartinPerezDev/shipnow-api-96790.git](https://github.com/MartinPerezDev/shipnow-api-96790.git)
   cd shipnow-api-96790 
   ```
2.   Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar las variables de entorno:
Crea un archivo .env en la raíz del proyecto tomando como guía el archivo .env.example:

   ```
   PORT=8080
MONGODB_URI=tu_cadena_de_conexion_mongodb
NODE_ENV=development
   ```
4. Iniciar el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```
Arquitectura por Capas (Controller - Service - Repository)
La API fue refactorizada desde un modelo monolítico hacia una arquitectura estructurada en capas:

Controller (src/controllers/): Gestiona la recepción de solicitudes HTTP (req, res). Delega la lógica de negocio al servicio y devuelve los códigos de estado apropiados. No interactúa directamente con Mongoose.

Service (src/services/): Contiene las reglas de negocio, cálculos y validaciones. Llama a la capa de repositorio para obtener o modificar datos.

Repository (src/repositories/): Es la única capa que conoce Mongoose/MongoDB. Se encarga de realizar consultas, aplicar filtros por defecto y manejar proyecciones.

¿Por qué separar Service y Repository?
Desacoplamiento y Mantenibilidad: La lógica de negocio (Service) queda completamente aislada del mecanismo de almacenamiento (Repository). Si en el futuro se cambia MongoDB/Mongoose por otro ORM o base de datos, las reglas de negocio no sufren modificaciones.

Testabilidad: Facilita la creación de pruebas unitarias sobre los servicios mediante el uso de mocks o datos simulados sin requerir una conexión activa a la base de datos.

## 📌 Pre-entrega 3: Manejo Profesional de Errores

Se implementó un sistema centralizado de gestión de errores mediante una arquitectura por capas.

### Structure of Error Responses
Todos los errores de la API devuelven una estructura HTTP uniforme:

```json
{
  "status": "error",
  "error": "InvalidQuantityError",
  "message": "La cantidad (qty) debe ser un número entero positivo superior a 0.",
  "code": 4,
  "cause": "Se recibió qty='-3'. Debe ser un número entero mayor a 0."
}

Casos de prueba para verificar errores controlados
Cantidad negativa en usuarios simulados (GET):

URL: GET http://localhost:8080/api/mocks/users?qty=-3

Resultado: Status 400 Bad Request con mensaje de error sobre cantidad inválida.

Parámetro no numérico en generación de mocks (GET):

URL: GET http://localhost:8080/api/mocks/users?qty=abc

Resultado: Status 400 Bad Request.

Valores inválidos en el Seed de MongoDB (POST):

URL: POST http://localhost:8080/api/mocks/seed?qty=0

Resultado: Status 400 Bad Request.


📌 Pre-entrega 4: Logging y Monitoreo Básico
Se integró un sistema de logging profesional basado en Winston con soporte para rotación diaria de archivos vía winston-daily-rotate-file.

Niveles de Log Configurados
fatal: Fallas críticas que comprometen el funcionamiento de la app (ej. error al conectar MongoDB).

error: Excepciones o errores no controlados del servidor (5xx).

warning: Advertencias y errores esperados del cliente/negocio (4xx).

info: Eventos operacionales (inicio de servidor, conexión a BD).

http: Peticiones HTTP registradas mediante middleware.

debug: Información detallada de tracing para entornos de desarrollo.

Comportamiento según el Entorno (NODE_ENV)
Desarrollo (development): Muestra por consola desde el nivel debug en adelante, incluyendo timestamps y colores.

Producción (production): Limita la consola a partir del nivel info.

Persistencia y Rotación de Logs
Los logs con nivel error y fatal se guardan automáticamente en la carpeta /logs en archivos rotativos diarios con el nombre error-YYYY-MM-DD.log (máximo 14 días de retención).

Nota: La carpeta /logs y los archivos *.log están incluidos en .gitignore para evitar su persistencia en el repositorio.

Endpoint Interno de Prueba
URL: GET http://localhost:8080/loggerTest

Descripción: Dispara logs en todos los niveles para verificar la consola y la escritura en archivo.