import {} from "@prisma/client";
import { faker } from "@faker-js/faker";
import Decimal from "decimal.js";
import moment from "moment";

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
		dueDate: undefined,
	};
}
export function fakeInvoiceComplete(customerId: string) {
	const createdAt = faker.date.between({
		from: "2024-01-01",
		to: new Date(),
	});
	return {
		id: faker.string.uuid(),
		amount: faker.number.int({ min: 1000, max: 10000 }),
		customerId,
		createdAt,
		updatedAt: faker.date.anytime(),
		dueDate: moment(createdAt).add(30, "days").toDate(),
		status: "PENDING",
	};
}
export function fakeAuditLog() {
	return {
		tableName: faker.lorem.words(5),
		operation: faker.lorem.words(5),
		recordId: faker.lorem.words(5),
		changes: undefined,
		userId: undefined,
	};
}
export function fakeAuditLogComplete() {
	return {
		id: faker.string.uuid(),
		tableName: faker.lorem.words(5),
		operation: faker.lorem.words(5),
		recordId: faker.lorem.words(5),
		changes: undefined,
		timestamp: new Date(),
		userId: undefined,
	};
}
