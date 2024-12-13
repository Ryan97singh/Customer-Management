import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const InvoiceByMonth = async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		if (req.method === "GET") {
			// Fetch aggregated data by month
			const aggregatedInvoices = await prisma.invoice.groupBy({
				by: ["createdAt"],
				_sum: {
					amount: true,
				},
				orderBy: {
					createdAt: "asc",
				},
			});

			// Format the response to group by month
			const aggregatedByMonth = aggregatedInvoices.reduce(
				(acc: any, invoice) => {
					const month = new Date(invoice.createdAt).toLocaleString(
						"default",
						{ year: "numeric", month: "long" }
					);
					if (!acc[month]) {
						acc[month] = 0;
					}
					acc[month] += invoice._sum.amount || 0;
					return acc;
				},
				{}
			);

			const formattedData = Object.entries(aggregatedByMonth).map(
				([month, amount]) => ({
					month,
					amount,
				})
			);

			res.status(200).json(formattedData);
		} else {
			res.setHeader("Allow", ["GET"]);
			res.status(405).json({
				message: `Method ${req.method} Not Allowed`,
			});
		}
	} catch (error) {
		console.error("Error fetching aggregated invoices:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export default InvoiceByMonth;
