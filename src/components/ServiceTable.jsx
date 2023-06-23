import React, { useState } from 'react';
import { AiFillEdit, AiFillDelete } from 'react-icons/ai';
import UpdateServicesModal from './UpdateServicesModal';
import axios from 'axios';
import { SERVICES_LINK } from '../ApiLinks';

function ServiceTable({ tableHeaders, results, search, currentPage }) {
	const [update, setUpdateModal] = useState(false);
	const [data, setData] = useState({
		serviceId: "",
		name: "",
		type: "",
		description: "",
		duration: "00:30:00",
		price: 0
	});

	const disableAccountBtn = async (id, disable) => {
		try {
			const newDisableInformation = { id: id, verified: disable };
			await axios.post(`${SERVICES_LINK}disable`, newDisableInformation, {
				headers: { Accept: 'application/json' },
			});
			alert(`Disable${disable ? '' : 'd'} Account Successfully!`);
			window.location.reload();
		}
		catch (err) {
			console.log(err);
		}
	};

	const deleteButton = async (id) => {
		try {
			const response = await axios.delete(SERVICES_LINK + `${id}`)
			if (response.data) {
				alert(response.data.message);
				window.location.reload();
			}
		} catch (error) {
			console.log(error);
		}
	}

	const updateBtn = (serviceId, name, type, description, duration, price) => {
		setData({
			...data,
			serviceId: serviceId,
			name: name,
			type: type,
			description: description,
			duration: duration,
			price: price,
		})
		setUpdateModal(true);
	}

	return (
		<>
			<UpdateServicesModal show={update} setModal={setUpdateModal} setData={setData} data={data} />
			<div className=' h-[550px] px-4 py-3 overflow-auto '>

				<table className='w-full tracking-wide'>
					{/*Head*/}
					<thead className='bg-medium-gray'>
						<tr className="text-secondary">
							{
								tableHeaders.map((header, index) => (
									<th className='py-3 px-2 capitalize' key={index}>{header}</th>
								))
							}
						</tr>
					</thead>

					{/*Body*/}
					<tbody className='h-auto p-6 font-normal'>
						{
							search.length > 0 ?
								results
									.map((result, index) => (
										<tr className={`${index % 2 == 0 ? '' : 'bg-light-gray'} py-4 mt-2`} key={result.serviceId}>
											<td className=' text-center capitalize '>
												{result.name}
											</td>
											<td className='text-center capitalize'>
												{result.type}
											</td>
											<td className='text-center'>
												{result.duration === "00:30:00" ? "30 Min" : "1 Hour"}
											</td>
											<td className='text-center'>
												{result.price}
											</td>
											<td className='text-center'>
												{
													result.isAvailable ?
														<p
															className='px-6 py-2 rounded-md bg-red text-white cursor-pointer hover:shadow-md max-w-max m-auto'
															onClick={() => disableAccountBtn(result.serviceId, false)}
														>
															Disable
														</p>
														: <p
															className='px-6 py-2 rounded-md bg-green text-white cursor-pointer hover:shadow-md max-w-max m-auto'
															onClick={() => disableAccountBtn(result.serviceId, true)}
														>
															Available
														</p>
												}
											</td>
											<td className='h-auto relative w-auto flex items-end justify-center gap-3 py-2'>
												<p className='px-5 py-2 rounded-md bg-primary text-white cursor-pointer hover:shadow-md flex' onClick={() => updateBtn(
													result.serviceId,
													result.name,
													result.type,
													result.description,
													result.duration,
													result.price
												)}><AiFillEdit size={25} />&nbsp;Update</p>
												<p className='px-5 py-2 rounded-md bg-red text-white cursor-pointer hover:shadow-md flex' onClick={() => deleteButton(result.serviceId)}><AiFillDelete size={25} />&nbsp;Delete</p>
											</td>
										</tr>))
								: results
									//       firstItem         LastItem
									.slice((currentPage * 8) - 8, currentPage * 8)
									.map((result, index) => (
										<tr className={`${index % 2 == 0 ? '' : 'bg-light-gray'} py-4 mt-2`} key={result.serviceId}>
											<td className=' text-center capitalize '>
												{result.name}
											</td>
											<td className='text-center capitalize'>
												{result.type}
											</td>
											<td className='text-center'>
												{result.duration === "00:30:00" ? "30 Min" : "1 Hour"}
											</td>
											<td className='text-center'>
												{result.price}
											</td>
											<td className='text-center'>
												{
													result.isAvailable ?
														<p
															className='px-6 py-2 rounded-md bg-red text-white cursor-pointer hover:shadow-md max-w-max m-auto'
															onClick={() => disableAccountBtn(result.serviceId, false)}
														>
															Disable
														</p>
														: <p
															className='px-6 py-2 rounded-md bg-green text-white cursor-pointer hover:shadow-md max-w-max m-auto'
															onClick={() => disableAccountBtn(result.serviceId, true)}
														>
															Available
														</p>
												}
											</td>
											<td className=' h-auto relative w-auto flex items-end justify-center gap-3 py-2'>
												<p className='px-5 py-2 rounded-md bg-primary text-white cursor-pointer hover:shadow-md flex' onClick={() => updateBtn(
													result.serviceId,
													result.name,
													result.type,
													result.description,
													result.duration,
													result.price
												)}><AiFillEdit size={25} />&nbsp;Update</p>
												<p className='px-5 py-2 rounded-md bg-red text-white cursor-pointer hover:shadow-md flex' onClick={() => deleteButton(result.serviceId)}><AiFillDelete size={25} />&nbsp;Delete</p>
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

export default ServiceTable