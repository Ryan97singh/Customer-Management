import { Prisma } from "@prisma/client";

export type Meta = {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};

export type ICustomer = Prisma.CustomerGetPayload<{
	select: {
		id: true;
		email: true;
		name: true;
		createdAt: true;
		updatedAt: true;
	};
}>;
export type IInvoiceWithoutCustomer = Prisma.InvoiceGetPayload<{
	select: {
		id: true;
		amount: true;
		customerId: true;
		createdAt: true;
		updatedAt: true;
		dueDate: true;
		status: true;
	};
}>;

export type IPagination<T> = {
	data: T[];
	meta: Meta;
};

export type InvoiceByMonth = {
	month: string;
	amount: number;
};
