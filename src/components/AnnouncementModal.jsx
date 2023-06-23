import axios from 'axios';
import React, { useState, useRef } from 'react';
import { ANNOUNCEMENT_LINK } from '../ApiLinks';
import { toastHandler } from '../ToastHandler';
import { ToastContainer } from 'react-toastify';

function AnnouncementModal({ show, setModal }) {
  const [details, setDetails] = useState({
    title: "",
    type: "",
    description: ""
  });

  const [picture, setPicture] = useState("");
  const profile = useRef();

  const insertDetails = async (data) => {
    try {
      const response = await axios.post(`${ANNOUNCEMENT_LINK}`, data, {
        headers: { Accept: "application/json", }
      });
      if (response.data) {
        toastHandler("success", response.data.message);

        window.setTimeout(() => {
          window.location.reload();
        }, 1500)
      }
    } catch (error) { console.log(error.response); }
  }

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

  const submitButton = (e) => {
    let successAll = false;

    if (!details.title || !details.type || !details.description || !profile) {
      successAll = false;
    }
    else {
      successAll = true;
    }

    if (!successAll) {
      toastHandler("error", "Please fill up all empty fields");
      return false;
    }
    else {
      submitData();
    }
  }

  const submitData = () => {
    const data = { ...details, picture }
    return insertDetails(data);
  }

  return (
    <div className={` w-full h-screen bg-modal bg-opacity-75 absolute top-0 z-40 flex flex-grow justify-center items-center ${show ? '' : 'hidden'}`}>
      <div className=" z-50">
        <div className="m-auto w-[550px] h-auto overflow-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-left py-2 mb-2 border-b-2 border-b-light-gray">
            <h2 className="text-xl font-bold capitalize mb-2">Add Announcement</h2>
          </div>

          <ToastContainer limit={1} autoClose={1500} />

          <form action="post" className='grid grid-cols-1 gap-3'>
            <div className='flex flex-col'>
              <label htmlFor="title" className='text-dark-gray font-medium'>Title</label>
              <input type="text" id='title' name="title" value={details.title} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md ' onChange={handleOnChange} />
            </div>

            <div className='flex flex-col'>
              <label htmlFor="type" className='text-dark-gray font-medium'>Type</label>
              <select name='type' id="type" className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md ' value={details.type} onChange={handleOnChange} >
                <option value="" disabled>Select type...</option>
                <option value="PROMO">Promo</option>
                <option value="NEWS">News</option>
              </select>
            </div>

            <div className=' w-full mb-2 flex flex-col gap-1'>
              <label htmlFor="description" className='text-dark-gray font-medium'>Description</label>
              <textarea type="text" name='description' id='description' className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md resize-none' value={details.description} onChange={handleOnChange} />
            </div>

            <div className=' w-full mb-2 flex flex-col gap-2'>
              <p className='text-dark-gray font-medium' htmlFor="picture">Upload an image (optional)</p>
              <label class="text-dark-gray font-medium">
                <span class="sr-only">Picture</span>
                <input type="file" name="picture" ref={profile} class="lock w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-secondary hover:file:bg-subprimary" accept='image/*' onChange={handlePicture} />
              </label>
            </div>
            {
              picture && (
                <img src={picture} alt='announcement' className=' w-52 h-52 object-cover aspect-auto' />
              )
            }
            <hr />
          </form>
          <div className="flex justify-end pt-2 gap-2">
            <button className="px-6 py-2 bg-green text-white rounded-md hover:shadow-lg"
              onClick={(e) => submitButton(e.target)}
            >
              Add
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
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementModal