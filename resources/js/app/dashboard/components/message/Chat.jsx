import React, { useEffect } from 'react'
import Text from './Text'
import { MdSend } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import Axios from '../../../utility/axios'
import { formatDistance,parseISO,differenceInMinutes } from 'date-fns'
import $ from 'jquery'

const Chat = ({messages,setMsg,activeUserInfo}) => {
    const currentUser = useSelector(state=>state.user.profile)
    const [searchParams,setSearchParams] = useSearchParams()

    const property_of_interest_id = searchParams.get('property-of-interest');
    const conversation_id = searchParams.get('conversation-id');
    const {register,handleSubmit,reset} = useForm()

    const onlineStatus = useMemo(()=>{

        if(activeUserInfo){
            let laterDate = new Date(activeUserInfo.last_seen)
            let minuteDiff = differenceInMinutes(new Date(),new Date(laterDate))

            if(minuteDiff > 5){

               return false
            }

            return true;
        }
        
    },[activeUserInfo])

    const onSendMessage = (formData)=>{
        reset()
        Axios.post('/agents/message/send',{...formData,property_of_interest_id,conversation_id}).then(data=>{
            setMsg(data.data.data.reverse())
            let target = $('#chat-box')
            target.animate({scrollTop: target.prop('scrollHeight')});
        }).catch(e=>{
            console.log(e.response)
        })
       
    }

    useEffect(()=>{
        let target = $('#chat-box')
        target.animate({scrollTop: target.prop('scrollHeight')});
    },[])

  return (

        <div className='flex-1 w-full h-full relative'>
            <div className='flex items-center px-2 border-b py-2'>
                <div className='w-[40px] h-[40px] font-bold text-white flex justify-center items-center text-lg bg-slate-400 mr-2 border rounded-full text-center'>
                    {activeUserInfo?.first_name[0]}
                </div>
                <div className='flex-1 w-[170px]'>
                    <div className='text-[11px]'>
                        <h1 className=' font-bold text-sky-600'>{activeUserInfo?.first_name} {activeUserInfo?.last_name}{onlineStatus && <span className='bg-green-600 h-[6px] w-[6px] rounded-full inline-block ml-1'></span>}</h1>
                        <div className='opacity-70'>{onlineStatus ? 
                            'online' :
                            <div>
                                <p>Last seen: {formatDistance(parseISO(activeUserInfo.last_seen),new Date(),{addSuffix:true})}</p>
                            </div>
                             }
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full px-2 md:px-5 space-y-2 h-[74%] md:h-[77%] overflow-scroll' id='chat-box'>
                {messages.length > 0 && messages.map((v,i)=>{
                    return <Text key={i} text={v.body} 
                    className={`${currentUser.id == v.sender_id ? "bg-sky-600 text-white rounded-br-none float-right" : "bg-neutral-300 rounded-bl-none float-left"} `}/>
                })}
            </div>

            <div className='md:px-5'>
                <form action="" onSubmit={handleSubmit(onSendMessage)}>
                    <div className='flex items-center'>
                        <textarea {...register('message',{required:true})} row={1} className='form-textarea flex-1 h-10 border-0 outline-none bg-neutral-300 rounded-xl' placeholder='Write a message'></textarea>
                        <button type='submit' className='ml-3 w-[30px] h-[30px] rounded-full bg-sky-800 flex items-center justify-center'>
                            <MdSend className='text-white'/>
                        </button>
                    </div>
                </form>
            </div>
        </div>
                
       
  )
}

export default Chat