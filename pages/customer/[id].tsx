import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ICustomer, IInvoiceWithoutCustomer, IPagination } from '../../types/types';
import moment from 'moment';

const selectedClassName =
	"flex items-center justify-center px-4 h-10 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 ";

const nonSelectedClassName =
	"flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700";


const CustomerDetails = () => {
    const router = useRouter();

    const [customer, setCustomer] = useState<ICustomer>();

    const [invoices, setInvoices] = useState<IPagination<IInvoiceWithoutCustomer>>();
    const [page, setPage] = useState<number>(1);

    const getCustomerDetails = async () => {
        try {
            const res = await axios.get<ICustomer>(`/api/customers/${router.query.id}`);
            if (res.status === 200) {
                setCustomer(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    }
    const getInvoices = async () => {
        try {
            const res = await axios.get<IPagination<IInvoiceWithoutCustomer>>(`/api/customers/invoices`, {
                params: {
                    customerId: router.query.id
                }
            });
            if (res.status === 200) {
                setInvoices(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    }



    useEffect(() => {
        if (router.query.id) {
            getCustomerDetails();
            getInvoices();
        }
    }, [router])

    return (
        <div className='flex flex-col items-center'>
            {
                customer && (
                    <>
                    
                    <h2>{customer?.name}</h2>
            <span>{customer?.email}</span></>
                )
            }
            <table className='min-w-full divide-y divide-gray-200 mt-5'>
							<caption className='caption-top mb-5'>
								Invoices
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
										Amount
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase'
									>
										Created At
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase'
									>
										Updated At
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase'
									>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-200'>
								{invoices?.data?.map((c, i) => (
									<tr key={c.id}>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800'>
											{(page - 1) * 10 + (i + 1)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
											{c.amount}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
											{moment(c.createdAt).format('Do MMM YYYY')}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
											{moment(c.updatedAt).format('Do MMM YYYY')}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 flex gap-10'>
                                            <button onClickCapture={() => {
                                                alert(`Edit ${c.id}`)
                                            }}>Edit</button>
											<button onClickCapture={() => {
                                               if(confirm("Are you sure you want to delete this invoice?")) {
                                                alert(`Delete ${c.id}`)
                                               }
                                            }}>Delete</button>
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
									{[...Array(Math.min(10, invoices?.meta?.totalPages)).keys()].map((i) => (
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

									{invoices?.meta?.totalPages - 10 > 2 && (
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

                        {
                            invoices?.meta?.totalPages > 10 && (
                                <li>
										<a
											href='#'
											className={
												invoices?.meta.totalPages ===
												page
													? selectedClassName
													: nonSelectedClassName
											}
											onClickCapture={(e) => {
												e.preventDefault();
												setPage(
													invoices?.meta?.totalPages
												);
											}}
										>
											{invoices?.meta?.totalPages}
										</a>
									</li>
                            )
                                    }

									<li>
										<a
											href='#'
											className='flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700'
											onClickCapture={(e) => {
												e.preventDefault();
												if (
													page <
													invoices?.meta?.totalPages
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
    )
};

export default CustomerDetails;