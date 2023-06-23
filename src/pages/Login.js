import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.jpg';
import { FaUser } from 'react-icons/fa';
import { BsFillKeyFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toastHandler } from '../ToastHandler';
import { ToastContainer } from 'react-toastify';

function Login() {
  const [account, setAccount] = useState({
    username: "",
    password: ""
  });
  const [result, setResult] = useState({
    status: false,
    message: ""
  })
  const navigate = useNavigate();
  useEffect(() => { localStorage.removeItem("token") }, []);
  const handleOnChange = (e) => { setAccount({ ...account, [e.target.name]: e.target.value }); }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (account.username === "" || account.password === "") return modifyResult(false, "Please fill up empty field");

    const formData = new FormData();
    formData.append("username", account.username);
    formData.append("password", account.password);
    fetchAccount(formData);
  }

  const fetchAccount = async (formData) => {
    try {
      const response = await axios.post("http://localhost:8080/api/v1/admin/login", formData, {
        headers: { Accept: "application/json" }
      })
      modifyResult(response.data.status, response.data.message)
      if (response.data.status) {
        localStorage.setItem("token", response.data.message);
        navigate("/admin/dashboard")
      }
    }
    catch (err) { console.log(err); }
  }
  const modifyResult = (s, m) => {
    toastHandler("error", m);
    return setResult(prev => ({ ...prev, status: s, message: m }))
  }
  return (
    <div className='w-full h-screen bg-white flex flex-col justify-center items-center gap-5'>
      <div className='px-4 py-8 rounded-md shadow-lg bg-white flex flex-col gap-4'>
        <img src={logo} alt='Dental logo' width={450} />

        <ToastContainer limit={1} autoClose={1500} />

        <form className='flex flex-col gap-5 p-3 w-full'>
          <div className='py-1 px-4 flex w-full items-center'>
            <div className='relative w-full'>
              <FaUser size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-dark-gray' />
              <input
                type='text'
                name='username'
                value={account.username}
                onChange={(e) => handleOnChange(e)}
                placeholder='Username'
                className='p-4 pl-10 outline-none text-dark-gray border-light-gray border focus:shadow-md focus:border-primary rounded-md w-full'
              />
            </div>
          </div>

          {/*Password*/}
          <div className='py-1 px-4 flex w-full items-center'>
            <div className='relative w-full'>
              <BsFillKeyFill size={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-dark-gray' />
              <input
                type='password'
                name='password'
                value={account.password}
                onChange={(e) => handleOnChange(e)}
                placeholder='Password'
                className='p-4 pl-10 outline-none text-dark-gray border-light-gray border focus:shadow-md focus:border-primary rounded-md w-full'
              />
            </div>
          </div>

          <div className='py-1 px-4'>
            <p
              className=' text-primary font-medium text-base cursor-pointer max-w-max hover:text-darkprimary'
              onClick={() => navigate("/recoveraccount")}>
              Forgot password?
            </p>
          </div>

          <div className='w-full py-1 px-4'>
            <input
              type='submit'
              value='Login'
              onClick={(e) => handleSubmit(e)}
              className=' w-full bg-primary hover:bg-subprimary font-semibold p-4 text-white rounded-md cursor-pointer tracking-widest uppercase hover:shadow-md ' />
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login