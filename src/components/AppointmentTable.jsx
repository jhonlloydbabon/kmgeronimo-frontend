import axios from 'axios';
import React, { useState } from 'react';
import { APPOINTMENT_LINK } from '../ApiLinks';
import { AiFillEdit, AiOutlineFolderView, AiFillDelete } from 'react-icons/ai';
import UpdateAppointmentModal from './UpdateAppointmentModal';
import CancelModal from './CancelModal';
import ViewAppointment from './ViewAppointment';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { toastHandler } from "../ToastHandler";
import moment from 'moment';

function AppointmentTable({ tableHeaders, results, search, currentPage }) {
	const [cancelModal, setCancelModal] = useState(false);
	const [update, setUpdate] = useState(false);
	const navigate = useNavigate();
	const [view, setView] = useState({
		isShow: false,
		appointment: ""
	});

	const [statusValue, setStatusValue] = useState({
		isClick: false,
		statusCode: ""
	});

	const [appointmentData, setAppointmentData] = useState({
		dentist: "",
		dentalServices: "",
		timeStart: "",
		appointmentDate: "",
		appointmentId: ""
	});

	const [status1, setStatus1] = useState({
		selectedId: null,
		remarks: "PENDING",
		isSelected: false
	});

	const [status, setStatus] = useState({
		id: "",
		status: "",
		description: ""
	});

	const deleteAppointment = async (id, result) => {
		try {
			if (result === "APPROVED") {
				return toastHandler("error", "You can't delete this appointment");
			}
			const response = await axios.delete(`${APPOINTMENT_LINK}${id}`);
			if (response.data) {
				toastHandler("success", `${response.data.message}`)
				setTimeout(() => { window.location.reload(); }, 1500);
			}
		} catch (error) {
			toastHandler("error", "You can't delete this appointment");
		}
	};

	const updateButton = (dentist, dentalServices, timeStart, appointmentDate, appointmentId) => {
		setAppointmentData({
			dentist: dentist.fullname,
			dentistId: dentist.dentistId,
			serviceSelected: dentalServices,
			serviceValue: "",
			timeStart: timeStart,
			appointmentDate: appointmentDate,
			appointmentId: appointmentId
		})
		setUpdate(true);
	};

	const statusSubmit = async (id, value) => {
		try {
			const response = await axios.put(`${APPOINTMENT_LINK}status/${id}`, value);
			if (response.data) {
				toastHandler("success", `${response.data.message}`);
				window.setTimeout(() => { window.location.reload(); }, 1500);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const cancelButton = (id) => {
		setStatus1({
			...status1,
			id: id
		})
		setCancelModal(true);
	};

	return (
		<>
			<div className='h-[550px] px-4 py-3 overflow-auto '>
				<ToastContainer limit={1} autoClose={1500} />

				<UpdateAppointmentModal show={update} setShow={setUpdate} setAppointmentData={setAppointmentData} appointmentData={appointmentData} />
				<CancelModal show={cancelModal} setShow={setCancelModal} status={status1} setStatus={setStatus1} />
				<ViewAppointment view={view} setView={setView} />

				<table className='w-full relative tracking-wide'>
					{/*Head*/}
					<thead className='bg-medium-gray'>
						<tr className="text-secondary">
							{
								tableHeaders.map((header, index) => (
									<>
										{
											header === "Status" ?
												<th className={`py-3 px-2 capitalize cursor-pointer`} key={index} onClick={() => setStatusValue({ ...statusValue, isClick: true })}>
													<p className={`${statusValue.isClick ? "hidden" : ""}`}>{header}</p>

													{
														statusValue.isClick ? <select className=' bg-transparent py-2 px-3 focus:outline-none ' value={statusValue.statusCode} onChange={(e) => {
															setStatusValue({
																...statusValue,
																isClick: false,
																statusCode: e.target.value
															})
														}}>
															<option value="">NONE</option>
															<option value="PENDING">PENDING</option>
															<option value="APPROVED">APPROVED</option>
															<option value="DONE">DONE</option>
														</select>
															: ""
													}
												</th>
												:
												<th className='py-3 px-2 capitalize' key={index}>{header}</th>
										}
									</>
								))
							}
						</tr>
					</thead>

					{/*Body*/}
					<tbody className='h-auto p-6 font-normal tracking-wide'>
						{
							results
								.filter((val) => { return statusValue.statusCode !== "" ? val.status === statusValue.statusCode : (val.status === "APPROVED" || val.status === "PENDING") })
								.slice((currentPage * 8) - 8, currentPage * 8)
								.map((result, index) => (
									<tr key={result.appointmentId} className={`text-center h-16 ${index % 2 == 0 ? '' : 'bg-light-gray'} py-4`}>
										<td>
											{result.patient.firstname} {result.patient.middlename ? result.patient.middlename.charAt(0).concat(".") : ""} {result.patient.lastname}
										</td>
										<td>
											{moment(result.dateSubmitted).format("LL")}
										</td>
										<td>
											{moment(result.appointmentDate).format("LL")}
										</td>
										<td>
											{moment(result.timeStart, 'HH:mm:ss').format('h:mm A')}
										</td>
										<td>
											{moment(result.timeEnd, 'HH:mm:ss').format('h:mm A')}
										</td>
										<td className='capitalize px-10'>
											{status.selectedId === result.appointmentId && result.status !== "CANCELLED" && result.status !== "DONE" ? (
												<select
													name="status"
													value={result.status}
													className='px-6 py-2 border border-primary focus:outline'
													onChange={(e) => {
														if (e.target.value === "CANCELLED") return cancelButton(result.appointmentId);
														const data = { status: e.target.value, description: "", }
														statusSubmit(result.appointmentId, data);
													}}
													onBlur={() => setStatus({ ...status, selectedId: null })}
												>
													<option value="PENDING" disabled>Pending</option>
													<option value="APPROVED" >Approved</option>
													{
														result.status === "APPROVED" ?
															<option value="DONE" >Done</option>
															: ""
													}
													<option value="CANCELLED" >Cancel</option>
												</select>
											) : (
												<p
													className={`${result.status === "PENDING" ? "bg-orange"
														: result.status === "APPROVED" ? "bg-green"
															: result.status === "DONE" ? "bg-primary"
																: "bg-red"
														} rounded-full text-white py-1 cursor-pointer`}
													onClick={() => {
														setStatus({
															selectedId: result.appointmentId,
															remarks: result.status,
															isSelected: true,
														})
													}
													}
												>
													{result.status.toLowerCase()}
												</p>
											)}
										</td>
										<td className=' text-center '>
											{
												result.doneReadingTC ?
													<input type="checkbox" className='h-5 w-5 rounded ' checked /> :
													<input type="checkbox" className='h-5 w-5 rounded' />
											}
										</td>
										<td className=' h-16 text-white flex gap-1 items-center justify-center text-center '>
											<p className='px-4 py-2 rounded-md bg-primary text-white cursor-pointer hover:shadow-md flex' onClick={() => updateButton(
												result.dentist,
												result.dentalServices,
												result.timeStart,
												result.appointmentDate,
												result.appointmentId
											)}><AiFillEdit size={25} />&nbsp;Update</p>
											<p className='px-4 py-2 rounded-md bg-red text-white cursor-pointer hover:shadow-md flex' onClick={() => deleteAppointment(result.appointmentId, result.status)}><AiFillDelete size={25} />&nbsp;Delete</p>
											<p
												className='px-4 py-2 rounded-md bg-medium-gray text-white cursor-pointer hover:shadow-md flex'
												onClick={() => {
													// setView({
													//     isShow: true,
													//     appointment: result
													// });
													navigate(`/admin/dashboard/appointment/details/${result.appointmentId}`)
												}}
											><AiOutlineFolderView size={25} />&nbsp;View</p>
										</td>
									</tr>
								))
						}
					</tbody>
				</table>
			</div>
		</>
	)
}

export default AppointmentTable