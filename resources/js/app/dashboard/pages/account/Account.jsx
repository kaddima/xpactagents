import React from 'react'

import {Link, NavLink, Outlet,useLocation} from "react-router-dom"

import {FaRegUserCircle,FaUserEdit,FaUserPlus} from "react-icons/fa"
import {BsLock} from "react-icons/bs"

import {TbUsersPlus} from "react-icons/tb"
import { useState } from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const Account = () => {

const currentColor = 'blue';
const [page,setPage] = useState('')
const {pathname} = useLocation()
const currentUser = useSelector(state=>state.user.profile)

useEffect(()=>{

    let page = pathname.substring(pathname.lastIndexOf('/')+1)
    setPage(page)
},[pathname])

  return (
        <div className=' text-slate-800 w-full rounded-xl'>
            <h1 className='text-2xl font-bold '>Account</h1>
            <div className='flex text-xs mb-4'>
                <Link to="/dashboard">{'Dashbord > '}</Link>
                <Link to="/dashboard/account">{'Account > '}</Link>
                <p>{page}</p>
            </div>
            <div className='flex flex-col md:flex-row space-x-1 md:h-[66vh] overflow-hidden'>
                
                <div className='bg-white md:flex-shrink-0 md:w-[180px] pt-2 px-2 pb-2 md:h-full'>
                    
                    <div className='flex flex-row flex-wrap gap-3 md:flex-col md:h-full'>
                        {!currentUser?.first_name && <NavLink to='/dashboard/account/complete-registration'
                        style={({isActive})=>(isActive ? {borderColor:currentColor, borderBottomWidth:"2px"}:{})}
                        className='flex p-2 mt-2 font-semibold cursor-pointer items-center border-b rounded'>
                            <span className='text-xl text-gray-400'><FaUserPlus/></span>
                            <span className='pl-1 text-sm'>Complete profile</span>
                        </NavLink>}
                        
                        <NavLink to='/dashboard/account/profile' 
                        style={({isActive})=>(isActive ? {borderColor:currentColor, borderBottomWidth:"2px"}:{})}
                        className='flex p-2 mt-2 font-semibold cursor-pointer items-center border-b rounded'>
                            <span className='text-xl text-gray-400'><FaRegUserCircle/></span>
                            <span className='pl-1 text-sm'>Profile</span>
                        </NavLink>
                        <NavLink to='/dashboard/account/edit-profile' 
                        style={({isActive})=>(isActive ? {borderColor:currentColor, borderBottomWidth:"2px"}:{})}
                        className='flex p-2 mt-2 font-semibold cursor-pointer items-center border-b rounded'>
                            <span className='text-xl text-gray-400'><FaUserEdit/></span>
                            <span className='pl-1 text-sm'>Edit profile</span>
                        </NavLink>

                        <NavLink to='/dashboard/account/change-password'
                        style={({isActive})=>(isActive ? {borderColor:currentColor, borderBottomWidth:"2px"}:{})}
                        className='flex p-2 mt-2 font-semibold cursor-pointer items-center border-b  rounded'>
                            <span className='text-xl text-gray-400'><BsLock/></span>
                            <span className='pl-1 text-sm'>Change password</span>
                        </NavLink>
                        
                    </div>	
                </div>

                <div className='w-full relative h-full bg-white overflow-scroll'>
                    <Outlet/> 
                </div>
            </div>
        </div>

  )
}

export default Account