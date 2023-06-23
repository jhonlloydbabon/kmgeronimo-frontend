import React from 'react'

function FileIcons({Icon, title, eventHandler}) {
  return (
    <div className=' text-dark-gray flex items-center gap-x-1 border border-medium-gray py-1 px-3 rounded-md cursor-pointer hover:bg-primary hover:text-secondary transition-all ease-linear duration-100' onClick={eventHandler}>
        <Icon size={20} />
        <p>{title}</p>
    </div>
  )
}

export default FileIcons