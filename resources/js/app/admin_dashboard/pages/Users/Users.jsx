import React from 'react'

import {Link, NavLink, Outlet,useLocation} from "react-router-dom"

import {FaRegUser, FaRegUserCircle,FaUserEdit,FaUserPlus} from "react-icons/fa"
import {BsLock} from "react-icons/bs"

import {TbDashboard, TbUsersPlus} from "react-icons/tb"
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { MdSupervisedUserCircle } from 'react-icons/md'

const Users = () => {
    const currentColor = 'blue';
const [page,setPage] = useState('Overview')
const {pathname} = useLocation()
const currentUser = useSelector(state=>state.user.profile)

useEffect(()=>{

    let page = pathname.substring(pathname.lastIndexOf('/')+1)
    setPage(page)
},[pathname])

  return (
    <div className='rounded-xl h-full'>
            <h1 className='text-2xl font-bold '>All Users</h1>
            <div className='flex text-xs mb-4'>
                <Link to="/admin/dashboard">{'Admin> '}</Link>
                <Link to="/admin/users">{'all users> '}</Link>
                <p>{page}</p>
            </div>
            <div className='flex flex-col md:flex-row space-x-1 md:h-[calc(100%-70px)] overflow-hidden'>
                
                <div className='md:flex-shrink-0 md:w-[180px] pt-2 px-2 pb-2 md:h-full'>
                    
                    <div className='flex flex-row flex-wrap gap-3 md:flex-col md:h-full'>
                    
                        <NavLink to='/admin/users/overview' 
                        style={({isActive})=>(isActive ? {borderColor:currentColor, borderBottomWidth:"2px"}:{})}
                        className='flex p-2 mt-2 font-semibold cursor-pointer items-center border-b dark:border-b-slate-800 rounded'>
                            <span className='text-xl'><TbDashboard/></span>
                            <span className='pl-1 text-sm'>Overview</span>
                        </NavLink>
                        <NavLink to='/admin/users/users' 
                        style={({isActive})=>(isActive ? {borderColor:currentColor, borderBottomWidth:"2px"}:{})}
                        className='flex p-2 mt-2 font-semibold cursor-pointer items-center border-b dark:border-b-slate-800 rounded'>
                            <span className='text-xl '><FaRegUser/></span>
                            <span className='pl-1 text-sm'>Users</span>
                        </NavLink>

                        <NavLink to='/admin/users/agents'
                        style={({isActive})=>(isActive ? {borderColor:currentColor, borderBottomWidth:"2px"}:{})}
                        className='flex p-2 mt-2 font-semibold cursor-pointer items-center border-b dark:border-b-slate-800 rounded'>
                            <span className='text-xl'><MdSupervisedUserCircle/></span>
                            <span className='pl-1 text-sm'>Agents</span>
                        </NavLink>
                        
                    </div>	
                </div>

                <div className='w-full relative h-full overflow-scroll'>
                    <Outlet/> 
                </div>
            </div>
        </div>
  )
}

export default Users