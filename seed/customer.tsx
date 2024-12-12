import {  } from '@prisma/client';
import { faker } from '@faker-js/faker';
import Decimal from 'decimal.js';



export function fakeCustomer() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeCustomerComplete() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeInvoice() {
  return {
    amount: faker.number.float(),
    updatedAt: faker.date.anytime(),
  };
}
export function fakeInvoiceComplete() {
  return {
    id: faker.string.uuid(),
    amount: faker.number.float(),
    customerId: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: faker.date.anytime(),
  };
}
