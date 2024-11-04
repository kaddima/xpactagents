import React, { useEffect, useState } from 'react'
import { BsEye } from 'react-icons/bs'
import {BsHouseDoor} from "react-icons/bs"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate,useParams,useSearchParams } from 'react-router-dom' 
import Message from '../../components/message/Message'
import EmptyState from '../../components/EmptyState'
import { FaEllipsisV } from 'react-icons/fa'
import Axios from '../../../utility/axios'

const MessageLayout = () => {
	
  const agent_id = useParams().id
  const [propertyOfInterest,setPropertyOfInterest] = useState([])
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [searchParams,setSearchParams] = useSearchParams();
  const [showPOI,setShowPOI] = useState(false)


  useEffect(()=>{
	Axios.get('/agent/message/property-of-interest',{params:{agent_id}}).then(result=>{
        setPropertyOfInterest(result.data.data.property_of_interest)
    }).catch(e=>{
        console.log(e.response)
    })
  },[])


  if(!propertyOfInterest.length){

	return <EmptyState title='Empty messages' subtitle='You currently do not have any messages'/>
  }

  return (
    <div className='w-full rounded-xl h-full min-h-[70vh]'>
            <h1 className='text-2xl font-bold px-3 md:bg-transparent md:px-0'>Messages</h1>
            <div className='flex flex-col md:flex-row space-x-1 h-[calc(100%-30px)] overflow-hidden relative'>
                
                <div className='bg-white dark:bg-slate-900 md:flex-shrink-0 md:w-[180px] md:h-full pt-2 md:overflow-scroll z-[500]'>
                    <div className='block md:hidden pr-3'>
                        <div className='float-right flex items-center text-xs font-semibold cursor-pointer' onClick={()=>setShowPOI(prev=>!prev)} ><FaEllipsisV /> <span>Show POI</span></div>
                        <div className='clear-both'></div>
                    </div>
                    <div className={`${showPOI ? 'translate-x-0':'translate-x-[-1000px]'} absolute  md:relative  md:translate-x-0 transition z-[200] bg-white dark:bg-slate-900 `}>
                        <h1 className='text-xs uppercase font-bold pb-3 mb-3 px-2 border-b dark:border-b-slate-700'>Properties of interest</h1>
                        <div className='space-y-5 max-h-[60vh] overflow-y-scroll'>
                            {propertyOfInterest.map((v,i)=>{

                                return <div key={i} onClick={()=>{setSearchParams({'property-of-interest':v.property_id})}} className={`w-full px-2 text-[10px] transition cursor-pointer hover:bg-neutral-100 dark:hover:bg-slate-800 ${searchParams.get('property-of-interest') == v.property_id ? 'border-r-[2px] border-sky-600' : ''}`}>
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

                <div className='w-full relative z-[200] h-full overflow-scroll'>
                    <Message/> 
                </div>
            </div>
        </div>
  )
}

export default MessageLayout