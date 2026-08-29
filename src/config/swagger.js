import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'ShipNow API Documentation',
      version: '1.0.0',
      description: 'Documentación técnica interactiva de la API de gestión de envíos y logística ShipNow. Incluye módulos de Usuarios, Pedidos, Entregas, Mocks y Logger.',
      contact: {
        name: 'Emmanuel Alan Sueldo',
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Servidor Local de Desarrollo'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65a8fbbd825c82c17e064ea9' },
            first_name: { type: 'string', example: 'Juan' },
            last_name: { type: 'string', example: 'Pérez' },
            email: { type: 'string', example: 'juan.perez@example.com' },
            role: { type: 'string', enum: ['customer', 'driver', 'admin'], example: 'customer' }
          }
        },
        OrderItem: {
          type: 'object',
          properties: {
            product: { type: 'string', example: '65a8fbbd825c82c17e064eb1' },
            quantity: { type: 'number', example: 2 },
            price: { type: 'number', example: 1500.50 }
          }
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65a8fbbd825c82c17e064ea2' },
            customer: { type: 'string', example: '65a8fbbd825c82c17e064ea9' },
            store: { type: 'string', example: '65a8fbbd825c82c17e064ea1' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' }
            },
            status: { type: 'string', enum: ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'], example: 'PENDING' },
            total: { type: 'number', example: 3001.00 }
          }
        },
        Delivery: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '65a8fbbd825c82c17e064ec5' },
            order: { type: 'string', example: '65a8fbbd825c82c17e064ea2' },
            driver: { type: 'string', example: '65a8fbbd825c82c17e064ea8' },
            status: { type: 'string', enum: ['PENDING', 'PICKED_UP', 'DELIVERED', 'FAILED'], example: 'PENDING' }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            message: { type: 'string', example: 'Operación realizada con éxito' },
            payload: { type: 'object' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            error: { type: 'string', example: 'InvalidQuantityError' },
            message: { type: 'string', example: 'La cantidad (qty) debe ser un número entero positivo superior a 0.' },
            code: { type: 'number', example: 4 },
            cause: { type: 'string', example: "Se recibió qty='-3'." }
          }
        }
      }
    }
  },
  apis: ['./src/docs/**/*.yaml', './src/routes/*.js']
};

export const specs = swaggerJSDoc(swaggerOptions);