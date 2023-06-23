import axios from 'axios';
import React, { useState } from 'react';
import { toastHandler } from '../ToastHandler';
import { ToastContainer } from 'react-toastify';

function DenstistModal({ show, setModal }) {
  const [dentistInfo, setDentistInfo] = useState({
    fullname: "",
    birthday: "",
    address: "",
    gender: "",
    contactNumber: "",
    email: "",
    specialty: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [profile, setProfile] = useState("");

  const handleFormChange = (e) => {
    setDentistInfo({
      ...dentistInfo,
      [e.target.name]: e.target.value
    })
  }

  const handleProfile = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = e => {
        setProfile(e.target.result);
      }
    }
  }

  const submitData = async (data) => {
    try {
      const response = await axios.post("http://localhost:8080/api/v1/dentist/register", data, {
        headers: { Accept: "application/json", }
      });
      if (response.data) {
        toastHandler("success", "Account created!");
        window.location.reload();
      }
    } catch (err) { console.log(err); };
  }

  const isOver18 = (dob) => {
    const birthday = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthday.getFullYear();
    return age >= 18;
  };

  const btnSubmit = () => {
    const validateForm = () => {
      const isLegalAge = isOver18(dentistInfo.birthday);

      if (!dentistInfo.fullname || !dentistInfo.birthday || !dentistInfo.address || !dentistInfo.gender || !dentistInfo.contactNumber || !dentistInfo.email || !dentistInfo.specialty || !dentistInfo.username || !dentistInfo.password || !dentistInfo.confirmPassword || !profile) {
        toastHandler("error", "Please fill up all empty fields");
        return false;
      }

      if (dentistInfo.password !== dentistInfo.confirmPassword) {
        toastHandler("error", "Mismatch password and confirm password");
        return false;
      }

      if (isLegalAge === false) {
        toastHandler("error", "18 years old and up only");
        return false;
      }

      const regex = /^09\d{9}$/;
      if (!regex.test(dentistInfo.contactNumber)) {
        toastHandler("error", "Contact number must be 11-digit and must start with 09");
        return false;
      }

      if (!dentistInfo.email.includes("@")) {
        toastHandler("error", "Email address must have @");
        return false;
      }

      return true;
    }

    const submitForm = () => {
      const data = { ...dentistInfo, profile };
      submitData(data);
    }

    if (validateForm()) {
      submitForm();
    }
  }

  return (
    <div className={`w-full h-screen bg-modal bg-opacity-75 absolute top-0 z-40 flex flex-grow justify-center items-center ${show ? '' : 'hidden'}`}>
      <div className=" z-50">
        <div className="m-auto w-[550px] h-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-left py-2 mb-2 border-b-2 border-b-light-gray">
            <h2 className="text-xl font-bold mb-2">Add Dentist</h2>
          </div>

          <ToastContainer limit={1} autoClose={1500} />

          <form action="post" className='grid grid-cols-2 gap-3 ' >
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="fullname">Full Name</label>
              <input id="fullname" type="text" name="fullname"  value={dentistInfo.fullname} placeholder='ex. John Dimaguiba' className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>

            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="birthday">Birthday</label>
              <input id='birthday' type="date" name="birthday" value={dentistInfo.birthday} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>

            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="address">Address</label>
              <input id='address' type="text" name="address" value={dentistInfo.address} placeholder='ex. 123 Sesame St., Malabon City' className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md ' onChange={(e) => handleFormChange(e)} />
            </div>
            
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="gender">Gender</label>
              <select id='gender' name="gender" value={dentistInfo.gender} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)}>
                <option value="" hidden >Choose...</option>
                <option value="male" >Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="contactNumber">Contact Number</label>
              <input id='contactNumber' type="text" name="contactNumber" maxLength={11} value={dentistInfo.contactNumber} placeholder='ex. 09123456780' className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="email">Email</label>
              <input id='email' type="email" name="email" value={dentistInfo.email} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' placeholder='ex. john@email.com' onChange={(e) => handleFormChange(e)} />
            </div>

            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="specialty">Doctor Specialty</label>
              <input id='specialty' type="text" name="specialty" value={dentistInfo.specialty} placeholder='ex. Oral surgery' className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>

            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="username">Username</label>
              <input id='username' type="text" name="username" value={dentistInfo.username} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>

            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="password">Password</label>
              <input id='password' type="password" name="password" value={dentistInfo.password} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>

            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="confirmPassword">Confirm Password</label>
              <input id='confirmPassword' type="password" name="confirmPassword" value={dentistInfo.confirmPassword} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>

            <div className="flex my-3 flex-col gap-2">
            <p className='text-dark-gray font-medium' htmlFor="picture">Picture</p>
              <label class="text-sm">
                <span class="sr-only">Choose profile photo</span>
                <input type="file" name="profile" accept='image/*' onChange={handleProfile} class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-secondary hover:file:bg-subprimary" />
              </label>
            </div>
          </form>

          <div className='mt-2 pt-4 flex justify-end gap-2 border-t-2 border-t-light-gray'>
            <button className='px-6 py-2 bg-green text-white rounded-md hover:shadow-lg' onClick={btnSubmit}>Add</button>
            <button className='px-8 py-2 bg-red text-white rounded-md hover:shadow-lg' onClick={() => setModal(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DenstistModal