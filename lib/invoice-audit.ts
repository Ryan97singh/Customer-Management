import { PrismaClient, Prisma } from "@prisma/client";

export const invoiceAuditLogs = Prisma.defineExtension((prisma) => {
	return prisma.$extends({
		name: "invoiceWithAudit",
		model: {
			invoice: {
				async createWithAudit(data: any, userId: string) {
					const invoice = await prisma.invoice.create({ data });

					await prisma.auditLog.create({
						data: {
							tableName: "Invoice",
							operation: "CREATE",
							recordId: invoice.id,
							changes: JSON.stringify(data),
							timestamp: new Date(),
							userId,
						},
					});

					return invoice;
				},
				async updateWithAudit(
					where: Prisma.InvoiceWhereUniqueInput,
					data: any,
					userId: string
				) {
					const updatedInvoice = await prisma.invoice.update({
						where,
						data,
					});

					await prisma.auditLog.create({
						data: {
							tableName: "Invoice",
							operation: "UPDATE",
							recordId: where.id,
							changes: JSON.stringify(data),
							timestamp: new Date(),
							userId,
						},
					});

					return updatedInvoice;
				},
				async deleteWithAudit(
					where: Prisma.InvoiceWhereUniqueInput,
					userId: string
				) {
					const deletedInvoice = await prisma.invoice.delete({
						where,
					});

					await prisma.auditLog.create({
						data: {
							tableName: "Invoice",
							operation: "DELETE",
							recordId: where.id,
							changes: JSON.stringify(deletedInvoice),
							timestamp: new Date(),
							userId,
						},
					});

					return deletedInvoice;
				},
			},
		},
	});
});
