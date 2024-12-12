import { PrismaClient } from "@prisma/client";
import { fakeCustomerComplete } from "../seed/customer";
const prisma = new PrismaClient();

const seedCustomer = async () => {
	for (let i = 0; i < 100; i++) {
		const customer = fakeCustomerComplete();
		await prisma.customer.create({
			data: customer,
		});
	}
};

seedCustomer()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
