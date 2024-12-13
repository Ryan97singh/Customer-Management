import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { Meta } from "../../../../types/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "GET") {
		const { page = "1", limit = "10", customerId } = req.query;
		console.log({ customerId });

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
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
};
