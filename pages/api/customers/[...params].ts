import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => { 
    if (req.method === 'GET') {
        const id = req.query?.params?.[0] as string;

        const customerDetails = await prisma.customer.findFirst({
            where: {
                id: id,
            }
        });

        if (customerDetails) {
            res.status(200).json(customerDetails);
        } else {
            res.status(400).json({
                error: 'Customer Not Found'
            });
        }

    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
};