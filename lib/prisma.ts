import { PrismaClient } from "@prisma/client";
import { invoiceAuditLogs } from "./invoice-audit";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient();
} else {
	if (!global.prisma) {
		global.prisma = new PrismaClient();
	}
	prisma = global.prisma;
}

// Adding Extensions
prisma.$extends(invoiceAuditLogs);

export default prisma;
