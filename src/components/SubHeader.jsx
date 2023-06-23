import React from 'react';
import { IoAdd } from 'react-icons/io5';

const SubHeader = ({ userLevel, setModal }) => {
    return (
        <div className='w-full p-4 border-t-2 border-t-primary rounded-t-xl flex justify-between items-center border-b-2 border-b-light-gray'>
            <h1 className='text-xl font-semibold text-dark-gray '>{userLevel} List</h1>
            <button className=' bg-primary text-white flex justify-start items-center p-2 pl-1 hover:bg-subprimary transition-all ease-linear cursor-pointer rounded-md font-semibold capitalize ' onClick={() => setModal(true)}><IoAdd size={30} />&nbsp;Add {userLevel}</button>
        </div>
    )
}

export default SubHeader;