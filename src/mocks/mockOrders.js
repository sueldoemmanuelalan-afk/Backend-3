import { fakerES as faker } from '@faker-js/faker';

export const generateMockOrder = (customerId, storeId) => {
  const statuses = ["created", "assigned", "picked_up", "in_transit", "delivered", "cancelled"];
  const priorities = ["low", "normal", "high"];

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