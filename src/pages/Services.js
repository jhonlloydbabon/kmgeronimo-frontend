import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { IoAdd } from 'react-icons/io5';
import { SERVICES_LINK } from "../ApiLinks";
import Table from '../components/ServiceTable';
import Modal from '../components/ServicesModal';
import axios from 'axios';
import Pagination from '../components/Pagination';

function Services() {
  const [show, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [serviceList, setServiceList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tableHeaders = ["Service Name", "Service Type", "Service Duration", "Service Price", "Status", "Action"];
  const pageNumber = [];

  for (let x = 1; x <= Math.ceil(serviceList.length / 8); x++) {
    pageNumber.push(x);
  }

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(SERVICES_LINK);
        if (response.data) {
          setServiceList(response.data);
        }
      } catch (error) { console.log(error) }
    }
    fetchServices();
  }, [])

  const searchHandle = (e) => {
    setSearch(e.target.value);
  }

  const filteredServices = serviceList.filter(val =>
    (val.name + val.type + val.duration + val.price).toLowerCase().includes(search)
  );

  return (
    <div className='h-screen overflow-hidden relative '>
      <Modal show={show} setModal={setModal} />
      <PageHeader link={'Service'} />

      <div className=' w-full flex flex-col justify-center p-4 '>
        <div className='w-full bg-white h-auto rounded-xl shadow-lg'>

          {/*Sub header*/}
          <div className='w-full p-4 border-t-2 border-t-primary rounded-t-xl flex justify-between items-center border-b-2 border-b-light-gray'>
            <h1 className='text-xl font-semibold text-dark-gray'>Service List</h1>
            <button className='bg-primary text-white flex justify-start items-center p-2 pl-1 hover:bg-subprimary transition-all ease-linear cursor-pointer rounded-md font-semibold capitalize' onClick={() => setModal(true)}><IoAdd size={30} />&nbsp;Add service</button>
          </div>

          {/*Searchbar and files*/}
          <div className=' w-full p-4 flex justify-between '>
            <div className=' inline-flex gap-2  '>
              {/* <ExcelButton user={patients} title={"patients"} />
                  <PDFButton data={patients} />
                  <FileIcons Icon={AiFillPrinter} title={"Print"} /> */}
            </div>
            <input
              type='text'
              name='search'
              className='px-4 py-1 w-80 border border-medium-gray outline-none rounded-md focus:border-primary'
              placeholder='Search a service..'
              onChange={(e) => searchHandle(e)}
            />
          </div>

          <Table tableHeaders={tableHeaders} results={search.length > 0 ? filteredServices : serviceList} search={search} currentPage={currentPage} />
          <Pagination setCurrentPage={setCurrentPage} pageNumber={pageNumber} />
        </div>
      </div>
    </div>
  )
}

export default Services