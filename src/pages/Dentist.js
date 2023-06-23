import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { IoAdd } from 'react-icons/io5';
import { AiFillPrinter } from 'react-icons/ai';
import FileIcons from '../components/FileIcons';
import DentistModal from '../components/DentistModal';
import axios from 'axios';
import Pagination from '../components/Pagination';
import DentistTable from '../components/DentistTable';
import DentistExcelButton from '../components/DentistExcelButton';
import PDFButton from '../components/PDFButton';
import { DENTIST_LINK } from '../ApiLinks';

function Dentist() {
  const [show, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [dentistList, setDentistList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tableHeaders = ["profile", "full name", "address", "gender", "contact number", "email", "specialty", "status", "actions"];
  const pageNumber = [];

  for (let x = 1; x <= Math.ceil(dentistList.length / 8); x++) {
    pageNumber.push(x);
  }

  const searchHandle = (e) => {
    setSearch(e.target.value);
  }

  const fetchDentist = async () => {
    try {
      const response = await axios.get(DENTIST_LINK);
      if (response.data) {
        setDentistList(response.data);
      }
    } catch (err) { console.log(err); }
  }
  useEffect(() => {
    fetchDentist();
  }, [])

  const filteredDentist = dentistList.filter(dentist =>
    (dentist.fullname + dentist.address + dentist.specialty).toLowerCase().includes(search)
  );

  return (
    <div className=' h-screen overflow-hidden relative '>
      <DentistModal show={show} setModal={setModal} />
      <PageHeader link={'Dentist'} />

      <div className=' w-full flex flex-col justify-center p-4 '>
        <div className=' w-full bg-white h-auto rounded-xl shadow-lg'>

          {/*Sub header*/}
          <div className=' w-full p-4 border-t-2 border-t-primary rounded-t-xl flex justify-between items-center border-b-2 border-b-light-gray '>
            <h1 className='text-xl font-semibold text-dark-gray '>Dentist List</h1>
            <button className='bg-primary text-white flex justify-start items-center p-2 pl-1 hover:bg-subprimary transition-all ease-linear cursor-pointer rounded-md font-semibold capitalize' onClick={() => setModal(true)}><IoAdd size={30} />&nbsp;Add dentist</button>
          </div>

          {/*Searchbar and files*/}
          <div className=' w-full p-4 flex justify-between '>
            <div className='flex gap-2'>
              <DentistExcelButton users={dentistList} title={"Dentist"} />
              <PDFButton data={dentistList} type="dentist" />
              <FileIcons Icon={AiFillPrinter} title={"Print"} />
            </div>
            <input
              type='text'
              name='search'
              className='px-4 py-1 w-80 border border-medium-gray outline-none rounded-md focus:border-primary'
              placeholder='Search dentist...'
              onChange={(e) => searchHandle(e)}
            />
          </div>
          <DentistTable tableHeaders={tableHeaders} results={search.length > 0 ? filteredDentist : dentistList} search={search} currentPage={currentPage} />
          <Pagination setCurrentPage={setCurrentPage} pageNumber={pageNumber} />
        </div>
      </div>
    </div>
  )
}

export default Dentist