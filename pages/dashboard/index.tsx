import { GetStaticProps } from "next";
import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import { fakeCustomerComplete } from "../../seed/customer";
import { useEffect, useState } from "react";
import { ICustomer, InvoiceByMonth, IPagination } from "../../types/types";
import axios from "axios";
import LoginButton from "../../component/login-btn";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Card from "../../component/card";
import Loader from "../../component/loader";
import Link from "next/link";
import BarChart from "../../component/barChart";

const selectedClassName =
	"flex items-center justify-center px-4 h-10 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 ";

const nonSelectedClassName =
	"flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700";

export default function Dashboard() {
	const session = useSession();
	console.log(session);

	const router = useRouter();

	//useState
	const [customers, setCustomers] = useState<IPagination<ICustomer>>();
	const [invoiceCount, setInvoiceCount] = useState<number>();
	const [invoiceByMonth, setInvoiceByMonth] = useState<InvoiceByMonth[]>([]);
	const [page, setPage] = useState<number>(1);

	const [requests, setRequests] = useState<number>(0);

	//function to get customer data
	const getCustomer = async (pageNumber: number) => {
		try {
			setRequests((r) => r + 1);
			const res = await axios.get<IPagination<ICustomer>>(
				"/api/customers",
				{
					params: {
						limit: 10,
						page: pageNumber,
					},
				}
			);
			if (res.status === 200) {
				setCustomers(res.data);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setRequests((r) => r - 1);
		}
	};

	const getInvoicesCount = async () => {
		try {
			setRequests((r) => r + 1);
			const res = await axios.get<number>(
				"/api/customers/invoices/count"
			);
			if (res.status === 200) {
				setInvoiceCount(res.data);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setRequests((r) => r - 1);
		}
	};
	const getInvoiceByMonth = async () => {
		try {
			setRequests((r) => r + 1);
			const res = await axios.get<InvoiceByMonth[]>(
				"/api/customers/invoices/invoice-by-month"
			);
			if (res.status === 200) {
				setInvoiceByMonth(res.data);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setRequests((r) => r - 1);
		}
	};

	//UseEffects
	useEffect(() => {
		getCustomer(page);
	}, [page]);

	useEffect(() => {
		getInvoicesCount();
		getInvoiceByMonth();
	}, []);

	useEffect(() => {
		if (!session?.data) {
			router.replace("/");
		}
		console.log({ session });
	}, []);

	if (!session?.data) {
		return null;
	}

	return (
		<div className='flex flex-col'>
			{requests !== 0 && (
				<div className='flex items-center justify-center fixed h-full w-full bg-[rgba(255,255,255,0.7)]'>
					<Loader />
				</div>
			)}
			<div className='-m-1.5 overflow-x-auto'>
				<div className='p-1.5 min-w-full inline-block align-middle'>
					<div className='overflow-hidden'>
						<div className='flex justify-end m-2'>
							<button
								style={{
									border: "1px solid blue",
									borderRadius: "5px",
									padding: "5px 10px",
								}}
								onClickCapture={() => {
									signOut();
								}}
							>
								Logout
							</button>
						</div>
						<div className='px-10 flex gap-10 items-center justify-center'>
							<Card
								name='Total Customers'
								value={customers?.meta?.total}
							/>
							<Card name='Total Invoices' value={invoiceCount} />
						</div>
						<div className='px-10 flex gap-10 items-center justify-center mt-10'>
							{invoiceByMonth.length > 0 && (
								<BarChart
									data={invoiceByMonth.map((i) => i.amount)}
									labels={invoiceByMonth.map((i) => i.month)}
								/>
							)}
						</div>
						<table className='min-w-full divide-y divide-gray-200 mt-5'>
							<caption className='caption-top mb-5'>
								Customers
							</caption>
							<thead>
								<tr>
									<th
										scope='col'
										className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase'
									>
										Sr. No.
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase'
									>
										Name
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase'
									>
										Email Id
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-200'>
								{customers?.data?.map((c, i) => (
									<tr key={c.id}>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800'>
											{(page - 1) * 10 + (i + 1)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
											<Link
												href={`/customer/${c.id}`}
												target='_blank'
											>
												{c.name}
											</Link>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
											{c.email}
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className='flex items-center justify-center mt-10'>
							<nav aria-label='Page navigation example'>
								<ul className='inline-flex -space-x-px text-base h-10'>
									<li>
										<a
											href='#'
											onClickCapture={(e) => {
												e.preventDefault();
												if (page > 1) {
													setPage((p) => p - 1);
												}
											}}
											className='flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700'
										>
											Previous
										</a>
									</li>
									{customers?.meta?.totalPages &&
										[
											...Array(
												Math.min(
													10,
													customers?.meta?.totalPages
												)
											).keys(),
										].map((i) => (
											<li key={i}>
												<a
													href='#'
													className={
														i + 1 === page
															? selectedClassName
															: nonSelectedClassName
													}
													onClickCapture={(e) => {
														e.preventDefault();
														setPage(i + 1);
													}}
												>
													{i + 1}
												</a>
											</li>
										))}

									{customers?.meta?.totalPages - 10 > 2 && (
										<li>
											<a
												href='#'
												className='flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700'
												onClickCapture={(e) => {
													e.preventDefault();
												}}
											>
												...
											</a>
										</li>
									)}

									{customers?.meta?.totalPages > 10 && (
										<li>
											<a
												href='#'
												className={
													customers?.meta
														.totalPages === page
														? selectedClassName
														: nonSelectedClassName
												}
												onClickCapture={(e) => {
													e.preventDefault();
													setPage(
														customers?.meta
															?.totalPages
													);
												}}
											>
												{customers?.meta?.totalPages}
											</a>
										</li>
									)}

									<li>
										<a
											href='#'
											className='flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700'
											onClickCapture={(e) => {
												e.preventDefault();
												if (
													page <
													customers?.meta?.totalPages
												) {
													setPage((p) => p + 1);
												}
											}}
										>
											Next
										</a>
									</li>
								</ul>
							</nav>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
