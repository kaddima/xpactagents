import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import ImageUpload from './ImageUpload'
import { BsTrash } from 'react-icons/bs'
import axios from 'axios'
import $ from 'jquery'
import { toast } from 'react-toastify'

const PhotoLists = ({property_id,propertyDetails,images=[],
  closePhotoManager}) => {

  
  return (
  <div className='fixed z-[200] inset-0 w-screen h-screen bg-black/20 py-8'>
  <div className='w-11/12 h-full mx-auto bg-white rounded-2xl overflow-scroll pb-7'>
    <header className='border-b px-7 pt-5 h-16'>
    <div className='flex items-center justify-between'>
      <h1 className='text-lg font-semibold'>Photos({images.length})</h1>
      <MdClose size={24} onClick={()=>{closePhotoManager(prev=>!prev)}} className='cursor-pointer'/>
    </div>
    </header>

    <div className='w-full pt-7 px-7' style={{height:"calc(100% - 4rem)"}}>
    <div className='flex-1 h-full border overflow-scroll'>
      <div className='grid grid-cols-3 gap-2'>
      {images && images.length > 0 && images.map((v,i)=>{
        return(
        <div key={i} className='w-full relative'>
          <img src={`/uploads/users/${propertyDetails.creator_id}/${v}`} alt="" className='rounded w-full h-[220px] object-cover' />
        </div>
        ) 
      })}
      </div>
       
    </div>
    </div>
  </div>
  </div>
  )
}

export default PhotoLists