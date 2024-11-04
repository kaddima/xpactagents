import React, { useEffect, useState } from 'react'
import UserProfile from './UserProfile'
import UsersCard from './UsersCard'
import {useForm} from "react-hook-form"
import { useSearchParams } from 'react-router-dom'
import Axios from '../../../utility/axios'
import { useDispatch, useSelector } from 'react-redux'
import { updateMessages, updateParticipants } from '../../store/messageSlice'
import EmptyState from '../EmptyState'
import Chat from './Chat'
import { useMemo } from 'react'
import { BsChevronDoubleLeft } from 'react-icons/bs'

const Message = () => {
    const [searchParams,setSearchParams] = useSearchParams()
    const dispatch = useDispatch()
    const getPropertyOfInterest = useSelector(state=>state.message.propertyOfInterest)
    const participants = useSelector(state=>state.message.participants)
    const [messages,setMessages] = useState([])
    const [activeUserInfo,setActiveUserInfo] = useState(null)
    const [showUserPofile,setShowUserProfile] = useState(false)
    let property_of_interest = searchParams.get('property-of-interest')
    let conversation_id = searchParams.get('conversation-id')


    useEffect(()=>{
       
        if(property_of_interest && conversation_id){
            
            Axios.get('/user/message/messages',{params:{conversation_id,property_of_interest}}).then(data=>{

            for (let i = 0,len = getPropertyOfInterest.length; i <len;  i++) {
                if(getPropertyOfInterest[i].property_id == property_of_interest){

                    setActiveUserInfo(getPropertyOfInterest[i].creatorInfo)
                    break;
                }
                
            }
                setMessages(data.data.data.reverse())
            }).catch(e=>{
                console.log(e.response)
            })
        }

        return ()=>{

            setMessages([])
        }
    },[searchParams])

    // if(!messages.length){

    //     return <EmptyState title='Empty user interest' subtitle='Click on a property of interest to display messages'/>
    // }

  return (
    <div className='relative w-full h-full overflow-hidden'>  
        {!conversation_id && <EmptyState title='Conversation display' subtitle='Click a user to view your messages'/>}

        {conversation_id && messages.length > 0 && <div className='flex w-full h-full'>
            
            <Chat messages={messages} setMsg={setMessages} activeUserInfo={activeUserInfo}/>
                
            {/* <div className='w-[200px] bg-neutral-50'>
                <UserProfile activeUserInfo={activeUserInfo}/>
            </div> */}
            <div onClick={()=>setShowUserProfile(prev=>!prev)} className={`${showUserPofile ? 'translate-x-0' : 'translate-x-[200px] md:translate-x-0'} transition right-0 cursor-pointer absolute w-[200px] bg-neutral-100 dark:bg-slate-800 md:relative`}>
                <UserProfile activeUserInfo={activeUserInfo}/>
                <div className='h-[30px]   shadow-md w-[20px] md:hidden rounded-tl-full bg-white dark:bg-slate-700 dark:text-white text-sky-600 rounded-bl-full absolute top-2/4 -left-4 flex items-center'>
                    <BsChevronDoubleLeft size={18} fontWeight={800}/>
                </div>
            </div>
        </div>}
    </div>
  )
}

export default Message