import axios from 'axios';
import React, { useState } from 'react';
import { SERVICES_LINK } from '../ApiLinks';
import { toastHandler } from '../ToastHandler';
import { ToastContainer } from 'react-toastify';

function ServicesModal({ show, setModal }) {
  const [services, setServices] = useState({
    name: "",
    type: "",
    description: "",
    duration: "00:30:00",
    price: 0
  });
  const serviceType = ['Oral Prophylaxis', 'Tooth Restoration', 'Cosmetics', 'Teeth Whitening', 'Oral Surgery', 'Odontectomy', 'Pedia Dentistry', 'Orthodontcs', 'None'];

  const handleOnChange = (e) => {
    const words = services.description.split(' ');
    if (words.length > 60) {
      return alert("Description should be less than 60 words")
    }
    setServices({ ...services, [e.target.name]: e.target.value })
  }

  const submitButton = async () => {
    try {
      if (!services.name || !services.type || !services.description || services.price === 0) return toastHandler("error", "Please fill up all empty fields");
      const response = await axios.post(SERVICES_LINK, services);
      if (response.data) {
        toastHandler("success", response.data.message);
        window.location.reload();
      }
    } catch (error) { toastHandler("error", error.response.data.message); }
  }

  const btnClose = () => {
    setServices({
      ...services,
      name: "",
      type: "",
      description: "",
      duration: "00:30:00",
      price: 0
    });
    setModal(false);
  }
  return (
    <div className={`w-full h-screen bg-modal bg-opacity-75 absolute top-0 z-40 flex justify-center items-center ${show ? '' : 'hidden'}`}>

      <ToastContainer limit={1} autoClose={1500} />

      <div className=" z-50">
        <div className="m-auto w-[500px] h-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-left py-4">
            <h2 className="text-xl font-bold">Add Service</h2>
            <div className='border border-light-gray my-4'></div>
            <form className=' flex flex-col '>

              <div className=' mb-2 flex flex-col gap-1 '>
                <label htmlFor="name" className='text-dark-gray font-medium'>Service Name</label>
                <input type="text" name='name' value={services.name} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'
                  onChange={(e) => handleOnChange(e)} />
              </div>

              <div className=' mb-2 flex flex-col gap-1 '>
                <label htmlFor="type" className='text-dark-gray font-medium'>Service Type</label>
                <select
                  name="type"
                  value={services.type}
                  className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'
                  onChange={(e) => handleOnChange(e)}
                >
                  <option value="" disabled >Select Service Type...</option>
                  {
                    serviceType.map((val, index) => (
                      <option
                        value={val}
                        key={index}
                        className='px-4 py-2 capitalize'
                      >{val}</option>
                    ))
                  }
                </select>
              </div>

              <div className=' mb-2 flex flex-col gap-1 '>
                <label htmlFor="description" className='text-dark-gray font-medium'>Service Description</label>
                <textarea type="text" name='description' value={services.description} className='resize-none px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'
                  onChange={(e) => handleOnChange(e)}
                />
              </div>

              <div className=' mb-2 flex flex-col gap-1 '>
                <label htmlFor="type" className='text-dark-gray font-medium'>Time Duration</label>
                <select
                  name="duration"
                  value={services.duration}
                  className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'
                  onChange={(e) => handleOnChange(e)}
                >
                  <option value="00:30:00">30 Min</option>
                  <option value="01:00:00">1 Hour</option>
                </select>
              </div>

              <div className=' mb-2 flex flex-col gap-1 '>
                <label htmlFor="price" className='text-dark-gray font-medium'>Service Price</label>
                <input type="price" name='price' value={services.price} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
            </form>
          </div>
          <div className="flex justify-end pt-2 gap-2">
            <button className="px-5 py-2 rounded-md bg-green text-white cursor-pointer hover:shadow-md"
              onClick={submitButton}
            >
              Add
            </button>
            <button className="px-5 py-2 rounded-md bg-red text-white cursor-pointer hover:shadow-md" onClick={btnClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesModal