import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { IInvoiceWithoutCustomer, Meta } from "../../../../types/types";
import { decode } from "next-auth/jwt";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const token = req.cookies["next-auth.session-token"];
	const decoded = await decode({
		token: token,
		secret: process.env.JWT_SECRET,
	});
	const userId = decoded?.email;

	if (req.method === "GET") {
		const { page = "1", limit = "10", customerId } = req.query;

		//parse the parameters
		const pageNumber = parseInt(page as string, 10);
		const pageSize = parseInt(limit as string, 10);

		if (
			isNaN(pageNumber) ||
			isNaN(pageSize) ||
			pageNumber < 1 ||
			pageSize < 1
		) {
			res.status(400).json({
				error: "Invalid pagination parameters",
			});
			return;
		}

		try {
			//fetch data with pagination
			const invoices = await prisma.invoice.findMany({
				skip: (pageNumber - 1) * pageSize,
				take: pageSize,
				orderBy: { createdAt: "desc" },
				where: {
					customerId: customerId as string,
				},
			});
			// Get total count
			const totalItems = await prisma.invoice.count({
				where: {
					customerId: customerId as string,
				},
			});

			// Create meta information
			const meta: Meta = {
				total: totalItems,
				page: pageNumber,
				limit: pageSize,
				totalPages: Math.ceil(totalItems / pageSize),
			};

			// Return paginated data
			res.status(200).json({ data: invoices, meta });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	} else if (req.method === "DELETE") {
		const { id, customerId } = req.query;
		try {
			const deletedInvoice = await prisma.invoice.delete({
				where: { id: id as string },
			});
			await prisma.auditLog.create({
				data: {
					tableName: "Invoice",
					operation: "DELETE",
					invoiceId: id as string,
					customerId: customerId as string,
					changes: deletedInvoice,
					timestamp: new Date(),
					userId,
				},
			});
			res.status(200).json({ message: "Invoice deleted successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	} else if (req.method === "PUT") {
		const { id, customerId } = req.query;
		const { amount, dueDate, status } = req.body as IInvoiceWithoutCustomer;
		try {
			await prisma.invoice.update({
				where: { id: id as string },
				data: {
					status,
					amount,
					dueDate,
				},
			});
			await prisma.auditLog.create({
				data: {
					tableName: "Invoice",
					operation: "UPDATE",
					invoiceId: id as string,
					customerId: customerId as string,
					changes: {
						status,
						amount,
						dueDate,
					},
					timestamp: new Date(),
					userId,
				},
			});
			res.status(200).json({ message: "Invoice updated successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	} else if (req.method === "POST") {
		const { customerId } = req.query;
		const { amount, dueDate, status } = req.body as IInvoiceWithoutCustomer;
		try {
			const invoice = await prisma.invoice.create({
				data: {
					customerId: customerId as string,
					status,
					amount,
					dueDate,
				},
			});
			await prisma.auditLog.create({
				data: {
					tableName: "Invoice",
					operation: "CREATE",
					invoiceId: invoice.id,
					customerId: customerId as string,
					changes: {
						customerId: customerId as string,
						status,
						amount,
						dueDate,
					},
					timestamp: new Date(),
					userId,
				},
			});
			res.status(200).json({ message: "Invoice added successfully" });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
};
