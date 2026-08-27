import { fakerES as faker } from '@faker-js/faker';

export const generateMockDelivery = (orderId, driverId) => {
  return {
    order: orderId,
    driver: driverId,
    status: faker.helpers.arrayElement(['assigned', 'in_transit', 'delivered', 'failed']),
    notes: faker.lorem.sentence()
  };
};