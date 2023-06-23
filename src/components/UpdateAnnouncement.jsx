import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { ANNOUNCEMENT_LINK } from '../ApiLinks';

function UpdateAnnouncement({ show, setModal, details, setDetails }) {
	const [picture, setPicture] = useState("");
	const profile = useRef();

	const handleOnChange = (e) => {
		setDetails({
			...details,
			[e.target.name]: e.target.value
		})
	}

	const handlePicture = (e) => {
		const reader = new FileReader();
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0]);
			reader.onload = (e) => {
				setPicture(e.target.result);
			}
		}
	}

	const insertDetails = async (data) => {
		try {
			const response = await axios.put(`${ANNOUNCEMENT_LINK}${data.id}`, data, {
				headers: { Accept: "application/json", }
			});
			if (response.data) {
				toast.success(`${response.data.message}`, {
					position: "top-right",
					autoClose: 1500,
					hideProgressBar: false,
					pauseOnHover: false,
					closeOnClick: false,
					draggable: false,
					progress: undefined,
					theme: "colored",
				});

				window.setTimeout(() => {
					window.location.reload();
				}, 1500)
			}
		} catch (error) { console.log(error.response); }
	}

	const submitButton = () => {
		if (!details.title || !details.type || !details.description || !picture) {
			return toast.error(`Fill up empty field!`, {
				position: "top-right",
				autoClose: 1500,
				hideProgressBar: false,
				pauseOnHover: false,
				closeOnClick: false,
				draggable: false,
				progress: undefined,
				theme: "colored",
			});
		} else {
			const data = { ...details, picture }
			insertDetails(data);
		}

	}
	return (
		<>
			{
				details && (
					<div className={`w-full h-screen bg-modal bg-opacity-75 absolute top-0 z-40 flex flex-grow justify-center items-center ${show ? '' : 'hidden'}`}>

						<ToastContainer limit={1} autoClose={1500} />

						<div className=" z-50">
							<div className="m-auto w-[550px] h-auto overflow-auto p-8 bg-white rounded-lg shadow-lg">
								<div className="text-left py-2 mb-2 border-b-2 border-b-light-gray">
									<h2 className="text-xl font-bold capitalize mb-2">Update Announcement</h2>
								</div>

								<form action="post" className='grid grid-cols-1 gap-3'>
									<div className='flex flex-col'>
										<label className='text-dark-gray font-medium' htmlFor="title">Title</label>
										<input type="text" name="title" value={details.title} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={handleOnChange} />
									</div>

									<div className='flex flex-col'>
										<label className='text-dark-gray font-medium' htmlFor="title">Type</label>
										<select name='type' className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' value={details.type} onChange={handleOnChange} >
											<option value="" disabled>Select type...</option>
											<option value="PROMO">Promo</option>
											<option value="NEWS">News</option>
										</select>
									</div>

									<div className=' w-full mb-2 flex flex-col gap-1'>
										<label className='text-dark-gray font-medium' htmlFor="description">Description</label>
										<textarea type="text" name='description' className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md resize-none' value={details.description} onChange={handleOnChange} />
									</div>

									<div className=' w-full mb-2 flex flex-col gap-2'>
										<p className='text-dark-gray font-medium' htmlFor="picture">Picture</p>
										<label class="text-sm">
											<span class="sr-only">Image</span>
											<input type="file" name="profile" accept='image/*' ref={profile} onChange={handlePicture} class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-secondary hover:file:bg-subprimary" />
										</label>
									</div>

									{
										details.picture && (
											<img src={!picture ? details.picture : picture} alt='announcement' className=' w-52 h-52 object-cover aspect-auto' />
										)
									}
								</form>

								<div className="mt-3 pt-4 flex justify-end gap-2 border-t-2 border-t-light-gray">
									<button className="px-6 py-2 bg-green text-white rounded-md hover:shadow-lg"
										onClick={submitButton}
									>
										Save Changes
									</button>
									<button className="px-6 py-2 bg-red text-white rounded-md hover:shadow-lg" onClick={() => {
										setDetails({
											...details,
											title: "",
											type: "",
											description: ""
										});
										setPicture("");
										profile.current.value = ""
										setModal(false);
									}} >
										Close
									</button>
								</div>
							</div>
						</div>
					</div>
				)
			}
		</>
	)
}

export default UpdateAnnouncement