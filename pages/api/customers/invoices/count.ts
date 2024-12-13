import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";
import { Meta } from "../../../../types/types";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "GET") {
		try {
			//fetch data with pagination
			const invoicesCount = await prisma.invoice.count();

			// Return paginated data
			res.status(200).json(invoicesCount);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
};
