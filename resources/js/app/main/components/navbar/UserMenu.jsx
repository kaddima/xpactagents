import React,{useState,useCallback, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {AiOutlineMenu} from "react-icons/ai"
import {FaUserCircle} from "react-icons/fa"
import MenuItem from './MenuItem'

import { loginModalOpen } from '../../store/mainSlice'
import { registerModalOpen } from '../../store/mainSlice'
import { resetUserInfo } from '../../store/userSlice'
import { toast } from 'react-toastify'
import axios from 'axios'
import $ from 'jquery'
import { Link, useNavigate } from 'react-router-dom'
import { BsChatText, BsHeart } from 'react-icons/bs'
import { TbLogout } from 'react-icons/tb'
import { MdOutlineDashboard } from 'react-icons/md'

const UserMenu = () => {

  const [isOpen, setIsOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const currentUser = useSelector(state=>state.user?.userInfo)

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
  <div className='relative z-50' id='userMenu'>
  <div className='flex items-center gap-3'>
    <div className='hidden md:block py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer'>
    Add your property
    </div>

    <Link to={`/app/q-r`} className='hidden md:block'><BsChatText size={24}/></Link>
    <Link to={'/app/favorites'} className='hidden md:block'>
    <div className='relative'>
      <BsHeart className={``} size={24}/>
      <span className='absolute inline-block text-[16px] font-bold -top-2 bg-white -right-1'>{currentUser.favorite_properties && JSON.parse(currentUser.favorite_properties).length}</span>
    </div>
    </Link>

    <div onClick={toggleOpen} className='p-1 md:py-1 md:px-2 border-[1px] border-neutral-200 flex items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition'>
    <AiOutlineMenu size={24} className='hidden md:block'/>
    <div className=''>
      {currentUser?.email ? (<div className='uppercase bg-purple-800 text-white rounded-md px-2 font-bold'>
      {currentUser?.first_name && currentUser?.first_name.length ? (currentUser?.first_name[0]) : (currentUser?.email[0]) }
      </div>) :<FaUserCircle size={24}/>}
      
    </div>
    </div>
  </div>

  {isOpen && (

    <div className="absolute z-50 border bg-white rounded-xl shadow-md w-[80vw] md:w-[250px] overflow-hidden right-0 top-12 text-sm">
    <div className="flex flex-col cursor-pointer">
      {currentUser?.email ? (<>
      <MenuItem onClick={()=>{
          navigate('/app')
          toggleOpen()
          
        
        }} label='All Listings'
        icon={<MdOutlineDashboard/>}/>
      <MenuItem onClick={()=>{
          navigate('/app/favorites')
          toggleOpen()
          
        
        }} label='Favorites'
        icon={<BsHeart/>}/>
      <MenuItem onClick={()=>{
          navigate('/app/q-r')
          toggleOpen()
          
        
        }} label='Messages'
        icon={<BsChatText/>}/>

      <MenuItem onClick={()=>{
        dispatch(resetUserInfo())
        axios.get('/logout')
        toggleOpen()
        toast('You are logged out', {type:'success'})
        
      }} label='Log out'
      icon={<TbLogout/>}/>
   
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
      <MenuItem  label='Add your property'/>  
      <MenuItem  label='Help Center'/>
    </div>
    </div>
     
    )}
  </div>

)}

export default UserMenu