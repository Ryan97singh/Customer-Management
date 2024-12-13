import {} from "@prisma/client";
import { faker } from "@faker-js/faker";
import Decimal from "decimal.js";

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
export function fakeInvoiceComplete(customerId: string) {
	return {
		id: faker.string.uuid(),
		amount: faker.number.int({ min: 100, max: 1000 }),
		customerId,
		createdAt: faker.date.between({ from: "2024-01-01", to: Date.now() }),
		updatedAt: faker.date.anytime(),
	};
}
