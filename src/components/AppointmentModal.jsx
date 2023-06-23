import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { SERVICES_LINK, PATIENT_LINK, DENTIST_LINK } from '../ApiLinks';
import { CiCircleRemove } from "react-icons/ci";
import { toastHandler } from '../ToastHandler';
import { ToastContainer } from 'react-toastify';
import moment from 'moment/moment';


function AppointmentModal({ show, setModal, setCovidModal, appointment, setAppointment, filteredAppointments }) {
  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [active, setActive] = useState("");
  const [dentists, setDentists] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [insuranceList, setInsuranceList] = useState([]);
  let [timeStartList, setTimeStartList] = useState(
    [
      { timeValue: "09:00 Am", timeStart: "09:00:00" },
      { timeValue: "09:30 Am", timeStart: "09:30:00" },
      { timeValue: "10:00 Am", timeStart: "10:00:00" },
      { timeValue: "10:30 Am", timeStart: "10:30:00" },
      { timeValue: "11:00 Am", timeStart: "11:00:00" },
      { timeValue: "11:30 Am", timeStart: "11:30:00" },
      { timeValue: "12:00 Am", timeStart: "12:00:00" },
      { timeValue: "01:00 Pm", timeStart: "13:00:00" },
      { timeValue: "01:30 Pm", timeStart: "13:30:00" },
      { timeValue: "02:00 Pm", timeStart: "14:00:00" },
      { timeValue: "02:30 Pm", timeStart: "14:30:00" },
      { timeValue: "03:00 Pm", timeStart: "15:00:00" },
      { timeValue: "03:30 Pm", timeStart: "15:30:00" },
      { timeValue: "04:00 Pm", timeStart: "16:00:00" },
    ]
  );

  const fetchPatient = async () => {
    try {
      const response = await axios.get(PATIENT_LINK + 'fetch');
      if (response.data) {
        setPatients(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDentist = async () => {
    try {
      const response = await axios.get(DENTIST_LINK);
      if (response.data) {
        setDentists(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(SERVICES_LINK);
      if (response.data) {
        setServices(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchPatient();
    fetchDentist();
    fetchServices();

  }, []);

  const handleOnChange = (e) => {
    if (e.target.name === "patient") {
      const filteredPatient = patients.filter(v => {
        return v.verified;
      })
        .filter((v) =>
          (v.firstname + v.middlename + v.lastname).toLowerCase().includes(e.target.value.toLowerCase())
        )
      setSuggestions(filteredPatient);
      setActive("patient")
    }
    if (e.target.name === "dentist") {
      const filteredPatient = dentists
        .filter(v => {
          return v.verified;
        })
        .filter((v) =>
          (v.fullname).toLowerCase().includes(e.target.value.toLowerCase())
        )
      setSuggestions(filteredPatient)
      setActive("dentist")
    }
    if (e.target.name === "serviceValue") {
      const filteredService = services
        .filter(v => {
          return v.isAvailable;
        })
        .filter((v) =>
          (v.name).toLowerCase().includes(e.target.value.toLowerCase())
        )
      setSuggestions(filteredService)
      setActive("service")
    }

    // DATE LOGIC
    if (e.target.name === "date") {

      const newTimeList = [
        { timeValue: "09:00 Am", timeStart: "09:00:00" },
        { timeValue: "09:30 Am", timeStart: "09:30:00" },
        { timeValue: "10:00 Am", timeStart: "10:00:00" },
        { timeValue: "10:30 Am", timeStart: "10:30:00" },
        { timeValue: "11:00 Am", timeStart: "11:00:00" },
        { timeValue: "11:30 Am", timeStart: "11:30:00" },
        { timeValue: "12:00 Am", timeStart: "12:00:00" },
        { timeValue: "01:00 Pm", timeStart: "13:00:00" },
        { timeValue: "01:30 Pm", timeStart: "13:30:00" },
        { timeValue: "02:00 Pm", timeStart: "14:00:00" },
        { timeValue: "02:30 Pm", timeStart: "14:30:00" },
        { timeValue: "03:00 Pm", timeStart: "15:00:00" },
        { timeValue: "03:30 Pm", timeStart: "15:30:00" },
        { timeValue: "04:00 Pm", timeStart: "16:00:00" },
      ];

      setTimeStartList([...newTimeList]);
      setTimeStartList(prevTimeStartList => {
        let updatedTimeStartList = [...newTimeList];
        const getAppointmentDate = filteredAppointments.filter((value) => {
          return value.status === "APPROVED" && value.date === e.target.value;
        });

        if (getAppointmentDate.length > 0) {
          const indexesToRemove = [];
          for (let x = 0; x < getAppointmentDate.length; x++) {
            const start = prevTimeStartList.findIndex((value) => {
              return value.timeStart === getAppointmentDate[x].timeStart;
            });
            const end = prevTimeStartList.findIndex((value) => {
              return value.timeStart === getAppointmentDate[x].timeEnd;
            })
            for (let begin = start; begin < end; begin++) {
              indexesToRemove.push(begin);
            }
          }
          console.log(indexesToRemove);

          updatedTimeStartList = updatedTimeStartList.filter((_, index) => {
            return !indexesToRemove.includes(index);
          })
        }
        return updatedTimeStartList;
      })
    }

    setAppointment({
      ...appointment,
      [e.target.name]: e.target.value
    });
  };

  const nextButton = async () => {
    if (!appointment.patient || !appointment.dentist || appointment.serviceSelected.length < 1 || !appointment.date || !appointment.timeStart || !appointment.type || !appointment.method) {
      return toastHandler("error", "Fill up empty field!");
    }
    if (appointment.method === "hmo" && !appointment.insuranceId) {
      return toastHandler("error", "Please select your insurance");
    }

    const current = new Date();
    current.setHours(0, 0, 0, 0);
    const selectedDate = new Date(appointment.date);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < current) {
      return alert("You can't select previous date")
    }
    const end = calculateTotalTime();
    const data = {
      timeEnd: end,
    }

    const timeTotal = calculateTotalServiceTime();
    const totalTimeDuration = moment('00:00:00', 'HH:mm:ss');

    // console.log(timeTotal);
    let start = moment(appointment.timeStart, 'HH:mm:ss');
    while (start.isBefore(moment(end, "HH:mm:ss").add(30, 'minutes'))) {
      const startTime = start.format('HH:mm:ss');
      const matchingTime = timeStartList.find(time => time.timeStart === startTime);
      if (startTime === "12:30:00" || startTime === "16:30:00") {
        toastHandler("error", `Kindly select ${totalTimeDuration.format('HH:mm:ss') === "01:00:00"
          ? '30 minutes'
          : '1 hour'
          } service or change other dates`);
        return;
      }
      if (!matchingTime) {
        if (timeTotal !== totalTimeDuration.format("HH:mm:ss")) {
          toastHandler('error', `Your selected time range should be less than or equal ${totalTimeDuration.format('HH:mm:ss') === "00:30:00"
            ? totalTimeDuration.minute() + ' minutes'
            : totalTimeDuration.hour() + ' hour'
            }`)
          return;
        }
      }
      totalTimeDuration.add(30, 'minutes');
      start.add(30, "minutes");
    }

    setAppointment({
      ...appointment,
      ...data
    })
    setModal(false);
    setCovidModal(true);
  }

  const calculateTotalServiceTime = () => {
    const timeEnd = appointment.serviceSelected.map((val) => {
      const result = services.filter((service) => {
        return service.serviceId === val;
      }).map((val) => { return val.duration; });
      return result;
    })
    let total = 0;
    for (const duration of timeEnd) {
      const timeParts = duration.toLocaleString().split(':');
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const seconds = parseInt(timeParts[2], 10);

      const durationInMillis = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
      total += durationInMillis;
    }

    const convertTotalTime = moment.duration(total);
    return moment.utc(convertTotalTime.asMilliseconds()).format('HH:mm:ss');
  }
  const calculateTotalTime = () => {
    const timeStart = moment(appointment.timeStart, "HH:mm:ss");
    return timeStart.add(calculateTotalServiceTime()).format("HH:mm:ss");
  }

  const calculateTotalAmount = (list) => {
    const totalAmount = list.map((val) => {
      const result = services.find((service) => {
        return service.serviceId === val;
      });
      return result.price;
    })
      .reduce((acc, val) => {
        return acc += parseFloat(val);
      }, 0.00);

    return totalAmount;
  }

  const btnClose = () => {
    setAppointment({
      patient: '',
      patientId: "",
      dentist: '',
      dentistId: "",
      serviceValue: "",
      serviceSelected: [],
      date: "",
      timeStart: " ",
      timeEnd: " ",
      totalAmount: 0.00,
      method: "",
      type: " ",
      insuranceId: "",
    })
    setModal(false);
  };

  const minDate = new Date().toISOString().split('T')[0];
  return (
    <div className={`w-full h-screen bg-modal bg-opacity-75 absolute top-0 z-40 flex flex-grow justify-center items-center ${show ? '' : 'hidden'}`}>
      <div className=' z-50 h-auto relative'>
        <div className='m-auto w-[800px] h-[700px] overflow-auto p-8 bg-white rounded-lg relative shadow-lg'>
          <div className='text-left py-4 h-auto overflow-auto '>
            <h2 className='text-xl font-bold mb-2 border-b-2 border-b-light-gray pb-2 text-black'>Add Appointment</h2>
            <h5 className=' text-lg font-semibold text-medium-gray mb-5 capitalize '>Appointment Information</h5>

            <ToastContainer limit={1} autoClose={1500} />

            <form className=' grid grid-cols-2 gap-5 px-8 relative '>
              <div className=' mb-2 flex flex-col gap-1 relative'>
                <label htmlFor='patient' className=' text-dark-gray font-medium  '>
                  Patient Name
                </label>
                <input
                  id='patient'
                  type='search'
                  name='patient'
                  value={appointment.patient}
                  className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'
                  onChange={(e) => handleOnChange(e)}
                />

                {active === "patient" && appointment.patient !== "" && suggestions.length > 0 && (
                  <ul className='relative z-10 bg-secondary text-black border border-primary rounded-md shadow-md w-full max-h-[120px] overflow-auto '>
                    {suggestions.map((patient) => (
                      <li
                        key={patient.patientId}
                        className='px-2 py-1 cursor-pointer hover:pl-3 transition-all ease-linear duration-150 hover:bg-subprimary hover:text-secondary'
                        onClick={() => {
                          setAppointment({
                            ...appointment,
                            patient: (patient.firstname + " " + patient.middlename + " " + patient.lastname),
                            patientId: patient.patientId
                          });
                          setInsuranceList([...patient.insurance]);
                          setSuggestions([]);
                        }}
                      >
                        {patient.firstname} {patient.middlename} {patient.lastname}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className=' mb-2 flex flex-col gap-1 relative '>
                <label htmlFor='dentist' className=' text-dark-gray font-medium'>
                  Dentist Name
                </label>
                <input
                  id='dentist'
                  type='search'
                  name='dentist'
                  value={appointment.dentist}
                  className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'
                  onChange={(e) => handleOnChange(e)}
                />

                {active === "dentist" && appointment.dentist !== "" && suggestions.length > 0 && (
                  <ul className='relative z-10 bg-secondary text-black border border-primary rounded-md shadow-md w-full max-h-[120px] overflow-auto'>
                    {suggestions.map((dentist) => (
                      <li
                        key={dentist.dentistId}
                        className='px-2 py-1 cursor-pointer hover:pl-3 transition-all ease-linear duration-150 hover:bg-subprimary hover:text-secondary'
                        onClick={() => {
                          setAppointment({
                            ...appointment,
                            dentist: `Dr. ${dentist.fullname}`,
                            dentistId: dentist.dentistId
                          });
                          setSuggestions([]);
                        }}
                      >
                        Dr. {dentist.fullname}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className=' mb-2 flex flex-col gap-1 relative '>
                <label htmlFor='serviceValue' className=' text-dark-gray font-medium'>
                  Dental Service
                </label>
                <input
                  id='serviceValue'
                  type='search'
                  name='serviceValue'
                  value={appointment.serviceValue}
                  className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'
                  onChange={(e) => handleOnChange(e)}
                />
                {active === "service" && appointment.serviceValue !== "" && suggestions.length > 0 && (
                  <ul className='relative z-10 bg-secondary text-black border border-primary rounded-md shadow-md w-full max-h-[120px] overflow-auto'>
                    {suggestions.map((v) => (
                      <li
                        key={v.serviceId}
                        className='px-2 py-1 cursor-pointer hover:pl-3 transition-all ease-linear duration-150 hover:bg-subprimary hover:text-secondary'
                        onClick={() => {
                          const checkIfExist = appointment.serviceSelected.filter(val => { return val === v.serviceId });
                          if (checkIfExist.length > 0) {
                            return alert("You already select this service")
                          }
                          appointment.serviceSelected.push(v.serviceId);
                          const totalAmount = calculateTotalAmount(appointment.serviceSelected);

                          setAppointment({
                            ...appointment,
                            serviceValue: "",
                            totalAmount: totalAmount
                          });
                          setSuggestions([]);
                        }}
                      >
                        {v.name}
                      </li>
                    ))}
                  </ul>
                )}
                {
                  appointment.serviceSelected.length > 0 && (
                    <div className=' rounded-sm w-full py-2 flex flex-wrap gap-2 '>
                      {appointment.serviceSelected.map((service, index) => {
                        const selectedService = services.find((val) => val.serviceId === service);

                        return (
                          <p key={index} className="flex items-center gap-2 bg-cyan-500 rounded-md px-3 py-1 text-black outline-none border border-primary">
                            {selectedService.name}{' '}
                            <span
                              onClick={() => {
                                const updatedServices = appointment.serviceSelected.slice();
                                updatedServices.splice(index, 1);

                                const totalAmount = calculateTotalAmount(updatedServices)

                                setAppointment({ ...appointment, serviceSelected: updatedServices, totalAmount: totalAmount });
                              }}
                              className='cursor-pointer'
                            >
                              <CiCircleRemove size={25} className='text-red' />
                            </span>
                          </p>
                        );
                      })}
                    </div>
                  )
                }
              </div>
              <div className=' mb-2 flex flex-col gap-1 relative '>
                <label htmlFor='date' className=' text-dark-gray font-medium  '>
                  Appointment Date
                </label>
                <input
                  id='date'
                  type='date'
                  name='date'
                  min={minDate}
                  value={appointment.date}
                  className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'
                  onChange={(e) => handleOnChange(e)}
                />
              </div>
              <div className=' mb-2 flex flex-col gap-1 relative '>
                <label htmlFor='time' className=' text-dark-gray font-medium  '>
                  Appointment Time
                </label>
                <select id='time' name="timeStart" value={appointment.timeStart} onChange={(e) => handleOnChange(e)} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'>
                  <option value="" disabled >Choose time...</option>
                  {
                    timeStartList
                      .filter((val) => {
                        return val.timeStart !== "12:00:00" && val.timeStart !== "16:00:00";
                      })
                      .map((val, index) => (
                        <option value={val.timeStart} key={index}

                        >{val.timeValue}</option>
                      ))
                  }
                </select>
              </div>
            </form>

            <div className=' w-full h-500 bg-white relative mt-3 '>
              <h5 className=' text-lg font-semibold text-medium-gray mb-5 capitalize '>Payment Information</h5>
              <form className=' grid grid-cols-2 gap-5 px-8 relative '>
                <div className=' mb-2 flex flex-col gap-1 relative '>
                  <label htmlFor='payment' className=' text-dark-gray font-medium  '>
                    Payment Method
                  </label>
                  <select id='payment' name="method" value={appointment.method} onChange={(e) => handleOnChange(e)} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'>
                    <option value="" disabled >Select payment method...</option>
                    <optgroup label='Online Payment' className=' font-semibold '>
                      <option value="e-payment/gcash">GCash</option>
                      <option value="e-payment/paymaya">Paymaya</option>
                    </optgroup>
                    <option value="cash">Cash</option>
                    {
                      insuranceList.length > 0 ? (
                        <option value="hmo">Health Insurance</option>
                      )
                        : ""
                    }
                  </select>
                </div>

                {
                  appointment.method === "hmo" && insuranceList.length > 0 ?
                    <div className=' mb-2 flex flex-col gap-1 relative '>
                      <label htmlFor='insuranceId' className=' text-dark-gray font-medium  '>
                        Insurance Card
                      </label>
                      <select name="insuranceId" value={appointment.insuranceId} onChange={(e) => handleOnChange(e)} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'>
                        <option value="" disabled >Select your insurance card...</option>
                        {
                          insuranceList.map((val) => (
                            <option value={val.insuranceId} key={val.insuranceId} >{val.card}</option>
                          ))
                        }
                      </select>
                    </div>
                    : ""
                }
                <div className=' mb-2 flex flex-col gap-1 relative '>
                  <label htmlFor='ptype' className=' text-dark-gray font-medium  '>
                    Payment Type
                  </label>
                  <select id="ptype" name="type" value={appointment.type} onChange={(e) => handleOnChange(e)} className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'>
                    <option value="" disabled >Select time...</option>
                    <option value="full-payment">Full Payment</option>
                    {
                      appointment.method !== "hmo" && appointment.totalAmount >= 40000 ? <option value="installment">Installment</option> : ""
                    }
                  </select>
                </div>
                <div className=' mb-2 flex flex-col gap-1 relative '>
                  <label className=' text-dark-gray font-medium  '>
                    Total Payment
                  </label>
                  <input
                    type='number'
                    name='totalAmount'
                    value={appointment.totalAmount}
                    disabled
                    className='px-4 py-2 text-sm outline-none border-light-gray border focus:shadow-md focus:border-primary rounded-md'
                    onChange={(e) => handleOnChange(e)}
                  />
                </div>
              </form>
            </div>


          </div>
          <div className=" w-full flex justify-end relative left-0 px-7 py-4 bottom-0 pt-2 gap-2 z-40">
            <button className="px-6 py-2 bg-primary text-white rounded-md hover:shadow-lg"
              onClick={nextButton}
            >
              Next
            </button>
            <button className="px-6 py-2 bg-red text-white rounded-md hover:shadow-lg" onClick={btnClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentModal