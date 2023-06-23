import axios from 'axios';
import React from 'react';
import { toastHandler } from '../ToastHandler';
import { ToastContainer } from 'react-toastify';

function UpdateAdminModal({ show, setModal, setAdminInfo, adminInfo, type }) {
  const handleFormChange = (e) => {
    setAdminInfo({
      ...adminInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleProfile = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = e => {
        setAdminInfo({ ...adminInfo, profile: e.target.result });
      }
    }
  }

  const isOver18 = (dob) => {
    const birthday = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthday.getFullYear();
    return age >= 18;
  };

  const btnSubmit = async () => {
    const isLegalAge = isOver18(adminInfo.birthday);

    try {
      if (
        !adminInfo.firstname ||
        !adminInfo.lastname ||
        !adminInfo.birthday ||
        !adminInfo.address ||
        !adminInfo.gender ||
        !adminInfo.contactNumber ||
        !adminInfo.email
      ) {
        toastHandler("error", "Please fill up all empty fields");
        return false;
      }

      if (isLegalAge === false) {
        toastHandler("error", "18 years old and up only");
        return false;
      }

      const regex = /^09\d{9}$/;
      if (!regex.test(adminInfo.contactNumber)) {
        toastHandler("error", "Contact number must be 11-digit and must start with 09");
        return false;
      }

      if (!adminInfo.email.includes("@")) {
        toastHandler("error", "Email address must have @");
        return false;
      }

      const data = {
        firstname: adminInfo.firstname,
        middlename: adminInfo.middlename,
        lastname: adminInfo.lastname,
        address: adminInfo.address,
        birthday: adminInfo.birthday,
        email: adminInfo.email,
        gender: adminInfo.gender,
        contactNumber: adminInfo.contactNumber,
        profile: adminInfo.profile,
      };

      const response = await axios.put(
        `http://localhost:8080/api/v1/${type}/update/${adminInfo.userId}`,
        data,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (response.data) {
        toastHandler("success", "User updated successfully");
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={`w-full h-screen bg-modal bg-opacity-75 absolute top-0 z-40 flex flex-grow justify-center items-center ${show ? '' : 'hidden'}`}>
      <div className=" z-50">
        <div className="m-auto w-[550px] h-[700px] overflow-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-left py-2 mb-2 border-b-2 border-b-light-gray">
            <h2 className="text-xl font-bold capitalize mb-2">{`Update ${type}`}</h2>
          </div>

          <ToastContainer limit={1} autoClose={1500} />

          <form action="post" className='grid grid-cols-2 gap-3 ' >
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="firstname">First Name</label>
              <input type="text" name="firstname" id='firstname' value={adminInfo.firstname} placeholder='ex. John' className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="middlename">Middle Name</label>
              <input type="text" name="middlename" id='middlename' value={adminInfo.middlename} placeholder='ex. Cruz' className=' px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md ' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="lastname">Last Name</label>
              <input type="text" name="lastname" id='lastname' value={adminInfo.lastname} placeholder='ex. Dimaguiba' className=' px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md ' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="birthday">Birthday</label>
              <input type="date" name="birthday" id='birthday' value={adminInfo.birthday} className=' px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md ' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="address">Address</label>
              <input type="text" name="address" id='address' value={adminInfo.address} placeholder='ex. 123 Sesame St., Malabon City' className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="gender">Gender</label>
              <select name="gender" id='gender' value={adminInfo.gender} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)}>
                <option value="male" >Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="contactNumber">Contact Number</label>
              <input type="text" name="contactNumber" id='contactNumber' maxLength={11} value={adminInfo.contactNumber} placeholder='ex. 09123456780' className=' px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md ' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="email">Email</label>
              <input type="email" name="email" id='email' value={adminInfo.email} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' placeholder='ex. john@email.com' onChange={(e) => handleFormChange(e)} />
            </div>
          </form>

          <div className='flex flex-col mt-3 gap-2'>
            <p className='text-dark-gray font-medium' htmlFor="picture">Picture</p>
            <label class="text-sm">
              <input type="file" name="profile" accept='image/*' onChange={(e) => handleProfile(e)} class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-secondary hover:file:bg-subprimary" />
            </label>
          </div>

          <img src={adminInfo.profile} alt="Dentist" className='mt-5 w-52 h-52 object-cover aspect-auto ' />

          <div className='mt-3 pt-4 flex justify-end gap-2 border-t-2 border-t-light-gray'>
            <button className='px-6 py-2 bg-green text-white rounded-md hover:shadow-lg' onClick={btnSubmit}>Save Changes</button>
            <button className='px-6 py-2 bg-red text-white rounded-md hover:shadow-lg' onClick={() => setModal(false)}>Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateAdminModal