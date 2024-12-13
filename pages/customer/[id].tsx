import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import {
	IAuditLog,
	ICustomer,
	IInvoiceWithoutCustomer,
	IPagination,
} from "../../types/types";
import moment from "moment";
import { AddIcon, DeleteIcon, EditIcon } from "../../assets";
import {
	Dropdown,
	DropdownItem,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Select,
	TextInput,
} from "flowbite-react";
import Loader from "../../component/loader";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

export async function getStaticProps({ params }) {
	return { props: {} };
}

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: "blocking",
	};
}

const selectedClassName =
	"flex items-center justify-center px-4 h-10 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 ";

const nonSelectedClassName =
	"flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700";

const CustomerDetails = () => {
	const router = useRouter();

	const [customer, setCustomer] = useState<ICustomer>();

	const [invoices, setInvoices] =
		useState<IPagination<IInvoiceWithoutCustomer>>();
	const [page, setPage] = useState<number>(1);
	const [editVisible, setEditVisible] = useState<boolean>(false);
	const [addVisible, setAddVisible] = useState<boolean>(false);
	const [auditVisible, setAuditVisible] = useState<boolean>(false);
	const [requests, setRequests] = useState<number>(0);
	const [edit, setEdit] = useState<IInvoiceWithoutCustomer | null>(null);
	const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);

	const formRef = useRef<HTMLFormElement>(null);
	const addFormRef = useRef<HTMLFormElement>(null);

	const getCustomerDetails = async () => {
		try {
			const res = await axios.get<ICustomer>(
				`/api/customers/${router.query.id}`
			);
			if (res.status === 200) {
				setCustomer(res.data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const getInvoices = async (pageNumber: number) => {
		try {
			setRequests((r) => r + 1);
			const res = await axios.get<IPagination<IInvoiceWithoutCustomer>>(
				`/api/customers/invoices`,
				{
					params: {
						customerId: router.query.id,
						limit: 10,
						page: pageNumber,
					},
				}
			);
			if (res.status === 200) {
				setInvoices(res.data);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setRequests((r) => r - 1);
		}
	};

	const getAuditLogs = async () => {
		try {
			setRequests((r) => r + 1);
			const res = await axios.get<IAuditLog[]>(
				`/api/customers/invoices/audit-log`,
				{
					params: {
						customerId: router.query.id,
					},
				}
			);
			if (res.status === 200) {
				setAuditLogs(res.data);
				setAuditVisible(true);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setRequests((r) => r - 1);
		}
	};

	const deleteInvoice = async (id: string) => {
		try {
			setRequests((r) => r + 1);
			const res = await axios.delete(`/api/customers/invoices`, {
				params: {
					id,
					customerId: router.query.id,
				},
			});
			if (res.status === 200) {
				toast.success("Invoices deleted successfully");
				if (page === 1) {
					getInvoices(1);
				} else {
					setPage(1);
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			setRequests((r) => r - 1);
		}
	};

	const updateInvoice = async (data: IInvoiceWithoutCustomer) => {
		try {
			setRequests((r) => r + 1);
			const res = await axios.put(`/api/customers/invoices`, data, {
				params: {
					id: data.id,
					customerId: router.query.id,
				},
			});
			if (res.status === 200) {
				// alert("Invoice Updated successfully");
				toast.success("Invoice Updated successfully");
				if (page === 1) {
					getInvoices(1);
				} else {
					setPage(1);
				}
				setEditVisible(false);
				setEdit(null);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setRequests((r) => r - 1);
		}
	};

	const addInvoice = async (data: Partial<IInvoiceWithoutCustomer>) => {
		try {
			setRequests((r) => r + 1);
			const res = await axios.post(`/api/customers/invoices`, data, {
				params: {
					customerId: router.query.id,
				},
			});
			if (res.status === 200) {
				// alert("Invoice Updated successfully");
				toast.success("Invoice added successfully");
				if (page === 1) {
					getInvoices(1);
				} else {
					setPage(1);
				}
				setAddVisible(false);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setRequests((r) => r - 1);
		}
	};

	useEffect(() => {
		if (router.query.id) {
			getCustomerDetails();
		}
	}, [router]);

	useEffect(() => {
		if (router.query.id) {
			getInvoices(page);
		}
	}, [router, page]);

	if (router.isFallback) {
		return <div>Loading...</div>;
	}

	return (
		<div className='flex flex-col py-4'>
			{requests !== 0 && (
				<div className='flex items-center justify-center fixed h-full w-full bg-[rgba(255,255,255,0.7)]'>
					<Loader />
				</div>
			)}
			{customer && (
				<div className='flex flex-col items-center'>
					<h1 className='font-bold text-xl'>{customer?.name}</h1>
					<span className='text-blue-700 underline'>
						{customer?.email}
					</span>
				</div>
			)}
			<div className='overflow-scroll'>
				<div className='flex gap-2 justify-end'>
					<div className='flex justify-end mx-2'>
						<button
							onClickCapture={() => setAddVisible(true)}
							type='button'
							className='flex gap-2 items-center justify-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
						>
							<AddIcon />
							Add Invoice
						</button>
					</div>
					<div className='flex justify-end mx-2'>
						<button
							onClickCapture={() => getAuditLogs()}
							type='button'
							className='flex gap-2 items-center justify-center text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
						>
							Audit Logs
						</button>
					</div>
				</div>
				<table className='min-w-full divide-y divide-gray-200 mt-5'>
					<caption className='caption-top mb-5'>Invoices</caption>
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
								Due Date
							</th>
							<th
								scope='col'
								className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase'
							>
								Status
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
									{moment(c.createdAt).format("Do MMM YYYY")}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
									{moment(c.dueDate).format("Do MMM YYYY")}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
									{c.status}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800 flex gap-10'>
									<button
										onClickCapture={() => {
											setEdit(c);
											setEditVisible(true);
										}}
										type='button'
									>
										<EditIcon />
									</button>
									<button
										onClickCapture={() => {
											if (
												confirm(
													"Are you sure you want to delete this invoice?"
												)
											) {
												deleteInvoice(c.id);
											}
										}}
									>
										<DeleteIcon />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
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
						{invoices?.meta?.totalPages &&
							[
								...Array(
									Math.min(10, invoices?.meta?.totalPages)
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

						{invoices?.meta?.totalPages > 10 && (
							<li>
								<a
									href='#'
									className={
										invoices?.meta.totalPages === page
											? selectedClassName
											: nonSelectedClassName
									}
									onClickCapture={(e) => {
										e.preventDefault();
										setPage(invoices?.meta?.totalPages);
									}}
								>
									{invoices?.meta?.totalPages}
								</a>
							</li>
						)}

						<li>
							<a
								href='#'
								className='flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700'
								onClickCapture={(e) => {
									e.preventDefault();
									if (page < invoices?.meta?.totalPages) {
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
			<Modal show={editVisible} onClose={() => setEditVisible(false)}>
				<ModalHeader>
					<div className='flex items-center justify-between w-100'>
						<h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
							Edit Invoice
						</h3>
					</div>
				</ModalHeader>
				<ModalBody>
					{edit && (
						<form ref={formRef} className='flex flex-col gap-2'>
							<TextInput
								name='amount'
								placeholder='Amount'
								defaultValue={edit.amount}
								required
							/>
							<TextInput
								name='due_date'
								placeholder='Due Date'
								defaultValue={moment(edit.dueDate).format(
									"YYYY-MM-DD"
								)}
								type='date'
								required
							/>
							<Select
								name='status'
								defaultValue={edit.status}
								required
							>
								<option value='PENDING'>PENDING</option>
								<option value='PAID'>PAID</option>
							</Select>
						</form>
					)}
				</ModalBody>
				<ModalFooter>
					<div className='flex items-center'>
						<button
							data-modal-hide='default-modal'
							type='button'
							className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
							onClickCapture={() => {
								if (formRef.current) {
									const formData = new FormData(
										formRef.current
									);
									const data = Object.fromEntries(formData);
									console.log(data);
									updateInvoice({
										...edit,
										amount: parseInt(
											data?.amount?.toString()
										),
										dueDate: moment(
											data.due_date?.toString(),
											"YYYY-MM-DD"
										).toDate(),
										status: data.status?.toString(),
									});
								}
							}}
						>
							Save
						</button>
						<button
							data-modal-hide='default-modal'
							type='button'
							className='py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
							onClickCapture={() => setEditVisible(false)}
						>
							Cancel
						</button>
					</div>
				</ModalFooter>
			</Modal>

			{/* Add New Invoice */}
			<Modal show={addVisible} onClose={() => setAddVisible(false)}>
				<ModalHeader>
					<div className='flex items-center justify-between w-100'>
						<h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
							Add Invoice
						</h3>
					</div>
				</ModalHeader>
				<ModalBody>
					<form ref={addFormRef} className='flex flex-col gap-2'>
						<TextInput
							name='amount'
							placeholder='Amount'
							required
						/>
						<TextInput
							name='due_date'
							placeholder='Due Date'
							type='date'
							required
						/>
						<Select name='status' defaultValue='PENDING' required>
							<option value='PENDING'>PENDING</option>
							<option value='PAID'>PAID</option>
						</Select>
					</form>
				</ModalBody>
				<ModalFooter>
					<div className='flex items-center'>
						<button
							data-modal-hide='default-modal'
							type='button'
							className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
							onClickCapture={() => {
								if (addFormRef.current) {
									const formData = new FormData(
										addFormRef.current
									);
									const data = Object.fromEntries(formData);
									console.log(data);
									addInvoice({
										amount: parseInt(
											data?.amount?.toString()
										),
										dueDate: moment(
											data.due_date?.toString(),
											"YYYY-MM-DD"
										).toDate(),
										status: data.status?.toString(),
									});
								}
							}}
						>
							Save
						</button>
						<button
							data-modal-hide='default-modal'
							type='button'
							className='py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'
							onClickCapture={() => setEditVisible(false)}
						>
							Cancel
						</button>
					</div>
				</ModalFooter>
			</Modal>
			{/* Audit Logs Modal*/}
			<Modal show={auditVisible} onClose={() => setAuditVisible(false)}>
				<ModalHeader>
					<div className='flex items-center justify-between w-100'>
						<h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
							Audit Logs
						</h3>
					</div>
				</ModalHeader>
				<ModalBody className='min-h-52'>
					<div className='overflow-scroll'>
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
										Operation
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase'
									>
										Invoice ID
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase'
									>
										Changes
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase'
									>
										Date
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase'
									>
										Updated By
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-200'>
								{auditLogs?.map((c, i) => (
									<tr key={c.id}>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800'>
											{i + 1}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
											{c.operation}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
											{c.invoiceId}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
											<pre>
												{JSON.stringify(
													c.changes,
													null,
													4
												)}
											</pre>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
											{moment(c.timestamp).format(
												"Do MMM YYYY"
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-800'>
											{c.userId}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</ModalBody>
			</Modal>
		</div>
	);
};

export default CustomerDetails;
