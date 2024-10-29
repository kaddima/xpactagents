import React from 'react'

import {MdApartment, MdEditLocation, MdEmail, MdOtherHouses, 
  MdOutlineLandscape, MdOutlineLocationOn, 
  MdOutlineUploadFile, MdSignalWifiStatusbar4Bar, MdViewList} from "react-icons/md"

import { FaHouseUser, FaLocationArrow, FaWhatsapp } from 'react-icons/fa'
import { BsTelephoneFill } from 'react-icons/bs'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { useDispatch, useSelector } from 'react-redux'
import { parseISO,formatDistance } from 'date-fns'
import { format } from 'date-fns'
import ImageUpload from '../../components/ImageUpload'
import { updateUserImage } from '../../store/userSlice'

const Card = ({icon,title,data,className})=>{

  return <div className={`text-black/80 min-w-[120px] rounded-md ${className}`}>
    <div className={`flex items-center space-x-2`}>
      <p>{icon}</p>
      <div className='text-sm font-semibold flex items-center'>
        <span className='inline-block w-24'>{title}</span>
        <span className=''>{data}</span>
      </div>
      
    </div>
  </div>
}

const Profile = () => {

  const userData = useSelector(state=>state.user)
  const userDetails = userData.profile
  const dispatch = useDispatch()

  const updateProfileImage = (imageName)=>{
    dispatch(updateUserImage(imageName))
  }

  if(!userDetails?.first_name){
    return <Loader/>
  }
  
  return (
  <div className='bg-white h-full text-black/90 text-sm p-5'>
    <h1 className='font-bold mb-5 text-2xl'>User Profile</h1>

    {userDetails?.first_name ? ( <div className='md:flex flex-col md:flex-row space-x-5'>
      <div className='md:w-3/5'>
        <div>
          {userDetails?.photo ? 
          (<div>
            <img src={`/uploads/users/${userDetails.id}/profile-photo/${userDetails.photo}`} alt="" className='h-[22rem] w-full object-cover'/>
          </div>) : 
          (<div>
            <p className='text-sm'>Upload a photo of you</p> 
            <ImageUpload uploadType='user' getPhoto={true} fn={updateProfileImage} />
          </div>)}
             
        </div>

        <div className='space-y-4 text-gray-500 mt-4 pl-4 pr-2'>
          <div className='border-b pb-3'>   
            <h1 className='text-2xl font-semibold'>{userDetails.first_name}
             {userDetails.middle_name ? userDetails.middle_name : ''} {userDetails.last_name}</h1>         
            <div className='flex items-center space-x-1 -mt-1 font-semibold'>
              <span><MdOutlineLocationOn/></span>
              <span>{userDetails.state}, Nigeria</span>
            </div>

            <div className='flex items-center mt-2'>
              <h1><MdOutlineUploadFile className="inline-block mt-[-2px]"/> Registered: </h1>
              <p className='pl-3 font-semibold'>{formatDistance(parseISO(userDetails.created_at),new Date(),{addSuffix:true})}</p>
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
            <div className='mt-3 space-y-3  font-bold'>
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
      </div>
      <div className='flex-1'>
        <div className='border-b pb-5'>
          <h1 className='font-bold uppercase text-sm mb-2 text-gray-600'>Listings Details</h1>
          <div className='space-y-3'>
            <Card title="Total listings" data={userData.propertyCount} icon={<MdViewList size={20}/>}/>
            <Card title="For rents" data={userData.rentCount} icon={<FaHouseUser size={20}/>}/>
            <Card title="For sale" data={userData.forSellCount} icon={<MdApartment size={20}/>}/>
            <Card title="Short let" data={userData.shortLetCount} icon={<MdOtherHouses size={20}/>}/>
            <Card title="Land" data={userData.landCount} icon={<MdOutlineLandscape size={20}/>}/>
          </div>
            
        </div>
      </div>
    </div>) : <>
      <EmptyState title='Complete Registration' subtitle='We want to know more about you'/>
    </>}
     
  </div>
  )
}

export default Profile