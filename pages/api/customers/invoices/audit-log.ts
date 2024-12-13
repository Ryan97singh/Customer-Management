import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "GET") {
		try {
			const { customerId } = req.query;
			//fetch data with pagination
			const auditLog = await prisma.auditLog.findMany({
				where: {
					customerId: customerId as string,
				},
			});

			// Return paginated data
			res.status(200).json(auditLog);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
};
