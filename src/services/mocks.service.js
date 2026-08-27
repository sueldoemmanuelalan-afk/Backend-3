import { generateMockUsers } from '../mocks/mockUsers.js';
import { generateMockOrder } from '../mocks/mockOrders.js';
import { generateMockDelivery } from '../mocks/mockDeliveries.js';
import { ROLES } from '../constants/index.js';

import { UserRepository } from '../repositories/users.repository.js';
import { OrderRepository } from '../repositories/orders.repository.js';
import { Delivery } from '../models/delivery.model.js';

const userRepository = new UserRepository();
const orderRepository = new OrderRepository();

export class MocksService {
  static getUsers(qty) {
    return generateMockUsers(qty);
  }

  static async seedData(usersQty = 5, ordersQty = 5) {
    // Roles validos segun tu user.model.js
    const customerRole = ROLES.CUSTOMER;
    const driverRole = ROLES.CUSTOMER; 

    // 1. Crear usuarios y repartidores simulados
    const mockCustomers = generateMockUsers(usersQty, customerRole);
    const mockDrivers = generateMockUsers(2, driverRole);

    const createdCustomers = await Promise.all(
      mockCustomers.map(u => userRepository.create(u))
    );

    const createdDrivers = await Promise.all(
      mockDrivers.map(u => userRepository.create(u))
    );

    const dummyStoreId = '6a8fbbd825c82c17e064ea92';

    // 2. Crear pedidos asignados
    const createdOrders = [];
    for (let i = 0; i < ordersQty; i++) {
      const randomCustomer = createdCustomers[Math.floor(Math.random() * createdCustomers.length)];
      const orderPayload = generateMockOrder(randomCustomer._id, dummyStoreId);
      
      const order = await orderRepository.create(orderPayload);
      createdOrders.push(order);
    }

    // 3. Crear entregas asociadas
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
  }
}