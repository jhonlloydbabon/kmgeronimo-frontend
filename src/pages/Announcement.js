import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { IoAdd } from 'react-icons/io5';
import { AiFillPrinter } from 'react-icons/ai';
import FileIcons from '../components/FileIcons';
import Table from '../components/AnnouncementTable';
import Modal from '../components/AnnouncementModal';
import Pagination from '../components/Pagination';
import ExcelButton from '../components/ExcelButton';
import PDFButton from '../components/PDFButton';
import axios from 'axios';
import { ANNOUNCEMENT_LINK } from '../ApiLinks';

function Announcement() {
  const tableHeaders = ["picture", "title", "description", "type", "status", "action"];
  const [announcement, setAnnouncement] = useState([]);
  const [show, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageNumber = [];

  for (let x = 1; x <= Math.ceil(announcement.length / 8); x++) {
    pageNumber.push(x);
  }

  const searchHandle = (e) => {
    setSearch(e.target.value);
  }

  const fetchAllAnnouncement = async () => {
    try {
      const response = await axios.get(ANNOUNCEMENT_LINK);
      if (response.data) {
        setAnnouncement(response.data);
      }
    } catch (error) { }
  }

  useEffect(() => {
    fetchAllAnnouncement();
  }, [])

  const filteredAnnouncement = announcement.filter(val =>
    (val.title + val.type).toLowerCase().includes(search)
  );

  console.log(announcement);
  return (
    <div className=' h-screen overflow-hidden relative '>
      <Modal show={show} setModal={setModal} />
      <PageHeader link={'Announcement'} />

      <div className=' w-full flex flex-col justify-center p-4 '>

        <div className=' w-full bg-white h-auto rounded-xl shadow-lg'>

          {/*Sub header*/}
          <div className='  w-full p-4 border-t-2 border-t-primary rounded-t-xl flex justify-between items-center border-b-2 border-b-light-gray'>
            <h1 className='text-xl font-semibold text-dark-gray'>Announcement</h1>
            <button className='bg-primary text-white flex justify-start items-center p-2 pl-1 hover:bg-subprimary transition-all ease-linear cursor-pointer rounded-md font-semibold capitalize' onClick={() => setModal(true)}><IoAdd size={30} />&nbsp;Add Announcement</button>
          </div>
          {/*Searchbar and files*/}
          <div className=' w-full p-4 flex justify-between '>
            <div className=' inline-flex gap-2  '>
              {/* <ExcelButton users={patients} title={"patients"} />
                          <PDFButton data={patients} />
                          <FileIcons Icon={AiFillPrinter} title={"Print"} /> */}
            </div>
            <input
              type='text'
              name='search'
              className='px-4 py-1 w-80 border border-medium-gray outline-none rounded-md focus:border-primary'
              placeholder='Search announcement...'
              onChange={(e) => searchHandle(e)}
            />
          </div>

          {/*Tables*/}
          <Table tableHeaders={tableHeaders} results={search.length > 0 ? filteredAnnouncement : announcement} search={search} currentPage={currentPage} />
          
          {/*Pagination */}
          <Pagination setCurrentPage={setCurrentPage} pageNumber={pageNumber} />
          <div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Announcement