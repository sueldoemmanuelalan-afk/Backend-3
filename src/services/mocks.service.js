import { generateMockUsers } from '../mocks/mockUsers.js';
import { generateMockOrder } from '../mocks/mockOrders.js';
import { generateMockDelivery } from '../mocks/mockDeliveries.js';
import { ROLES } from '../constants/index.js';
import { CustomError } from '../errors/custom.error.js';
import { EErrors } from '../errors/enum.js';
import { UserRepository } from '../repositories/users.repository.js';
import { OrderRepository } from '../repositories/orders.repository.js';
import { Delivery } from '../models/delivery.model.js';

const userRepository = new UserRepository();
const orderRepository = new OrderRepository();

export class MocksService {
  static validateQuantity(qty) {
    const parsedQty = Number(qty);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      CustomError.createError({
        name: 'InvalidQuantityError',
        cause: `Se recibió qty='${qty}'. Debe ser un número entero mayor a 0.`,
        message: 'La cantidad (qty) debe ser un número entero positivo superior a 0.',
        code: EErrors.INVALID_PARAM_ERROR,
        statusCode: 400
      });
    }
    return parsedQty;
  }

  static getUsers(qty) {
    const parsedQty = this.validateQuantity(qty);
    return generateMockUsers(parsedQty);
  }

  static getOrders(qty) {
    const parsedQty = this.validateQuantity(qty);
    return Array.from({ length: parsedQty }, () =>
      generateMockOrder('dummyCustomerId', 'dummyStoreId')
    );
  }

  static getDeliveries(qty) {
    const parsedQty = this.validateQuantity(qty);
    return Array.from({ length: parsedQty }, () =>
      generateMockDelivery('dummyOrderId', 'dummyDriverId')
    );
  }

  static async seedData(usersQty = 5, ordersQty = 5) {
    const parsedUsersQty = this.validateQuantity(usersQty);
    const parsedOrdersQty = this.validateQuantity(ordersQty);

    try {
      // 1. Generar usuarios con sus roles correctos usando las constantes
      const mockCustomers = generateMockUsers(parsedUsersQty, ROLES.CUSTOMER);
      const mockDrivers = generateMockUsers(2, ROLES.DRIVER);
      const mockStores = generateMockUsers(1, ROLES.STORE);

      // 2. Persistir usuarios en MongoDB
      const createdCustomers = await Promise.all(
        mockCustomers.map(u => userRepository.create(u))
      );
      const createdDrivers = await Promise.all(
        mockDrivers.map(u => userRepository.create(u))
      );
      const createdStores = await Promise.all(
        mockStores.map(u => userRepository.create(u))
      );

      const activeStore = createdStores[0];

      // 3. Crear pedidos vinculados a clientes y tiendas reales de la BD
      const createdOrders = [];
      for (let i = 0; i < parsedOrdersQty; i++) {
        const randomCustomer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
        const orderPayload = generateMockOrder(randomCustomer._id, activeStore._id);
        const order = await orderRepository.create(orderPayload);
        createdOrders.push(order);
      }

      // 4. Crear entregas vinculadas a pedidos y repartidores reales
      const createdDeliveries = [];
      for (const order of createdOrders) {
        const randomDriver = createdDrivers[Math.floor(Math.random() * createdDrivers.length)];
        const deliveryPayload = generateMockDelivery(order._id, randomDriver._id);
        const delivery = await Delivery.create(deliveryPayload);
        createdDeliveries.push(delivery);
      }

      return {
        usersInserted: createdCustomers.length + createdDrivers.length + createdStores.length,
        ordersInserted: createdOrders.length,
        deliveriesInserted: createdDeliveries.length
      };
    } catch (error) {
      if (error instanceof CustomError) throw error;

      CustomError.createError({
        name: 'DatabaseSeedError',
        cause: error.message,
        message: 'Fallo al insertar los datos generados en la base de datos.',
        code: EErrors.DATABASE_ERROR,
        statusCode: 500
      });
    }
  }
}