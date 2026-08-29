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
  static getUsers(qty) {
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

    return generateMockUsers(parsedQty);
  }

  static async seedData(usersQty = 5, ordersQty = 5) {
    const parsedUsersQty = Number(usersQty);
    const parsedOrdersQty = Number(ordersQty);

    if (isNaN(parsedUsersQty) || parsedUsersQty <= 0 || isNaN(parsedOrdersQty) || parsedOrdersQty <= 0) {
      CustomError.createError({
        name: 'InvalidQuantityError',
        cause: `Valores recibidos: usersQty=${usersQty}, ordersQty=${ordersQty}.`,
        message: 'Las cantidades a poblar deben ser números enteros mayores a 0.',
        code: EErrors.INVALID_PARAM_ERROR,
        statusCode: 400
      });
    }

    try {
      const mockCustomers = generateMockUsers(parsedUsersQty, ROLES.CUSTOMER);
      const mockDrivers = generateMockUsers(2, ROLES.CUSTOMER);

      const createdCustomers = await Promise.all(
        mockCustomers.map(u => userRepository.create(u))
      );
      const createdDrivers = await Promise.all(
        mockDrivers.map(u => userRepository.create(u))
      );

      const dummyStoreId = '6a8fbbd825c82c17e064ea92';

      const createdOrders = [];
      for (let i = 0; i < parsedOrdersQty; i++) {
        const randomCustomer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
        const orderPayload = generateMockOrder(randomCustomer._id, dummyStoreId);
        const order = await orderRepository.create(orderPayload);
        createdOrders.push(order);
      }

      const createdDeliveries = [];
      for (const order of createdOrders) {
        const randomDriver = createdDrivers[Math.floor(Math.random() * createdDrivers.length)];
        const deliveryPayload = generateMockDelivery(order._id, randomDriver._id);
        const delivery = await Delivery.create(deliveryPayload);
        createdDeliveries.push(delivery);
      }

      return {
        usersInserted: createdCustomers.length + createdDrivers.length,
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