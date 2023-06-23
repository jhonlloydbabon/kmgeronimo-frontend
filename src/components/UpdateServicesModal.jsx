import axios from 'axios';
import React from 'react';
import { SERVICES_LINK } from '../ApiLinks';

function UpdateServicesModal({ show, setModal, setData, data }) {
  const serviceType = ['oral prophylaxis', 'tooth restoration', 'cosmetics', 'teeth whitening', 'oral surgery', 'odontectomy', 'pedia dentistry', 'Orthodontcs', 'none'];
  const handleFormChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const submitData = async () => {
    try {
      const response = await axios.put(`${SERVICES_LINK}${data.serviceId}`, data, {
        headers: { Accept: "application/json", }
      });
      if (response.data) {
        alert(response.data.message);
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    };
  }

  const btnSubmit = async () => {
    if (!data.name || !data.type || !data.description || data.price === 0) return alert("Fill up empty field.")
    submitData();
  }
  return (
    <div className={`w-full h-screen bg-modal bg-opacity-75 absolute left-0 top-0 z-40 flex justify-center items-center ${show ? '' : 'hidden'}`}>
      <div className=" z-50">
        <div className="m-auto w-[500px] h-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-left py-4">
            <h2 className="text-xl font-bold mb-2">Update Service</h2>
            <hr /><br />
            <form className=' flex flex-col '>

              <div className=' mb-2 flex flex-col gap-1 '>
                <label htmlFor="name" className='text-dark-gray font-medium'>Service Name</label>
                <input type="text" name='name' value={data.name} className=' px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md focus:outline-none'
                  onChange={(e) => handleFormChange(e)} />
              </div>
              <div className=' mb-2 flex flex-col gap-1 '>
                <label htmlFor="type" className='text-dark-gray font-medium'>Service Type</label>
                <select
                  name="type"
                  value={data.type}
                  className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md capitalize '
                  onChange={(e) => handleFormChange(e)}
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
                <textarea type="text" name='description' value={data.description} className=' px-4 py-2 text-sm outline-none border-light-gray border focus:border-primary rounded-md focus:shadow-md resize-none '
                  onChange={(e) => handleFormChange(e)}
                />
              </div>
              <div className=' mb-2 flex flex-col gap-1 '>
                <label htmlFor="type" className='text-dark-gray font-medium'>Time Duration</label>
                <select
                  name="duration"
                  value={data.duration}
                  className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md capitalize '
                  onChange={(e) => handleFormChange(e)}
                >
                  <option value="00:30:00">30 Min</option>
                  <option value="01:00:00">1 Hour</option>
                </select>
              </div>
              <div className=' mb-2 flex flex-col gap-1 '>
                <label htmlFor="price" className='text-dark-gray font-medium'>Service Price</label>
                <input type="price" name='price' value={data.price} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'
                  onChange={(e) => handleFormChange(e)}
                />
              </div>
            </form>
          </div>
          <div className="flex justify-end pt-2 gap-2">
            <button className="px-5 py-2 rounded-md bg-green text-white cursor-pointer hover:shadow-md"
              onClick={btnSubmit}
            >
              Update service
            </button>
            <button className="px-5 py-2 rounded-md bg-red text-white cursor-pointer hover:shadow-md" onClick={() => setModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateServicesModal;