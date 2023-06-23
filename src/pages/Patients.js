import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { AiFillPrinter } from 'react-icons/ai';
import FileIcons from '../components/FileIcons';
import Table from '../components/Table';
import Modal from '../components/AdminModal';
import Pagination from '../components/Pagination';
import ExcelButton from '../components/ExcelButton';
import PDFButton from '../components/PDFButton';
import SubHeader from '../components/SubHeader';

function Patients({ patients }) {
  const tableHeaders = ["photo", "patient", "birthday", "gender", "contact", "email", "status", "action"];
  const [show, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageNumber = [];

  for (let x = 1; x <= Math.ceil(patients.length / 8); x++) {
    pageNumber.push(x);
  }

  const searchHandle = (e) => {
    setSearch(e.target.value);
  }

  const filteredPatient = patients.filter((val) =>
    (val.firstname + val.middlename + val.lastname + val.birthday + val.phoneNumber + val.email).toLowerCase()
      .includes(search.toLowerCase())
  );
  return (
    <div className='h-screen overflow-hidden relative'>
      <Modal show={show} setModal={setModal} type="patient" />
      <PageHeader link={'patient'} />

      <div className='w-full flex flex-col justify-center p-4'>
        <div className='w-full bg-white h-auto rounded-xl shadow-lg'>

          {/*Sub header*/}
          <SubHeader userLevel='Patient' setModal={setModal} />

          {/*Searchbar and files*/}
          <div className='w-full p-4 flex justify-between'>
            <div className='flex gap-2'>
              <ExcelButton users={patients} title={"patients"} />
              <PDFButton data={patients} />
              <FileIcons Icon={AiFillPrinter} title={"Print"} />
            </div>

            <input
              type='text'
              name='search'
              className='px-4 py-1 w-80 border border-medium-gray outline-none rounded-md focus:border-primary'
              placeholder='Search patient...'
              onChange={(e) => searchHandle(e)}
            />
          </div>

          {/*Tables*/}
          <Table tableHeaders={tableHeaders} results={search.length > 0 ? filteredPatient : patients} search={search} currentPage={currentPage} />

          {/*Pagination */}
          <Pagination setCurrentPage={setCurrentPage} pageNumber={pageNumber} />
        </div>
      </div>
    </div>
  )
}

export default Patients