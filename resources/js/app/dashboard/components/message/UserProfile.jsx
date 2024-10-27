import React, { useMemo } from 'react'
import { FaPhoneSquareAlt, FaRegUserCircle} from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import PropertyCard from '../PropertyCard'
import { differenceInMinutes, parseISO } from 'date-fns'
import { formatDistance } from 'date-fns'

const UserProfile = ({activeUserInfo}) => {

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

  return (
    <div className='py-8'>
        <div className='mb-2 px-3'>
            <h1 className='text-sm uppercase font-semibold text-neutral-400'>User information</h1>
            <p className='text-xs text-neutral-500 leading-none'>The informations below are for the current user you are chatting with.</p>
        </div>
        
        <div className='text-center text-sm font-semibold'>
            <div className=''><FaRegUserCircle size={48} className='mx-auto'/></div>
            <h1>{activeUserInfo?.first_name} {activeUserInfo?.last_name}</h1>
            <div className='opacity-70'>{onlineStatus ? 
                'online' :
                <div>
                    <p>Last seen: {formatDistance(parseISO(activeUserInfo.last_seen),new Date(),{addSuffix:true})}</p>
                </div>
                    }
            </div>
        </div>

        <div className='flex text-sm mt-8 border-b pb-2'>
            <div className='w-2/4 text-center border-r'>
                <a href={`mailto:${activeUserInfo?.email}`} className='bg-sky-200 h-[40px] w-[40px] rounded-full flex justify-center items-center mx-auto'>
                    <MdEmail className='text-sky-800' size={20}/>
                </a>
                <p>Email</p>
            </div>
            <div className='w-2/4 text-center'>
                <a href={`tel:${activeUserInfo?.phone}`} className='bg-sky-200 h-[40px] w-[40px] rounded-full flex justify-center items-center mx-auto'>
                    <FaPhoneSquareAlt className='text-sky-800' size={20}/>
                </a>
                <p>Call</p>
            </div>
        </div>

        <div className='text-[13px] px-3 mt-3'>
            <h1 className='text-sm uppercase font-semibold mb-1 text-neutral-400'>Contact Info</h1>
            <p className='mb-2 font-semibold'>Email: <span>{activeUserInfo?.email}</span></p>
            <p>Phone: <span>{activeUserInfo?.phone}</span></p> 
        </div>
    </div>
  )
}

export default UserProfile