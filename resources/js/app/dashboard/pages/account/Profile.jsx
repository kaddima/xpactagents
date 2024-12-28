import React, { useState } from 'react'

import {MdEditLocation, MdEmail, MdOutlineLocationOn, 
    MdOutlineUploadFile, MdSignalWifiStatusbar4Bar, MdVerified} from "react-icons/md"

import {FaLocationArrow, FaWhatsapp,FaUpload } from 'react-icons/fa'
import { BsTelephoneFill } from 'react-icons/bs'
import EmptyState from '../../components/EmptyState'
import { useDispatch, useSelector } from 'react-redux'
import {formatDistance } from 'date-fns'
import { format } from 'date-fns'
import ImageUpload from '../../components/ImageUpload'
import { updateUserImage } from '../../store/userSlice'

const Profile = () => {

    const userData = useSelector(state=>state.user)
    const userDetails = userData.profile
    const [upload,setUpload] = useState(false)
    const dispatch = useDispatch()

    const updateProfileImage = (imageName)=>{
        dispatch(updateUserImage(imageName))
    }
    
  return (
    <div className='h-full text-sm p-5'>
        <h1 className='font-bold mb-5 text-2xl'>User Profile</h1>

        {userDetails?.profile_complete == 1 ? ( <div className='md:flex flex-col md:flex-row space-x-5'>
            <div className='md:w-3/5'>
                <div className='relative'>
                    
                    {upload ?  <div className='relative'>
                            <ImageUpload uploadType='user' getPhoto={true} fn={updateProfileImage} />
                        </div>

                        :

                        <div className=''>
                            {userDetails?.photo ? 
                            (<div>
                                <img src={userDetails.photo} alt="" className='h-[22rem] w-full object-contain'/>
                            </div>) : 
                            (<div className='border border-dashed border-slate-600 p-3 rounded'>
                                <h1 className='font-semibold'>No profile photo</h1>
                                <p className='text-sm'>Upload a photo of yourself</p> 
                            </div>)}
                        </div>
                    }
                   
                    {upload == false ? <div className='absolute bottom-2 right-2'>
                            <button onClick={()=>setUpload(true)} className='bg-black/80 text-white rounded p-2 text-sm'><FaUpload className='inline-block'/> Upload new image</button>
                        </div>
                        :
                        <div className='absolute top-2 right-2'>
                            <button onClick={()=>setUpload(false)} className='bg-black/80 text-white rounded p-2 text-sm'>Close upload</button>
                        </div>
                    }         
                </div>

                <div className='space-y-4 mt-4 pl-4 pr-2'>
                    <div className='border-b dark:border-b-slate-800 pb-3'>   
                        <div className='flex items-center space-x-2'>
                            <h1 className='text-2xl font-semibold'>{userDetails.first_name}
                            {userDetails.middle_name ? userDetails.middle_name : ''} {userDetails.last_name}</h1>
                            {userDetails.id_verified == 1 ? <MdVerified size={24} className='text-sky-600'/> : null}
                        </div>                 
                        <div className='flex items-center space-x-1 -mt-1 font-semibold'>
                            <span><MdOutlineLocationOn/></span>
                            <span>{userDetails.state}, Nigeria</span>
                        </div>

                        <div className='flex items-center mt-2'>
                            <h1><MdOutlineUploadFile className="inline-block mt-[-2px]"/> Registered: </h1>
                            <p className='pl-3 font-semibold'>{formatDistance(new Date(userDetails.created_at),new Date(),{addSuffix:true})}</p>
                        </div>
                    
                    </div>
                    <div className='flex items-center justify-between'>
                        <span className='font-semibold'><MdSignalWifiStatusbar4Bar className='inline-block'/> Account status:</span>
                        <span className='inline-block px-2 border border-green-500 text-green-800 rounded-xl'>Active</span>
                    </div>
                        
                    
                    <div className='pt-2'>
                        <p className='uppercase font-bold text-sm '>Contact information</p>

                        <div className='mt-4 space-y-2   font-bold'>
                            <div className='flex'>
                                <span className='w-32'><BsTelephoneFill className='inline-block'/> Phone</span>
                                <span className=' font-semibold'>{userDetails.phone}</span>
                            </div>
                            <div className='flex'>
                                <span className='w-32'><FaWhatsapp className='inline-block'/> Whatsapp</span>
                                <span className=' font-semibold'>{userDetails.whatsapp ? userDetails.whatsapp : '-'}</span>
                            </div>
                            <div className='flex'>
                                <span className='w-32'><MdEditLocation className='inline-block'/> Address</span>
                                <span className=' font-semibold'>{userDetails.address}</span>
                            </div>
                            <div className='flex'>
                                <span className='w-32'><MdEmail className='inline-block'/> Email</span>
                                <span className=' font-semibold'>{userDetails.email}</span>
                            </div>
                            <div className='flex'>
                                <span className='w-32'><FaLocationArrow className='inline-block'/> State/Lga</span>
                                <span className=' font-semibold'>{userDetails.state}/{userDetails.lga ? userDetails.lga : '-'}</span>
                            </div>
                        
                        </div>
                    </div>

                    <div>
                        <p className='uppercase font-bold text-sm '>Basic Information</p>
                        <div className='mt-3 space-y-3    font-bold'>
                            <div className='flex'>
                                <span className='w-32'>Birthday</span>
                                <span className=' font-semibold'>{userDetails.dob ? format(new Date(userDetails.dob),'dd MMM, y') : '-'}</span>
                            </div>
                            <div className='flex'>
                                <span className='w-32'>Gender</span>
                                <span className=' font-semibold'>{userDetails.gender}</span>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>) : <>
            <EmptyState title='Complete Registration' subtitle='We want to know more about you, please complete your registration to view your profile' 
            showReset={false}
            link={'/dashboard/account/complete-registration'} linkTitle='Complete registration'/>
        </>}
       
    </div>
  )
}

export default Profile