import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'

const PhotoLists = ({propertyDetails,images=[],
    closePhotoManager}) => {

    
  return (
    <div className='fixed z-[200] inset-0 w-screen h-screen bg-black/20 py-8'>
        <div className='md:w-11/12 h-full mx-auto bg-white dark:bg-slate-900 rounded-2xl overflow-scroll pb-7'>
            <header className='border-b dark:border-b-slate-800 px-7 pt-5 h-16'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-lg font-semibold'>Photos({images.length})</h1>
                    <MdClose size={24} onClick={()=>{closePhotoManager(prev=>!prev)}} className='cursor-pointer'/>
                </div>
            </header>

            <div className='w-full px-3 pt-7 md:px-7' style={{height:"calc(100% - 4rem)"}}>
                <div className='flex-1 h-full overflow-scroll'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'>
                        {images && images.length > 0 && images.map((v,i)=>{
                            return(
                                <div key={i} className='w-full relative'>
                                    <img src={v.image_path} alt="" className='rounded w-full h-[220px] object-cover' />
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