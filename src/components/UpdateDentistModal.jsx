import axios from 'axios';
import React from 'react';
import { toastHandler } from '../ToastHandler';
import { ToastContainer } from 'react-toastify';

function UpdateDentistModal({ show, setModal, setData, data }) {

  const handleFormChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const handleProfile = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = e => {
        setData({ ...data, profile: e.target.result });
      }
    }
  }

  const submitData = async (newData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/v1/dentist/updatedentist/${data.dentistId}`, newData, {
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

  const isOver18 = (dob) => {
    const birthday = new Date(dob);
    const ageDiff = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDiff);
    const age = Math.abs(ageDate.getUTCFullYear - 1970);
    return age < 18;
  }

  const btnSubmit = () => {
    if (!data.fullname || !data.birthday || !data.address || !data.gender || !data.contactNumber || !data.email || !data.specialty) {
      return alert("Fill up empty field!");
    }
    const isLegalAge = isOver18(data.birthday);
    if (isLegalAge) return alert("Invalid Age!");
    const regex = /^09\d{9}$/;
    if (!regex.test(data.contactNumber)) {
      return alert("Contact number must be 11-digit and must start with 09");
    }

    const newData = {
      fullname: data.fullname,
      birthday: data.birthday,
      address: data.address,
      gender: data.gender,
      contactNumber: data.contactNumber,
      email: data.email,
      specialty: data.specialty,
      profile: data.profile
    }
    submitData(newData);
  }

  return (
    <div className={`w-full h-screen bg-modal bg-opacity-75 absolute top-0 z-40 flex flex-grow justify-center items-center ${show ? '' : 'hidden'}`}>
      <div className=" z-50">
        <div className="m-auto w-[550px] h-[700px] overflow-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-left py-2 mb-2 border-b-2 border-b-light-gray">
            <h2 className="text-xl font-bold mb-2">Update Dentist</h2>
          </div>

          <ToastContainer limit={1} autoClose={1500} />

          <form action="post" className=' grid grid-cols-2 gap-3 ' >
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="fullname">Fullname</label>
              <input type="text" name="fullname" value={data.fullname} placeholder='ex. John Dimaguiba' className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>

            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="birthday">Birthday</label>
              <input type="date" name="birthday" value={data.birthday} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>

            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="address">Address</label>
              <input type="text" name="address" value={data.address} placeholder='ex. 123 Sesame St., Malabon City' className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>

            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="gender">Gender</label>
              <select name="gender" value={data.gender} id="" className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)}>
                <option value="" hidden >Choose...</option>
                <option value="male" >Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="contactNumber">Contact Number</label>
              <input type="text" name="contactNumber" value={data.contactNumber} placeholder='ex. 09123456780' className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>

            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="email">Email</label>
              <input type="email" name="email" value={data.email} placeholder='ex. john@email.com' className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>

            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="specialty">Doctor Specialty</label>
              <input type="text" name="specialty" value={data.specialty} placeholder='ex. Oral surgery' className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>
          </form>

          <div className='flex flex-col mt-3 gap-2'>
            <p className='text-dark-gray font-medium' htmlFor="picture">Picture</p>
            <label class="text-sm">
              <input type="file" name="profile" accept='image/*' onChange={(e) => handleProfile(e)} class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-secondary hover:file:bg-subprimary" />
            </label>
          </div>

          <img src={data.profile} alt="Dentist" className=' mt-5 w-52 h-52 object-cover aspect-auto' />

          <div className='mt-3 pt-4 flex justify-end gap-2 border-t-2 border-t-light-gray'>
            <button className='px-6 py-2 bg-green text-white rounded-md hover:shadow-lg' onClick={btnSubmit} >Save Changes</button>
            <button className='px-6 py-2 bg-red text-white rounded-md hover:shadow-lg' onClick={() => setModal(false)} >Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateDentistModal;