import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {Link, NavLink, useNavigate} from "react-router-dom"
import axios from 'axios'
import $ from 'jquery'

import {MdDashboard, MdOutlineCreateNewFolder,MdOutlineLogout} from 'react-icons/md'

import {navLinks} from '../../data/data'

const Aside = ({setIsOpen}) => {

  const handleCloseSideBar = ()=>{setIsOpen(false)}

	return (
		<div className='h-full md:overflow-hidden overflow-auto flex flex-col bg-white'>
				<div className='mr-5'>
					<a href="/" 
					className="items-center ml-3 flex text-xl 
					font-extrabold tracking-tight cursor-pointer dark:text-white  text-slate-900">
						
						<div className='w-40 h-24'>
							<img src='/images/logo/Logo.svg' alt="" className='w-full'/>
						</div>
					</a>
				</div>
				<div>
				<div className='mt-2 space-y-3 overflow-auto'>
					
					<div className="">
						<NavLink 
							to={`/dashboard`} 
							onClick={handleCloseSideBar}
							className={`flex space-x-2 items-center text-slate-600 py-2 pl-5 text-sm font-semibold hover:bg-slate-100 relative`}
						>
							<span className='text-xl'><MdDashboard/></span>
							<div>
								<p>Dashboard</p>
							</div>
						</NavLink>	
					</div>
					<div className="hover:opacity-80 ">
						<NavLink 
							to={`/dashboard/create-property`} 
							onClick={handleCloseSideBar}
							className="flex space-x-2 items-center bg-theme-color transition-all text-white py-2 pl-5 text-sm font-semibold hover:opacity-95 relative"
							style={({isActive})=>(isActive ? {background : `rgb(241 245 249)`,color:'rgb(71 85 105)'} : {} )}
						>
							<span className='text-xl'><MdOutlineCreateNewFolder/></span>
							<div>
								<p></p>Create Listing
							</div>
						</NavLink>	
					</div>	
					{navLinks.map((link, i)=>(
						<div key={i} className="">
							<NavLink 
								to={`/dashboard/${link.name.toLowerCase().replace(/(\/)|\s/,'-')}`} 
								key={link.name}
								onClick={handleCloseSideBar}
								className="flex space-x-2 items-center text-slate-600 py-2 pl-5 text-sm font-semibold hover:bg-slate-100 relative"
								style={({isActive})=>(isActive ? {background : `rgb(241 245 249)`} : {} )}
							>
								<span className='text-xl'>{link.icon}</span>
								<div>
									<p>{link.name}</p>

									{link.subject && (
										<p className='text-xs opacity-50 -mt-1'>
											{link.subject}
										</p>
									)}
								</div>
								{link.name.toLowerCase() == 'appointments' && (
									<div className='w-5 h-5 rounded-full text-center text-white font-bold bg-theme-color'>
										<span>{appointmentsCount}</span>
									</div>
									)}
							</NavLink>	
						</div>	
					))}
				</div>

				<div className='w-full '>
					<a href="/logout" className="mt-3 py-2 pl-5 flex space-x-2 items-center text-slate-600 text-sm font-semibold hover:bg-gray-100">
						<span className='text-xl'><MdOutlineLogout/></span>
						<p>Logout</p>
					</a>
				</div>
				
			</div>
		</div>
	)
}

export default Aside