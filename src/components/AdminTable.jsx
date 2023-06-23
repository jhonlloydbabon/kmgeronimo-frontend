import axios from 'axios';
import React, { useState } from 'react';
import { AiFillEdit, AiOutlineFolderView } from 'react-icons/ai';
import UpdateAdminModal from './UpdateAdminModal';

function AdminTable({ tableHeaders, results, search, currentPage }) {
	const [updateModel, setUpdateModal] = useState(false);
	const [adminInfo, setAdminInfo] = useState({
		userId: "",
		firstname: "",
		middlename: "",
		lastname: "",
		address: "",
		birthday: "",
		email: "",
		gender: "",
		contactNumber: "",
		profile: ""
	});

	const disableAccountBtn = async (id, disable) => {
		try {
			const newDisableInformation = { id: id, verified: disable };
			await axios.post(`http://localhost:8080/api/v1/admin/disable`, newDisableInformation, {
				headers: { Accept: 'application/json' },
			});
			alert(`Disable${disable ? '' : 'd'} Account Successfully!`);
			window.location.reload();
		}
		catch (err) {
			console.log(err);
		}
	};

	const update = (adminId, firstname, middlename, lastname, address, birthday, email, gender, contactNumber, profile) => {
		setAdminInfo({
			...adminInfo,
			userId: adminId,
			firstname: firstname,
			middlename: middlename,
			lastname: lastname,
			address: address,
			birthday: birthday,
			email: email,
			gender: gender,
			contactNumber: contactNumber,
			profile: profile
		})
		setUpdateModal(true);
	}

	return (
		<>
			<UpdateAdminModal show={updateModel} setModal={setUpdateModal} setAdminInfo={setAdminInfo} adminInfo={adminInfo} type="admin" />
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
									.filter((val) => { return val.role === "STAFF"; })
									.map((result, index) => (
										<tr className={`${index % 2 == 0 ? '' : 'bg-light-gray'}`} key={result.adminId}>
											<td className='p-2 text-center flex justify-center '>
												<img src={result.profile} className='w-11 h-11 rounded-full border-medium-gray border-2' alt="User" />
											</td>
											<td className=' text-center capitalize '>
												{`${result.firstname} ${result.middlename !== "" ? result.middlename.charAt(0).concat(".") : ''} ${result.lastname}`}
											</td>
											<td className='text-center'>
												{result.address}
											</td>
											<td className='text-center capitalize'>
												{result.gender}
											</td>
											<td className='text-center'>
												{result.contactNumber}
											</td>
											<td className='text-center'>
												{result.email}
											</td>
											<td className='text-center'>
												{result.role}
											</td>
											<td className=' text-center '>
												{result.enabled ?
													<p className='px-2 py-2 rounded-md bg-green text-white cursor-pointer hover:shadow-md' onClick={() => disableAccountBtn(result.adminId, false)}>Active</p> :
													<p className='px-2 py-2 rounded-md bg-red text-white cursor-pointer hover:shadow-md' onClick={() => disableAccountBtn(result.adminId, true)}>Inactive</p>
												}
											</td>
											<td className=' h-auto relative bottom-2 w-auto flex items-start justify-center gap-3 py-2'>
												<button className='px-5 py-2 rounded-md bg-primary text-white cursor-pointer hover:shadow-md flex' onClick={() => update(
													result.adminId,
													result.firstname,
													result.middlename,
													result.lastname,
													result.address,
													result.birthday,
													result.email,
													result.gender,
													result.contactNumber,
													result.profile
												)}>
													<AiFillEdit size={25} />&nbsp;Update
												</button>
												<button className='px-5 py-2 rounded-md bg-medium-gray text-white cursor-pointer hover:shadow-md flex'>
													<AiOutlineFolderView size={25} />&nbsp;View
												</button>
											</td>
										</tr>
									))
								: results
									//       firstItem         LastItem
									.slice((currentPage * 8) - 8, currentPage * 8)
									.filter((val) => { return val.role === "STAFF"; })
									.map((result, index) => (
										<tr className={`${index % 2 == 0 ? '' : 'bg-light-gray'}`} key={result.adminId}>
											<td className='p-2 text-center flex justify-center '>
												<img src={result.profile} className='w-11 h-11 rounded-full border-medium-gray border-2' alt="User" />
											</td>
											<td className=' text-center capitalize '>
												{`${result.firstname} ${!result.middlename ? "" : result.middlename.charAt(0).concat(".")} ${result.lastname}`}
											</td>
											<td className='text-center'>
												{result.address}
											</td>
											<td className='text-center capitalize'>
												{result.gender}
											</td>
											<td className='text-center'>
												{result.contactNumber}
											</td>
											<td className='text-center'>
												{result.email}
											</td>
											<td className='text-center'>
												{result.role}
											</td>
											<td className=' text-center '>
												{result.enabled ?
													<p className='px-2 py-2 rounded-md bg-green text-white cursor-pointer hover:shadow-md' onClick={() => disableAccountBtn(result.adminId, false)}>Active</p> :
													<p className='px-2 py-2 rounded-md bg-red text-white cursor-pointer hover:shadow-md ' onClick={() => disableAccountBtn(result.adminId, true)}>Inactive</p>
												}
											</td>
											<td className='relative bottom-2 w-auto flex items-center justify-center gap-3'>
												<button className='px-5 py-2 rounded-md bg-primary text-white cursor-pointer hover:shadow-md flex' onClick={() => update(
													result.adminId,
													result.firstname,
													result.middlename,
													result.lastname,
													result.address,
													result.birthday,
													result.email,
													result.gender,
													result.contactNumber,
													result.profile
												)}>
													<AiFillEdit size={25} />&nbsp;Update
												</button>
												<button className='px-5 py-2 rounded-md bg-medium-gray text-white cursor-pointer hover:shadow-md flex'>
													<AiOutlineFolderView size={25} />&nbsp;View
												</button>
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

export default AdminTable