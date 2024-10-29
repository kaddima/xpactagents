import React, { useEffect, useState } from 'react'
import { BsEye } from 'react-icons/bs'
import {BsHouseDoor} from "react-icons/bs"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate,useSearchParams } from 'react-router-dom'
import { getPropertyOfInterest} from '../../store/messageSlice' 
import Message from '../../components/message/Message'
import EmptyState from '../../components/EmptyState'
import Axios from '../../../utility/axios'
import { FaEllipsisV } from 'react-icons/fa'

const MessageLayout = () => {
	
  const currentUser = useSelector(state=>state.user.profile)
  const propertyOfInterest = useSelector(state=>state.message.propertyOfInterest)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [searchParams,setSearchParams] = useSearchParams();
  const [showPOI,setShowPOI] = useState(false)


  useEffect(()=>{
	dispatch(getPropertyOfInterest())
  },[])

  useEffect(()=>{

  //update the last seen
  Axios.post('/update-last-seen').then(data=>{
  //console.log(data)
  dispatch(updateUserInfo(data.data.data))
  }).catch(e=>{
  console.log(e.response)
  })

  // return ()=>{

  //   clearInterval(intID)
  // }

},[])


  if(!propertyOfInterest.length){

	return <EmptyState title='Empty messages' subtitle='You currently do not have any messages'/>
  }

  return (
  <div className=' text-slate-800 w-full rounded-xl h-full '>
    <h1 className='text-2xl font-bold bg-white px-3 md:bg-transparent md:px-0'>Messages</h1>
    <div className='flex flex-col md:flex-row space-x-1 h-[calc(100%-35px)] overflow-hidden relative'>
    
    <div className='bg-white md:flex-shrink-0 md:w-[180px] md:h-full pt-2 pb-2 text-black md:overflow-scroll z-[500]'>
      <div className='block md:hidden'>
      <FaEllipsisV onClick={()=>setShowPOI(prev=>!prev)} className='float-right'/>
      <div className='clear-both'></div>
      </div>
      <div className={`${showPOI ? 'translate-x-0':'translate-x-[-1000px]'} absolute  md:relative  md:translate-x-0 transition z-[200] bg-white`}>
      <h1 className='text-xs text-slate-500 uppercase font-bold pb-3 mb-3 px-2 border-b'>Properties of interest</h1>
      <div className='space-y-5 max-h-[60vh] overflow-y-scroll'>
        {propertyOfInterest.map((v,i)=>{

        return <div key={i} onClick={()=>{setSearchParams({'property-of-interest':v.property_id})}} className={`w-full px-2 text-[10px] transition cursor-pointer hover:bg-neutral-100 ${searchParams.get('property-of-interest') == v.property_id ? 'border-r-[2px] border-sky-600' : ''}`}>
          <h1 className='overflow-ellipsis overflow-hidden font-[400] whitespace-nowrap w-full uppercase'>{v.name}</h1>
          <div className='flex items-center justify-between'>
          <p className='text-[12px] font-semibold'>₦{parseFloat(v.amount).toLocaleString()}</p>
          <div className='flex items-center'>
            <BsHouseDoor/>
            <span>{v.property_type}</span>   
          </div>
          </div>
          <p className='overflow-ellipsis font-semibold overflow-hidden whitespace-nowrap w-full'>{v.address}</p>
          <div className='flex justify-between items-center'>
          <p><BsEye size={13} onClick={(e)=>{e.stopPropagation();navigate(`/dashboard/property/${v?.property_id}`)}} className='cursor-pointer'/></p>
          <p className=''>{v.bedrooms}beds | {v.bathrooms}baths </p>
          </div>
          
        </div>
        })}
        
      </div>
      </div>	   
    </div>

    <div className='w-full relative z-[200] h-full bg-white overflow-scroll'>
      <Message/> 
    </div>
    </div>
  </div>
  )
}

export default MessageLayout