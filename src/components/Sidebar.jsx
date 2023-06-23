import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarIcon from './SidebarIcon';
import { NavLink } from 'react-router-dom';
import { BiArrowFromBottom, BiArrowToBottom } from 'react-icons/bi'
import { AiFillHome, AiFillMessage, AiFillSetting } from 'react-icons/ai';
import { BsCalendarEventFill, BsFillCalendarCheckFill, BsFillCalendar3Fill } from 'react-icons/bs'
import { FaUserAlt, FaUserCog, FaUserMd } from 'react-icons/fa';
import { MdMedicalServices, MdAnnouncement, MdManageAccounts } from 'react-icons/md';
import { CgProfile } from 'react-icons/cg';
import { RiLogoutBoxFill } from 'react-icons/ri';
import logo from '../assets/small-logo.jpg';

function Sidebar({ toggleBar, children }) {
	const params = useLocation();
	const [hover, setHover] = useState({
		active: false,
		value: ""
	});
	const menuItem = [
		{
			path: '/admin/dashboard',
			name: 'Dashboard',
			icon: <SidebarIcon Icon={AiFillHome} />,
		},
		{
			path: `${params.pathname}`,
			name: 'Accounts',
			icon: <SidebarIcon Icon={MdManageAccounts} />,
			value: "ACCOUNTS",
			sublinks: [
				{
					path: '/admin/dashboard/patient',
					name: 'Patient Account',
					icon: <SidebarIcon Icon={FaUserAlt} />
				},
				{
					path: '/admin/dashboard/dentist',
					name: 'Dentist Account',
					icon: <SidebarIcon Icon={FaUserMd} />
				},
				{
					path: '/admin/dashboard/admin',
					name: 'Admin Account',
					icon: <SidebarIcon Icon={FaUserCog} />
				},
			]
		},
		{
			path: `${params.pathname}`,
			name: 'Appointments',
			icon: <SidebarIcon Icon={BsFillCalendar3Fill} />,
			value: "APPOINTMENT",
			sublinks: [
				{
					path: '/admin/dashboard/appointment/calendar',
					name: 'Appointment Calendar',
					icon: <SidebarIcon Icon={BsCalendarEventFill} />
				},
				{
					path: '/admin/dashboard/appointment',
					name: 'Appointment List',
					icon: <SidebarIcon Icon={BsFillCalendarCheckFill} />
				},
			]
		},
		{
			path: '/admin/dashboard/services',
			name: 'Services',
			icon: <SidebarIcon Icon={MdMedicalServices} />
		},
		{
			path: '/admin/dashboard/messages',
			name: 'Messages',
			icon: <SidebarIcon Icon={AiFillMessage} />
		},
		{
			path: `${params.pathname}`,
			name: 'Settings',
			icon: <SidebarIcon Icon={AiFillSetting} />,
			value: "SETTING",
			sublinks: [
				{
					path: '/admin/dashboard/announcement',
					name: 'Announcement',
					icon: <SidebarIcon Icon={MdAnnouncement} />,
				},
				{
					path: '/admin/dashboard/profile',
					name: 'Profile',
					icon: <SidebarIcon Icon={CgProfile} />
				},
			]
		},
	];

	const handleHover = (val) => {
		switch (val) {
			case "ACCOUNTS":
				setHover({ active: true, value: "ACCOUNTS" })
				break;
			case "APPOINTMENT":
				setHover({ active: true, value: "APPOINTMENT" });
				break;
			case "SETTING":
				setHover({ active: true, value: "SETTING" });
				break;
			default:
				setHover({ active: false, value: "" });
		}
	}
	const removeHover = (val) => {
		switch (val) {
			case "ACCOUNTS":
				setHover({ ...hover, active: false, value: "" })
				break;
			case "APPOINTMENT":
				setHover({ ...hover, active: false, value: "" });
				break;
			case "SETTING":
				setHover({ active: false, value: "" });
				break;
			default:
				setHover({ ...hover, active: false, value: "" });
		}
	}
	return (
		<>
			<div className={`relative h-screen bg-primary flex flex-col shadow-lg text-white text-center transition-all ease-linear duration-200 ${toggleBar ? 'w-20' : 'w-72'} `}>
				<div className={` ${toggleBar ? 'w-20' : 'w-72'} flex justify-center bg-subprimary p-3 border-gray-300 transition-all ease-linear duration-200`} >
					<div className={` ${toggleBar ? 'w-20' : 'w-72'} mt-4 flex flex-col justify-center items-center`}>
						<img src={logo} alt="Dental logo" className={` ${toggleBar ? "w-16 h-14" : "w-16 h-16"} rounded-full`} />
						<h1 className={`text-md pt-4 mb-1 uppercase font-bold ${toggleBar ? 'hidden' : ''}`}>K.M. Geronimo Dental Clinic</h1>
						<p className={`text-xs ${toggleBar ? 'hidden' : ''}`}>Admin</p>
					</div>

				</div>
				<div className='p-1 relative'>
					{
						menuItem.map((map, index) => (
							<>
								<NavLink to={map.path} key={index} className={`w-auto mb-2 px-5 py-4 rounded-lg flex items-center text-white gap-x-2 text-center hover:bg-subprimary transition-all ease-linear duration-150 hover:shadow-md ${toggleBar ? 'justify-center flex-col' : ''}`} onClick={() => hover.active ? removeHover(map.value) : handleHover(map.value)}>
									<div>{map.icon}</div>
									<div className={`flex flex-grow items-center justify-between ${toggleBar ? ' text-xs ' : ''}`}>
										<span>{map.name}</span>
										<div className={`${toggleBar ? 'hidden' : 'visible'} `}>
											{
												map.sublinks && (
													map.value === hover.value ? (<BiArrowFromBottom />) : (<BiArrowToBottom />)
												)
											}
										</div>
									</div>
								</NavLink>
								{
									map.value === hover.value && map.sublinks && (
										<div className={` ${hover ? "visible" : "hidden"} bottom-0 w-full flex flex-col rounded-bl-md rounded-br-md overflow-hidden relative bg-subprimary`}>
											{
												map.sublinks.map((val, index) => (
													<NavLink to={val.path} key={index} className={`w-full px-4 py-3 flex gap-x-2 hover:bg-darkprimary ${toggleBar ? "flex-col justify-center items-center text-center " : ""} `} onClick={() => removeHover(map.value)}>
														<div>{val.icon}</div>
														<div className={toggleBar ? ' text-xs ' : ''}>{toggleBar && map.value !== "ACCOUNTS" ? val.name.split(" ")[1] : toggleBar && map.value === "ACCOUNTS" ? val.name.split(" ")[0] : val.name}</div>
													</NavLink>
												))
											}
										</div>
									)
								}
							</>
						))

					}
				</div>
				<div className='absolute bottom-0 w-full'>
					<NavLink to='/' className='w-auto px-5 py-4 flex items-center text-white gap-x-2 text-left hover:bg-red transition-all ease-linear'>
						<div><SidebarIcon Icon={RiLogoutBoxFill} /></div>
						<div className={`capitalize tracking-wide ${toggleBar ? 'hidden' : ''}`}>Logout</div>
					</NavLink>
				</div>
			</div>
			<main>{children}</main>
		</>
	);
}

export default Sidebar;