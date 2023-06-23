import React from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoNotificationsSharp } from 'react-icons/io5';

function Header({ toggleBar, setToggleBar, name }) {
  const toggleMenuEvent = () => {
    if (toggleBar) return setToggleBar(false);
    setToggleBar(true)
  }
  return (
    <div className='bg-secondary p-4 shadow-md flex justify-between items-center '>
      <GiHamburgerMenu onClick={toggleMenuEvent} size={30} className='cursor-pointer text-dark-gray' />
      <div className='flex justify-between items-center gap-4'>

        <h3 className='text-xl text-dark-gray'><span className='font-medium text-primary'>Hello</span>, {name}</h3>

        <div className=' relative w-12 h-12 flex justify-center items-center '>
          <IoNotificationsSharp size={40} className='text-dark-gray cursor-pointer' />
          <div className=' w-5 h-5 absolute bg-primary p-1 rounded-full flex items-center justify-center bottom-2 right-1 '>
            <span className='text-white font-bold '>1</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header