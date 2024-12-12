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

export type IPagination<T> = {
	data: T[];
	meta: Meta;
};
