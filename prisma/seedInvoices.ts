import { PrismaClient } from "@prisma/client";
import { fakeInvoiceComplete } from "../seed/customer";
const prisma = new PrismaClient();

const seedInvoices = async () => {
	await prisma.invoice.deleteMany();
	const customers = await prisma.customer.findMany();
	customers.forEach(async (customer) => {
		for (let i = 0; i < 20; i++) {
			const invoice = fakeInvoiceComplete(customer.id);
			await prisma.invoice.create({
				data: invoice,
			});
		}
	});
};

seedInvoices()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
