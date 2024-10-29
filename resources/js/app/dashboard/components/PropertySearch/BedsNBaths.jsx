import React, { useEffect, useState } from 'react'
import $ from 'jquery'

const BedsNBaths = ({setSearchValues}) => {
  const [value, setValue] = useState({
    beds:'any',
    baths:'any'
  })
  
  const onBedBathClick = (e)=>{
    e.preventDefault()

    let target = $(e.target)
    let action = target.data('action') 
    let value = target.data('value')

    setSearchValues(prev=>{

      return {...prev, beds_baths:{...prev?.beds_baths, [action]:value}}
     })

    setValue((prev) => {
      
      return {...prev, [action]:value}
    })

  }

  // useEffect(()=>{

  //   setSearchValues(prev=>{

  //     return {...prev, beds_baths:value}
  //    })
  // },[])
  
  return (
  <div className='w-full bg-white'>
    {/* Beds */}
    <div>
      <div className='mb-2'>
        <h1 className='text-xl font-semibold'>Beds</h1>
        <p className='text-xs'>Tap on a number to select </p>
      </div>
      <div className='flex'>
         {['any',1,2,3,4,5].map((v,i)=>{

          return (<button key={i} onClick={onBedBathClick} data-value={v} data-action="beds" className={`${v == value.beds ? 'bg-[#2d8997] text-white font-semibold' : ''} flex-1 capitalize border py-[8px] px-[0.5rem] 
          ${v==5 ? 'rounded-tr-md rounded-br-md' : ''} ${v=='any' ? 'rounded-bl-md rounded-tl-md' :''}`}>
            {v == 5 ? "5+" : v}
          </button>)
         })}
      </div>
    </div>

    {/* Baths */}
    <div className='mt-5'>
      <div className='mb-2'>
        <h1 className='text-xl font-semibold'>Baths</h1>
        <p className='text-xs'>Tap on a number to select</p>
      </div>
      <div className='flex'>
         {['any',1,2,3,4,5].map((v,i)=>{

          return (<button key={i} onClick={onBedBathClick} data-value={v} data-action='baths' className={`${v == value.baths ? 'bg-[#2d8997] text-white font-semibold' : ''} flex-1 capitalize border py-[8px] px-[0.5rem] 
          ${v==5 ? 'rounded-tr rounded-br' : ''} ${v=='any' ? 'rounded-bl-md rounded-tl-md' :''}`}>
            {v == 5 ? "5+" : v}
          </button>)
         })}
      </div>
    </div>
  </div>
  )
}

export default BedsNBaths