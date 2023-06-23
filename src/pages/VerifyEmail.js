import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toastHandler } from '../ToastHandler';
import { ToastContainer } from 'react-toastify';

function VerifyEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const btnSentEmail = async () => {
    const formData = new FormData();
    formData.append("email", email);
    try {
      const response = await axios.post("http://localhost:8080/api/v1/admin/verifyemail", formData);
      if (response.data) {
        toastHandler("success", response.data.message);
      }
    }
    catch (err) { toastHandler("warning", err.response.data.message); }
  }
  return (
    <div className=" w-full h-screen bg-gray-100 flex justify-center items-center flex-col">
      <div className=' w-[450px] text-gray-800 p-4 text-center flex flex-col justify-center gap-5 '>

        <ToastContainer limit={1} autoClose={1500} />

        <h1 className='text-primary text-4xl font-bold '>Forgot password</h1>
        <h2 className='text-dark-gray'>Resseting your password is easy. Just type your email, and we will send you email to reset your password</h2>

        <div className=' w-full mt-16 flex flex-col items-start justify-start gap-y-5 '>
          <input type="email" name="adminEmail" value={email} className='p-4 outline-none text-dark-gray border-light-gray border focus:shadow-md focus:border-primary rounded-md w-full' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
          <button className='text-xl w-full bg-primary py-3 text-white rounded-md hover:bg-subprimary tracking-widest' onClick={btnSentEmail}>Send</button>
        </div>
        <p className=' mt-5 text-dark-gray'>Did you remember your password? <span className=' text-primary font-medium cursor-pointer ' onClick={() => navigate("/")}>Login</span></p>

      </div>
    </div>
  )
}

export default VerifyEmail;