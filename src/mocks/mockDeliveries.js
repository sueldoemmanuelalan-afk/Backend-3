import { fakerES as faker } from '@faker-js/faker';
import { ORDER_STATUS } from '../constants/index.js';

export const generateMockDelivery = (orderId, driverId) => {
  const statuses = Object.values(ORDER_STATUS);

  return {
    order: orderId,
    driver: driverId,
    status: faker.helpers.arrayElement(statuses),
    notes: faker.lorem.sentence()
  };
};