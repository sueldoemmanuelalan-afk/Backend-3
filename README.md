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



