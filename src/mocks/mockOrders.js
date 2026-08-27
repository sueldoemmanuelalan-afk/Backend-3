import { fakerES as faker } from '@faker-js/faker';
import { ORDER_STATUS, ORDER_PRIORITY } from '../constants/index.js';

export const generateMockOrder = (customerId, storeId) => {
  // Aseguramos valores válidos en mayúsculas para coincidir con el schema de Mongoose
  const fallbackStatuses = ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'ASSIGNED', 'CANCELLED'];
  const fallbackPriorities = ['LOW', 'NORMAL', 'HIGH'];

  const statuses = ORDER_STATUS ? Object.values(ORDER_STATUS) : fallbackStatuses;
  const priorities = ORDER_PRIORITY ? Object.values(ORDER_PRIORITY) : fallbackPriorities;

  const itemsCount = faker.number.int({ min: 1, max: 4 });
  const items = Array.from({ length: itemsCount }, () => ({
    name: faker.commerce.productName(),
    quantity: faker.number.int({ min: 1, max: 3 }),
    price: Number(faker.commerce.price({ min: 1000, max: 50000, dec: 0 }))
  }));

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return {
    customer: customerId,
    store: storeId,
    items,
    deliveryAddress: faker.location.streetAddress(),
    total,
    status: faker.helpers.arrayElement(statuses),
    priority: faker.helpers.arrayElement(priorities),
    proof: null
  };
};