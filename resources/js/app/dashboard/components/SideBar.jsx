import React, {useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {Link, NavLink, useNavigate} from "react-router-dom"
import axios from 'axios'
import $ from 'jquery'

import {MdDarkMode, MdDashboard, MdOutlineCreateNewFolder,MdOutlineDarkMode,MdOutlineLogout} from 'react-icons/md'


//action
import { toggleActiveMenu,setActiveMenu_screenSize,  setModalContent, changeDisplayMode} from '../store/mainSlice'

import {navLinks} from '../data/data'

const Sidebar = () => {
	const currentUser = useSelector(state=>state.user.profile)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const activeMenu = useSelector(state=>state.main.navMenu.activeMenu)
	const screenSize = useSelector(state=>state.main.screenSize)
	const handleCloseSideBar = ()=>{
		if (activeMenu && screenSize <= 900) {
			dispatch(setActiveMenu_screenSize({active:false}))
		}
	}

	const displayMode = useSelector(state=>state.main.displayMode)
    const changeDIsplayMode = ()=>{

        let mode;
        if(displayMode == "dark"){

            mode = 'white'

        }else{
            mode = 'dark'
        }

        dispatch(changeDisplayMode(mode))
    }


	return (
		<div className='h-full md:overflow-hidden overflow-auto flex flex-col bg-neutral-100 dark:bg-slate-900'>
				<div className='mr-5 relative'>
					<a href="/" 
					className="items-center ml-3 flex text-xl 
					font-extrabold tracking-tight cursor-pointer">
						
						<div >
							<img src='/images/logo/logo.svg?v1.0' alt="" className='w-34 md:w-[125px] h-20 object-cover'/>
						</div>
					</a>
					<button onClick={changeDIsplayMode} className='absolute top-5 right-0'>
						{displayMode === 'dark' ? <MdDarkMode size={24}/> : <MdOutlineDarkMode size={24}/>}
					
					</button>
				</div>
				<div>
				<div className='mt-2 space-y-3 overflow-auto'>
					
					<div className="">
						<NavLink 
							to={`/dashboard`} 
							onClick={handleCloseSideBar}
							className={`flex space-x-2 items-center py-2 pl-5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 relative`}
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
							className={({isActive})=>isActive ? 'flex space-x-2 items-center bg-theme-color transition-all text-white py-3 pl-5 text-sm font-semibold hover:opacity-95 relative dark:bg-slate-800':'flex space-x-2 items-center bg-theme-color transition-all text-white py-3 pl-5 text-sm font-semibold hover:opacity-95 relative'}
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
								className={({isActive})=>isActive ? 'flex space-x-2 items-center py-2 pl-5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 relative bg-neutral-100 dark:bg-slate-800' : 'flex space-x-2 items-center py-2 pl-5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 relative'}
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
				{currentUser.is_admin == 1 && <div className="">
					<a 
						href={`/admin/dashboard`} 
						onClick={handleCloseSideBar}
						className={`flex space-x-2 items-center py-2 mt-1 pl-5 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 relative`}
					>
						<span className='text-xl'><MdDashboard/></span>
						<div>
							<p>Admin Dashboard</p>
						</div>
					</a>	
				</div>}
				<div className='w-full '>
					<a href="/logout" className="mt-3 py-2 pl-5 flex space-x-2 items-center text-sm font-semibold hover:bg-gray-100 dark:hover:bg-slate-800">
						<span className='text-xl'><MdOutlineLogout/></span>
						<p>Logout</p>
					</a>
				</div>
				
			</div>
		</div>
	)
}

export default Sidebar