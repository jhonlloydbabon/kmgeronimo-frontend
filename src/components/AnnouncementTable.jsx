import React, { useState } from 'react';
import Update from './UpdateAnnouncement';
import axios from 'axios';
import { ANNOUNCEMENT_LINK } from '../ApiLinks';
import { ToastContainer, toast } from 'react-toastify';


function AnnouncementTable({ tableHeaders, results, search, currentPage }) {
    const [details, setDetails] = useState(null);
    const [update, setUpdate] = useState(false);

    const deleteAnnouncement = async (id) => {
        try {
            const response = await axios.delete(`${ANNOUNCEMENT_LINK}${id}`)
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
        } catch (error) {
            console.log(error);
        }
    }

    const disableAccountBtn = async (id, disable) => {
        try {

            const newDisableInformation = { id: id, verified: disable };
            await axios.put(`${ANNOUNCEMENT_LINK}disable`, newDisableInformation, {
                headers: { Accept: 'application/json' },
            });
            toast.success(`Disable${disable ? '' : 'd'} Account Successfully!}`, {
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
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className=' h-[550px] px-4 py-3 overflow-auto '>
            <ToastContainer />
            <Update show={update} setModal={setUpdate} details={details} setDetails={setDetails} />
            <table className='w-full tracking-wide table-fixed '>
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
                <tbody className='h-auto p-6'>
                    {
                        results.map((val, index) => (
                            <tr key={val.announcementId} className={`${index % 2 == 0 ? '' : 'bg-light-gray'}`} >
                                <td className='p-2 text-center flex justify-center '>
                                    <img src={val.picture} className='w-11 h-11 rounded-full border-2 border-medium-gray' alt="User" />
                                </td>
                                <td className=' text-center capitalize '>
                                    {val.title}
                                </td>
                                <td className='text-center'>
                                    {val.description}
                                </td>
                                <td className='text-center capitalize'>
                                    {val.type.toLowerCase()}
                                </td>
                                <td className=' text-center '>
                                    {
                                        val.isAvailable ?
                                            <p className='px-6 py-2 rounded-md bg-red text-white cursor-pointer hover:shadow-md max-w-max m-auto' onClick={() => { disableAccountBtn(val.announcementId, false) }} >Disabled</p> :
                                            <p className='px-6 py-2 rounded-md bg-green text-white cursor-pointer hover:shadow-md max-w-max m-auto' onClick={() => { disableAccountBtn(val.announcementId, true) }}>Enabled</p>
                                    }
                                </td>
                                <td className=' h-auto relative bottom-2 w-auto flex items-start justify-center gap-3'>
                                    <button className='px-2 py-2 rounded-md bg-primary text-white cursor-pointer hover:shadow-md' onClick={() => {
                                        setDetails({
                                            ...details,
                                            id: val.announcementId,
                                            title: val.title,
                                            type: val.type,
                                            description: val.description,
                                            picture: val.picture
                                        })
                                        setUpdate(true)
                                    }}>
                                        Update
                                    </button>
                                    <button className='px-2 py-2 rounded-md bg-red text-white cursor-pointer hover:shadow-md'
                                        onClick={() => { deleteAnnouncement(val.announcementId) }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default AnnouncementTable