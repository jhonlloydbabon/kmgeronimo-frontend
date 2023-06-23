import React from 'react'
import PageHeader from '../components/PageHeader';
import { FaUsers } from 'react-icons/fa';
import { BsFillCalendarCheckFill, } from 'react-icons/bs';
import { MdPayments, MdOutlinePendingActions } from 'react-icons/md';
import CardInformation from '../components/CardInformation';

function Home({ patients, pendingAppointment, approvedAppointment }) {

  return (
    <div className='h-screen'>
      <PageHeader link={'dashboard'} />
      <div className='w-full h-auto p-4 flex justify-between gap-4'>

        <CardInformation
          background={'bg-gradient-to-br from-[#00bfff] to-[#0099cc]'}
          iconColor={'text-[#007399]'}
          number={patients}
          title={'patients'}
          Icon={FaUsers}
        />

        <CardInformation
          background={'bg-gradient-to-br from-green to-dark-green'}
          iconColor={'text-[#00b359]'}
          number={approvedAppointment}
          title={'Confirmed Appointments'}
          Icon={BsFillCalendarCheckFill}
        />

        <CardInformation
          background={'bg-gradient-to-br from-orange to-orange-sub'}
          iconColor={'text-[#e65c00]'}
          number={pendingAppointment}
          title={'pending payments'}
          Icon={MdPayments}
        />

        <CardInformation
          background={'bg-gradient-to-br from-yellow to-dark-yellow'}
          iconColor={'text-[#999900]'}
          number={0}
          title={'pending appointments'}
          Icon={MdOutlinePendingActions}
        />

        {/* <MdOutlinePendingActions className='bg-green-600 text-green-700 ' /> */}
      </div>
    </div>
  )
}

export default Home