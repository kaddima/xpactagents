import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom"
import { TbDashboard } from "react-icons/tb"
import { MdDashboard, MdList, MdSupervisedUserCircle } from 'react-icons/md'
import { BsChatText } from 'react-icons/bs'
import { useDispatch } from 'react-redux'
import { getPropertyOfInterest } from '../../store/messageSlice'

const Agent = () => {
	const dispatch = useDispatch()
	const currentColor = 'blue';
	const agent_id = useParams().id
	const [page, setPage] = useState('overview')
	const { pathname } = useLocation()

	useEffect(() => {
		let page = pathname.substring(pathname.lastIndexOf('/') + 1)
		setPage(page)
	}, [pathname])

	useEffect(() => {
		//load the user's message as well
		dispatch(getPropertyOfInterest(agent_id))
	}, [])

	return (
		<div className='rounded-xl h-full'>
			<div>
				<h1 className='text-2xl font-bold '>Agent {'-'} <span className='text-lg font-semibold capitalize'>{page.replace('-', ' ')}</span></h1>
				<p className='text-sm leading-none'>This page data is specific to the selected agent</p>
			</div>


			<div className='flex flex-col md:flex-row space-x-1 h-[calc(100%-70px)] mt-5'>

				<div className='md:flex-shrink-0 md:w-[180px] pt-2 px-2 pb-2 md:h-full'>

					<div className='flex flex-row flex-wrap gap-3 md:flex-col md:h-full'>

						<NavLink to={`/admin/users/agent/${agent_id}/overview`}
							style={({ isActive }) => (isActive ? { borderColor: currentColor, borderBottomWidth: "2px" } : {})}
							className='flex p-2 mt-2 font-semibold cursor-pointer items-center border-b rounded'>
							<span className='text-xl text-gray-400'><TbDashboard /></span>
							<span className='pl-1 text-sm'>Overview</span>
						</NavLink>
						<NavLink to={`/admin/users/agent/${agent_id}/listings`}
							style={({ isActive }) => (isActive ? { borderColor: currentColor, borderBottomWidth: "2px" } : {})}
							className='flex p-2 mt-2 font-semibold cursor-pointer items-center border-b rounded'>
							<span className='text-xl text-gray-400'><MdDashboard /></span>
							<span className='pl-1 text-sm'>Listings</span>
						</NavLink>
						<NavLink to={`/admin/users/agent/${agent_id}/tours`}
							style={({ isActive }) => (isActive ? { borderColor: currentColor, borderBottomWidth: "2px" } : {})}
							className='flex p-2 mt-2 font-semibold cursor-pointer items-center border-b rounded'>
							<span className='text-xl text-gray-400'><MdList /></span>
							<span className='pl-1 text-sm'>Tours</span>
						</NavLink>

						<NavLink to={`/admin/users/agent/${agent_id}/agent-profile`}
							style={({ isActive }) => (isActive ? { borderColor: currentColor, borderBottomWidth: "2px" } : {})}
							className='flex p-2 mt-2 font-semibold cursor-pointer items-center border-b  rounded'>
							<span className='text-xl text-gray-400'><MdSupervisedUserCircle /></span>
							<span className='pl-1 text-sm'>Profile</span>
						</NavLink>
						<NavLink to={`/admin/users/agent/${agent_id}/messages`}
							style={({ isActive }) => (isActive ? { borderColor: currentColor, borderBottomWidth: "2px" } : {})}
							className='flex p-2 mt-2 font-semibold cursor-pointer items-center border-b  rounded'>
							<span className='text-xl text-gray-400'><BsChatText /></span>
							<span className='pl-1 text-sm'>Messages</span>
						</NavLink>

					</div>
				</div>

				<div className='w-full relative h-full overflow-scrol mt-5 md:mt-0'>
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default Agent