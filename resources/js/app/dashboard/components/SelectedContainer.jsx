import React from 'react'

import {MdRemove} from "react-icons/md"

const SelectedContainer = ({name,setValues}) => {
  
  if(!name){

  return null
  }

  const onRemove = ()=>{

  setValues((prev)=>{

    let prevAmenities = prev

    let newAmenities = []

    for (let i = 0; i < prevAmenities.length; i++) {

      if(prevAmenities[i].amenities == name){
        continue
      }

      newAmenities.push(prevAmenities[i])
      
    }

    return newAmenities;
  })
  }

  return (


  <div className='inline-block w-auto relative bg-white text-slate-600 font-[400] py-2 pl-2 pr-5'>
    <div className='flex items-center'>
      <div className='text-xs'>
        {name}
      </div>
    </div>

    <div className='absolute -top-3 right-0 bg-[#65c0cf] text-white rounded-full text-center h-5 w-5'>
      <button type='button' onClick={onRemove}><MdRemove/></button>
    </div>
  </div>
  )
}

export default SelectedContainer