import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { IoAdd } from 'react-icons/io5';
import { AiFillPrinter } from 'react-icons/ai';
import FileIcons from '../components/FileIcons';
import Table from '../components/AdminTable';
import Modal from '../components/AdminModal';
import axios from 'axios';
import Pagination from '../components/Pagination';
import ExcelButton from '../components/ExcelButton';
import PDFButton from '../components/PDFButton';

function Admin() {
  const [show, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [adminList, setAdminList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const tableHeaders = ["profile", "full name", "address", "gender", "contact number", "email", "role", "status", "actions"];
  const pageNumber = [];

  for (let x = 1; x <= Math.ceil(adminList.length / 8); x++) {
    pageNumber.push(x);
  }

  const fetchAdminList = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/admin/")
      setAdminList(response.data);
    } catch (error) { console.log(error); }
  }
  useEffect(() => {
    fetchAdminList();
  }, [])
  console.log(adminList)

  const searchHandle = (e) => {
    setSearch(e.target.value);
  }

  const filteredAdminList = adminList.filter((admin) =>
    (admin.firstname + admin.middlename + admin.lastname + admin.address + admin.birthday).toLowerCase().includes(search)
  )
  return (
    <div className='h-screen overflow-hidden relative '>

      <Modal show={show} setModal={setModal} type="admin" />
      <PageHeader link={'Admin'} />

      <div className=' w-full flex flex-col justify-center p-4 '>
        <div className=' w-full bg-white h-auto rounded-xl shadow-lg'>

          {/*Sub header*/}
          <div className='w-full p-4 border-t-2 border-t-primary rounded-t-xl flex justify-between items-center border-b-2 border-b-light-gray'>
            <h1 className='text-xl font-semibold text-dark-gray'>Admin List</h1>
            <button className='bg-primary text-white flex justify-start items-center p-2 pl-1 hover:bg-subprimary transition-all ease-linear cursor-pointer rounded-md font-semibold capitalize' onClick={() => setModal(true)}><IoAdd size={30} />&nbsp;Add admin</button>
          </div>

          {/*Searchbar and files*/}
          <div className=' w-full p-4 flex justify-between '>
            <div className='flex gap-2 '>
              <ExcelButton users={adminList} title={"admin-report"} />
              <PDFButton data={adminList} />
              <FileIcons Icon={AiFillPrinter} title={"Print"} />
            </div>
            <input
              type='text'
              name='search'
              className='px-4 py-1 w-80 border border-medium-gray outline-none rounded-md focus:border-primary'
              placeholder='Search admin...'
              onChange={(e) => searchHandle(e)}
            />
          </div>
          <Table tableHeaders={tableHeaders} results={search.length > 0 ? filteredAdminList : adminList} search={search} currentPage={currentPage} />
          <Pagination setCurrentPage={setCurrentPage} pageNumber={pageNumber} />
        </div>
      </div>
    </div>
  )
}

export default Admin