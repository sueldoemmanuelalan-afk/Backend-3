import { fakerES as faker } from '@faker-js/faker';
import { ROLES } from '../constants/index.js';

export const generateMockUser = (customRole = null) => {
  const rolesArray = Object.values(ROLES);
  const role = customRole || faker.helpers.arrayElement(rolesArray);

  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    role: role,
    documents: []
  };
};

export const generateMockUsers = (qty = 5, role = null) => {
  return Array.from({ length: Number(qty) }, () => generateMockUser(role));
};