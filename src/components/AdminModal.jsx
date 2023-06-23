import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoAddSharp, IoRemoveOutline } from 'react-icons/io5';
import { toastHandler } from '../ToastHandler';
import { ToastContainer } from 'react-toastify';

function AdminModal({ show, setModal, type }) {
  const [adminInfo, setAdminInfo] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    birthday: "",
    address: "",
    gender: "",
    contactNumber: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    haveInsurance: "no"
  });

  const [profile, setProfile] = useState("");
  const [numberOfComponents, setNumberOfComponents] = useState(1);
  const [insuranceInfo, setInsuranceInfo] = useState([{ card: "", cardNumber: "", company: "" }]);

  const handleInsuranceChange = (e, index) => {
    const { name, value } = e.target;
    const updatedInsurance = [...insuranceInfo];
    updatedInsurance[index] = { ...updatedInsurance[index], [name]: value };
    setInsuranceInfo(updatedInsurance);
  };

  const handleFormChange = (e) => {
    if (e.target.name === "haveInsurance" && e.target.value === "no") {
      setInsuranceInfo([{ card: "", cardNumber: "", company: "" }]);
      setNumberOfComponents(1);
    }
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
        setProfile(e.target.result);
      }
    }
  }

  const submitData = async (data) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/v1/${type}/registration`, data, {
        headers: { Accept: "application/json", }
      });
      if (response.data) {
        toastHandler("success", "Account created!");
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    };
  }

  const isOver18 = (dob) => {
    const birthday = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthday.getFullYear();
    return age >= 18;
  };

  const btnSubmit = () => {
    const validateForm = () => {
      const isLegalAge = isOver18(adminInfo.birthday);
      if (!adminInfo.firstname || !adminInfo.lastname || !adminInfo.birthday || !adminInfo.address || !adminInfo.gender || !adminInfo.contactNumber || !adminInfo.email || !adminInfo.username || !adminInfo.password || !adminInfo.confirmPassword || !profile) {
        toastHandler("error", "Please fill up all empty fields");
        return false;
      }

      if (adminInfo.password !== adminInfo.confirmPassword) {
        toastHandler("error", "Mismatch password and confirm password");
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

      if (adminInfo.haveInsurance === "yes" && (!insuranceInfo[0].card || !insuranceInfo[0].cardNumber || !insuranceInfo[0].company)) {
        toastHandler("error", "Please fill up the HMO");
        return false;
      }

      return true;
    };

    const submitForm = () => {
      let data = {};
      if (type === "patient") {
        data = { ...adminInfo, insuranceInfo, profile };
      } else {
        data = { ...adminInfo, profile };
      }
      console.log(data);
      submitData(data);
    };

    if (validateForm()) {
      submitForm();
    }
  };

  return (
    <div className={` w-full h-screen bg-modal bg-opacity-75 absolute top-0 z-40 flex flex-grow justify-center items-center ${show ? '' : 'hidden'}`}>
      <div className=" z-50">
        <div className="m-auto w-[550px] h-[730px] overflow-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-left py-2 mb-2 border-b-2 border-b-light-gray">
            <h2 className="text-xl font-bold capitalize mb-2">{`Add ${type}`}</h2>
          </div>

          <ToastContainer limit={1} autoClose={1500} />

          <form action="post" className='grid grid-cols-2 gap-3' >
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="firstname">First Name</label>
              <input id='firstname' type="text" name="firstname" value={adminInfo.firstname} placeholder='ex. John' className=' px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="middlename">Middle Name</label>
              <input id='middlename' type="text" name="middlename" value={adminInfo.middlename} placeholder='ex. Cruz' className=' px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md  ' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="lastname">Last Name</label>
              <input id='lastname' type="text" name="lastname" value={adminInfo.lastname} placeholder='ex. Dimaguiba' className=' px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md  ' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="birthday">Birthday</label>
              <input id='birthday' type="date" name="birthday" value={adminInfo.birthday} className=' px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md  ' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="address">Address</label>
              <input id='address' type="text" name="address" value={adminInfo.address} placeholder='ex. 123 Sesame St., Malabon City' className=' px-4 py-2 text-sm  outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md  ' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="gender">Gender</label>
              <select name="gender" value={adminInfo.gender} id="gender" className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md ' onChange={(e) => handleFormChange(e)}>
                <option value="" hidden >Choose...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="contactNumber">Contact Number</label>
              <input id='contactNumber' type="text" name="contactNumber" minLength={11} maxLength={11} value={adminInfo.contactNumber} placeholder='ex. 09123456780' className=' px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md  ' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="email">Email</label>
              <input id='email' type="email" name="email" value={adminInfo.email} className=' text-sm px-4 py-2 outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md  ' placeholder='ex. john@email.com' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="username">Username</label>
              <input id='username' type="text" name="username" value={adminInfo.username} className=' text-sm px-4 py-2 outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md  ' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="password">Password</label>
              <input id='password' type="password" name="password" value={adminInfo.password} className=' px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md  ' onChange={(e) => handleFormChange(e)} />
            </div>
            <div className='flex flex-col'>
              <label className='text-dark-gray font-medium' htmlFor="confirmPassword">Confirm Password</label>
              <input id='confirmPassword' type="password" name="confirmPassword" value={adminInfo.confirmPassword} className=' text-sm px-4 py-2 outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md  ' onChange={(e) => handleFormChange(e)} />
            </div>

            {
              type !== "patient" ? " " :
                <div className='flex flex-col'>
                  <label className='text-dark-gray font-medium' htmlFor='haveInsurance'>Do you have HMO? </label>
                  <select name="haveInsurance" id='haveInsurance' value={adminInfo.haveInsurance} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md ' onChange={(e) => handleFormChange(e)}>
                    <option value="yes">Yes</option>
                    <option value="no" >No</option>
                  </select>
                </div>
            }

            {[...Array(numberOfComponents)].map((_, index) => (
              <div className='flex flex-col gap-2' key={index}>
                {adminInfo.haveInsurance === "yes" ? (
                  <>
                    <div className='flex flex-col'>

                      <div className=' w-full flex justify-end gap-2'>
                        <button onClick={(e) => {
                          e.preventDefault();
                          setNumberOfComponents(numberOfComponents + 1);
                          setInsuranceInfo([...insuranceInfo, { card: "", cardNumber: "", company: "" }]);
                        }}
                          className=' p-1 bg-primary rounded-full text-white hover:shadow-2xl '
                        ><IoAddSharp size={15} /></button>

                        <button
                          className={`p-1 rounded-full  hover:shadow-2xl ${numberOfComponents === 1 ? 'bg-light-gray text-medium-gray' : 'bg-red text-secondary'}`}
                          onClick={(e) => {
                            e.preventDefault();
                            if (numberOfComponents === 1) {
                              return toastHandler("warning", "You can't remove input field");
                            }

                            const updatedList = insuranceInfo;
                            updatedList.splice(index, 1);
                            setInsuranceInfo([...updatedList]);
                            setNumberOfComponents(numberOfComponents - 1);
                          }}
                        ><IoRemoveOutline size={15} /></button>
                      </div>

                      <label className='text-dark-gray font-medium' htmlFor="card">HMO Card</label>
                      <select name="card" id='card' value={insuranceInfo[index].card} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md ' onChange={(e) => handleInsuranceChange(e, index)}>
                        <option value="" disabled>Select Insurance Card...</option>
                        <option value="Cocolife Health Care">Cocolife Health Care</option>
                        <option value="Inlife Insular Health Care">Inlife Insular Health Care</option>
                        <option value="Health Partners Dental Access, Inc.">Health Partners Dental Access, Inc.</option>
                        <option value="Maxicare">Maxicare</option>
                        <option value="eTiQa">eTiQa</option>
                        <option value="PhilCare">PhilCare</option>
                        <option value="Health Maintenance, Inc.">Health Maintenance, Inc.</option>
                        <option value="Generali">Generali</option>
                        <option value="Health Access">Health Access</option>
                      </select>
                    </div>
                    <div className='flex flex-col'>
                      <label className='text-dark-gray font-medium' htmlFor="cardNumber">HMO Card Number</label>
                      <input id='cardNumber' type="text" name="cardNumber" value={insuranceInfo[index].cardNumber} className=' px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md  ' onChange={(e) => handleInsuranceChange(e, index)} />
                    </div>
                    <div className='flex flex-col'>
                      <label className='text-dark-gray font-medium' htmlFor="company">Company <span className='text-xs'>(type <span className='text-red'>N/A</span> if none)</span></label>
                      <input id='company' type="text" name="company" value={insuranceInfo[index].company} className=' px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md  ' onChange={(e) => handleInsuranceChange(e, index)} />
                    </div>
                  </>
                ) : null}
              </div>
            ))}

          </form>
          <div className="flex my-3 flex-col gap-2">
            <p className='text-dark-gray font-medium' htmlFor="picture">Picture</p>
            <label class="text-sm">
              <span class="sr-only">Choose profile photo</span>
              <input type="file" name="profile" accept='image/*' onChange={handleProfile} class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-secondary hover:file:bg-subprimary" />
            </label>
          </div>

          <div className='mt-2 pt-4 flex justify-end gap-2 border-t-2 border-t-light-gray'>
            <button className='px-6 py-2 bg-green text-white rounded-md hover:shadow-lg' onClick={btnSubmit}>Add</button>
            <button className='px-8 py-2 bg-red text-white rounded-md hover:shadow-lg' onClick={() => setModal(false)}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminModal;