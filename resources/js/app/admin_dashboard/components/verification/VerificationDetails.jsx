import React, { useEffect, useState } from 'react'
import {MdVerified, MdClose, MdEditLocation, MdEmail, MdOutlineLocationOn, MdOutlineUploadFile, MdSignalWifiStatusbar4Bar } from 'react-icons/md'
import Axios from '../../../utility/axios'
import { BsCheck, BsTelephoneFill } from 'react-icons/bs'
import { FaLocationArrow, FaWhatsapp } from 'react-icons/fa'
import { format, parseISO } from 'date-fns'
import { formatDistance } from 'date-fns'
import { hideLoading, showLoading } from '../../../utility/loading'


const VerificationDetails = ({details,setDetailsModal}) => {

    const [userDetails,setUsersDetails] = useState(null)

    const onResponse = (e)=>{

        let type = e.target.dataset.type

        let body = {user_id:details.user_id,type,email:userDetails.email,doc_img:details.image}

        if(window.confirm(`${type} this request?`)){

            showLoading()

            Axios.post('/admin/users/verification-response',body).then(data=>{

                if(type.toLowerCase() == 'verify'){
                    setUsersDetails(prev=>{

                        return {...prev, id_verified:1}
                    })
                }else if(type.toLowerCase() == 'deny'){
                    setUsersDetails(prev=>{

                        return {...prev, id_verified:0}
                    })
                }
            }).catch(e=>{

                console.log(e.response)
            }).finally(()=>{

                hideLoading()
            })
        }
    
    }

    useEffect(()=>{

        Axios.get('/admin/users/user-details', {params:{user_id:details.user_id}}).then(data=>{
            setUsersDetails(data.data.data)
        }).catch(e=>{

            console.log(e.response)
        })

        return ()=>{
            setUsersDetails(null)
        }

    },[])
  return (
    <div className='fixed z-[900] inset-0 w-screen h-screen bg-black/20 md:py-8'>
        <div className='md:w-11/12 h-full mx-auto bg-white dark:bg-slate-800 rounded md:rounded-2xl overflow-hidden pb-7'>
            <header className='border-b dark:border-b-slate-700 px-7 pt-5 h-16'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-lg font-semibold'>Verification Details</h1>
                    <MdClose size={24} onClick={()=>{setDetailsModal(prev=>({...prev,open:false}))}} className='cursor-pointer'/>
                    
                </div>
            </header>

            <main className='w-full h-[calc(100%-64px)] md:h-[calc(100%-4rem)] overflow-scroll pb-5'>
                <div className='md:flex w-full px-3 md:px-7 '>
                    {/* Images */}
                    <div className='md:w-2/5'>
                        <div className='md:pr-3 mt-4 space-y-5'>
                            {userDetails?.photo &&  
                            (<div>
                                <h1 className='font-semibold mb-2'>Profile photo</h1>
                                <img src={`/uploads/users/${userDetails?.id}/profile-photo/${userDetails.photo}`} alt="" className='h-[22rem] w-full object-contain'/>
                            </div>)}
                            
                            {details.image && <div>
                                <h1 className='font-semibold mb-2'>Govt. issued card</h1>
                                <img src={`/uploads/users/${userDetails?.id}/profile-photo/${details.image}`} alt="" className='h-[22rem] w-full object-contain'/>
                                <p>Document type: <span className='capitalize text-sky-600 font-semibold italic'>{details?.doc_type && details?.doc_type.replace('_', ' ')}</span></p>
                            </div>}
                        </div>
                    </div>
                    {/* Details */}
                    <div className='md:w-3/5'>
                        {userDetails && <div className='md:flex w-full'>
                            <div className='md:w-3/5 space-y-4 mt-4 pr-2'>
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
                                <div className='flex items-center'>
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
                                            <span className=' font-semibold'>{userDetails.dob ? format(parseISO(userDetails.dob),'dd MMM, y') : '-'}</span>
                                        </div>
                                        <div className='flex'>
                                            <span className='w-32'>Gender</span>
                                            <span className=' font-semibold'>{userDetails.gender}</span>
                                        </div>
                                    </div>
                                </div>
                            </div> 

                            <div className='md:w-2/5'>
                                {userDetails?.id_verified == 2 ? <div className='py-5 px-5 bg-orange-800 rounded-lg text-white md:mt-5'>
                                    <div className='flex items-center space-x-1 md:text-lg'>
                                        <div className='flex items-center justify-center bg-green-800 h-6 w-6 rounded-full text-white'><BsCheck size={22}/></div>
                                        <h1 className='font-semibold'>Verification request</h1>
                                    </div>
                                    <p className='text-sm'>This user requested for a verification badge. You can use the "Verify" button to accept the request or deny it by clicking the "Deny" button</p>
                                
                                    <div className='flex justify-between items-center mt-5'>
                                        <button className='rounded-md border px-5 py-2 border-green-600' onClick={onResponse} data-type="Verify">Verify</button>
                                        <button className='rounded-md border px-5 py-2 border-white' onClick={onResponse} data-type="Deny">Deny</button>
                                    </div>
                                </div> : null}
                                
                                {userDetails?.id_verified == 1 ? <div className='py-5 px-5 bg-green-800 rounded-lg text-white md:mt-5'>
                                    <div className='flex items-center space-x-1 md:text-lg'>
                                        <div className='flex items-center justify-center bg-green-700 h-6 w-6 rounded-full text-white'><BsCheck size={22}/></div>
                                        <h1 className='font-semibold'>Verification Approved</h1>
                                    </div>
                                    <p className='text-sm'>This user now has a check mark next to their name.</p>
                                </div> : null}

                                {userDetails?.id_verified == 0 ? <div className='py-5 px-5 bg-red-800 rounded-lg text-white md:mt-5'>
                                    <div className='flex items-center space-x-1 md:text-lg'>
                                        <div className='flex items-center justify-center bg-red-600 h-6 w-6 rounded-full text-white'><BsCheck size={22}/></div>
                                        <h1 className='font-semibold'>Verification Denied</h1>
                                    </div>
                                    <p className='text-sm'>This user's request has been denied.</p>
                                </div> : null}
                                
                            </div>
                        </div>}    
                    </div>
                </div>
            </main>
        </div>
    </div>
  )
}

export default VerificationDetails