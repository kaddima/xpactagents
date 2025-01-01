import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, NavLink, useNavigate } from "react-router-dom"
import axios from 'axios'
import $ from 'jquery'

import { MdDashboard, MdOutlineCreateNewFolder, MdOutlineLogout } from 'react-icons/md'

import { navLinks } from '../../data/data'
import Axios from '../../../utility/axios'

const Aside = ({ setIsOpen }) => {

	const handleCloseSideBar = () => { setIsOpen(false) }

	return (
		<div className='h-full md:overflow-hidden overflow-auto flex flex-col  '>
			<div>
				<div className='mt-2 space-y-3 overflow-auto'>

					<div className="">
						<NavLink
							to={`/dashboard`}
							onClick={handleCloseSideBar}
							className={`flex space-x-2 items-center py-2 pl-5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 relative`}
						>
							<span className='text-xl'><MdDashboard /></span>
							<div>
								<p>Dashboard</p>
							</div>
						</NavLink>
					</div>
					<div className="hover:opacity-80 ">
						<NavLink
							to={`/dashboard/create-property`}
							onClick={handleCloseSideBar}
							className={({ isActive }) => isActive ? 'flex space-x-2 items-center bg-theme-color transition-all text-white py-3 pl-5 text-sm font-semibold hover:opacity-95 relative dark:bg-slate-800' : 'flex space-x-2 items-center bg-theme-color transition-all text-white py-3 pl-5 text-sm font-semibold hover:opacity-95 relative'}

						>
							<span className='text-xl'><MdOutlineCreateNewFolder /></span>
							<div>
								<p></p>Create Listing
							</div>
						</NavLink>
					</div>
					{navLinks.map((link, i) => (
						<div key={i} className="">
							<NavLink
								to={`/dashboard/${link.name.toLowerCase().replace(/(\/)|\s/, '-')}`}
								key={link.name}
								onClick={handleCloseSideBar}
								className={({ isActive }) => isActive ? 'flex space-x-2 items-center py-2 pl-5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 relative bg-neutral-100 dark:bg-slate-800' : 'flex space-x-2 items-center py-2 pl-5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 relative'}
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

							</NavLink>
						</div>
					))}
				</div>

				<div className='w-full '>
					<a onClick={() => {
						Axios.post('/logout').then(data => {
							location.href = "/"
						})
					}} className="mt-3 py-2 pl-5 flex space-x-2 items-center text-sm font-semibold hover:bg-gray-100 dark:hover:bg-slate-800">
						<span className='text-xl'><MdOutlineLogout /></span>
						<p>Logout</p>
					</a>
				</div>

			</div>
		</div>
	)
}

export default Aside