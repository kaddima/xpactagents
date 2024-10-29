import React,{useState,useCallback} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import $ from 'jquery'
import {AiOutlineMenu} from "react-icons/ai"
import {BsChatText, BsHeart} from "react-icons/bs"
import {FaAddressCard, FaSignal, FaUserCircle} from "react-icons/fa"
import MenuItem from './MenuItem'

import { resetUserInfo } from '../../store/userSlice'
import { toast } from 'react-toastify'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { TbLogout } from 'react-icons/tb'
import { GrSchedule } from 'react-icons/gr'
import Aside from '../aside/Aside'

const UserMenu = () => {

  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const currentUser = useSelector(state=>state.user.profile)

  const toggleOpen = useCallback(()=>{
    setIsOpen((value)=>!value)
  },[]) 

  useEffect(()=>{
    $(function(){

      var handler = function(event){
        // if the target is a descendent of container do nothing
        if($(event.target).is("#userMenu, #userMenu *")) return;

        setIsOpen(false)
        }
        
        $(document).on("click", handler);
    })
  },[])

  return (
  <div className='relative' id='userMenu'>
    <div className='flex items-center gap-2'>
      <Link to={`/dashboard/q-r`} className=''><BsChatText size={24}/></Link>
      <Link to={'/dashboard/favorites'} className=''>
        <div className='relative'>
          <BsHeart className={``} size={24}/>
          <span className='absolute inline-block text-[16px] font-bold -top-2 bg-white -right-1'>{currentUser.favorite_properties && JSON.parse(currentUser.favorite_properties).length}</span>
        </div>
      </Link>
      <div onClick={toggleOpen} className='p-2 md:p-4 md:py-1 md:px-2 md:border-[1px] border-neutral-200 flex items-center md:gap-3 rounded-full cursor-pointer hover:shadow-md transition'>
        <AiOutlineMenu size={24}/>
        <div className='hidden md:block'>
          <FaUserCircle size={24}/>
        </div>
      </div>
    </div>

    {isOpen && (
      
      <div className="absolute z-[700] border bg-white md:h-[450px] rounded-xl shadow-md w-[90vw] md:w-[250px] overflow-scroll right-0 top-12 text-sm">
        <div className="flex flex-col cursor-pointer">
          {currentUser?.email ? (<>
            <MenuItem onClick={()=>{
              navigate(`${currentUser?.profile_complete == 1 ? '#' : '/dashboard/account/complete-registration'}`)  
              toggleOpen()}} 
              icon={<FaSignal/>}
              label={<div className='flex justify-between w-full items-center'>
                <h1>Account Status</h1>
                <p className={`font-semibold ${currentUser?.profile_complete == 1 ? 'text-green-600 border border-green-600 px-2 rounded-md' : 'text-red-600'}`}>{currentUser?.profile_complete == 1 ? 'Active' : 'Inactive'}</p>
              </div>}/>

            <div className=''>
              <Aside setIsOpen={setIsOpen}/>
            </div>
            {/* <MenuItem onClick={()=>{
              navigate('/dashboard/tours')  
              toggleOpen()}} 
              className={'hidden md:block'}
              icon={<GrSchedule/>}
              label='Tour Request'/>
            <MenuItem onClick={()=>{
              navigate('/dashboard/create-property')  
              toggleOpen()}} 
              className={'hidden md:block'}
              icon={<FaAddressCard/>}
              label='Create property'/> */}

             
{/*             
            <MenuItem onClick={()=>{
              dispatch(resetUserInfo())
              axios.get('/logout')
              toggleOpen()
              location.href = '/'
              toast('You are logged out', {type:'success'})             
              }} 
              className={'hidden md:block'}
              icon={<TbLogout/>}    
              label={'Logout'}/> */}

            
          </>) : (<>
            <MenuItem onClick={()=>{
              toggleOpen()
              dispatch(loginModalOpen())
            }}  label='Login'/>  
            <MenuItem onClick={()=>{
              toggleOpen()
              dispatch(registerModalOpen())
            }} label='Sign up'/> 
          </>)}
         
        </div> 
        <div className='border-t'> 
          <MenuItem  label='Help Center'/>
        </div>
      </div>
       
      )}
  </div>

)}

export default UserMenu