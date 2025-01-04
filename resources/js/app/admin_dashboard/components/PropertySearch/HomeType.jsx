import React, { useEffect, useState } from 'react'
import $ from "jquery"
import { homeType } from '../../data/data'



const HomeType = ({setSearchValues}) => {

    const [value, setValue] = useState(null)
    
    const onClick = (e)=>{
        e.preventDefault()

        let target = $(e.currentTarget)
        let val = target.data('value')

        setSearchValues(prev=>{

            return {...prev, property_type:{property_type:val}}
        })

        //console.log(target)

        setValue(val)
        
    }


  return (
    
    <div className='w-full'>
        
        <div className='flex flex-wrap gap-2'>
                {homeType.map((home,i)=>{

                return (

                <button key={i} onClick={onClick} data-value={home.label} className={`
                ${value && home.label.toLowerCase() == value.toLowerCase() ? 'bg-[#2d8997] text-white font-semibold' : ''} 
                flex-1 capitalize border dark:border-slate-800 py-[8px] px-[0.5rem] relative rounded-lg`}>
                    <div className='text-center'>
                        <p className='w-7 mx-auto'>{home.icon}</p>
                        <p>{home.label}</p>
                    </div>
                </button>
                
                )
                })}
                
        </div>
    </div>
   
  )
}

export default HomeType