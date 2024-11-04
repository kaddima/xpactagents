import React, { useEffect, useState } from 'react'
import { BsEye } from 'react-icons/bs'
import {BsHouseDoor} from "react-icons/bs"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate,useSearchParams } from 'react-router-dom'
import { getPropertyOfInterest} from '../../store/messageSlice' 
import Message from '../../components/message/Message'
import EmptyState from '../../components/EmptyState'
import Container from '../../components/Container'
import Axios from '../../../utility/axios'
import { FaEllipsisV } from 'react-icons/fa'

const MessageLayout = () => {

  const propertyOfInterest = useSelector(state=>state.message.propertyOfInterest)
  const msgNotifier = useSelector(state=>state.message.notification)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showPOI,setShowPOI] = useState(false)
  const [searchParams,setSearchParams] = useSearchParams();


  useEffect(()=>{
	dispatch(getPropertyOfInterest())
  },[])

  useEffect(()=>{
   // update the last seen
    Axios.post('/update-last-seen').then(data=>{
        dispatch(updateUserInfo(data.data.data))
    }).catch(e=>{
        console.log(e.response)
    })

},[])

  if(!propertyOfInterest.length){

	return <EmptyState title='Empty messages' subtitle='You currently do not have any messages'/>
  }

  return (
  
    <div className='w-full rounded-xl h-full max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 pt-5'>
            <h1 className='text-2xl font-bold '>Messages</h1>
            <div className='flex flex-col md:flex-row space-x-1 md:h-[calc(100%-70px)] overflow-hidden mt-5'>
                  
            <div className='bg-neutral-100 dark:bg-slate-900 md:flex-shrink-0 md:w-[200px] pt-2 pb-2 md:h-full'>
                <div className='block md:hidden'>
                    <FaEllipsisV onClick={()=>setShowPOI(prev=>!prev)} className='float-right'/>
                    <div className='clear-both'></div>
                </div>
                <div className={`${showPOI ? 'translate-x-0':'translate-x-[-1000px]'} absolute  md:relative  md:translate-x-0 transition z-[200] md:bg-transparent shadow-lg md:shadow-none`}>
                    <h1 className='text-xs uppercase font-bold pb-3 mb-3 px-2 border-b dark:border-b-slate-800'>Properties of interest</h1>
                    <div className='space-y-5 max-h-[60vh] overflow-y-scroll'>
                        {propertyOfInterest?.map((v,i)=>{

                            return <div key={i} onClick={()=>{setSearchParams({'property-of-interest':v.property_id,'conversation-id':v.conversation_id})}} className={`w-full px-2 text-[10px] transition relative cursor-pointer hover:bg-neutral-100 dark:hover:bg-slate-800 ${searchParams.get('property-of-interest') == v.property_id ? 'border-l-[2px] border-sky-600' : ''}`}>
                                {msgNotifier.map((j,k)=>{

                                    if(v.property_id == j.property_id){

                                        return <div key={k} className='notification' style={{top:'2px',right:'6px'}}></div>
                                    }
                                })}
                            
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
                                <p><BsEye size={13} onClick={(e)=>{e.stopPropagation();navigate(`/app/property/${v?.property_id}`)}} className='cursor-pointer'/></p>
                                <p className=''>{v.bedrooms}beds | {v.bathrooms}baths </p>
                            </div>
                            
                            </div>
                        })}
                        
                    </div>
                </div>    
            </div>

            <div className='w-full relative h-full overflow-scroll'>
                <Message/> 
            </div>
        </div>
	</div>
  
  )
}

export default MessageLayout