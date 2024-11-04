import React, { useState } from 'react'
import $ from 'jquery'

const Time = ({stateFn}) => {

    const [value, setValue] = useState()
    
    const onTimeClick = (e)=>{
        e.preventDefault()

        let target = $(e.target)
        let value = target.data('value')
        let text = target.text()
        setValue(value)

        stateFn(prev=>{

          return {...prev,time:text}
        })

    }
    
  return (
    <div className='w-full  '>
        {/* Beds */}
        <div className='grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4'>
                {[10,11,12,1,2,3,4,5,6].map((v,i)=>{

                return (
                <button key={i} onClick={onTimeClick} data-value={v} 
                className={`${v == value ? 'bg-[#2d8997] text-white font-semibold' : ''} 
                capitalize border dark:border-slate-800 p-[0.5rem] md:py-[1rem] md:px-[1rem] rounded-md`}>
                    {(v == 12 || v<=6) ? `${v}:00 PM` : `${v}:00 AM`}
                </button>)
                })}
        </div>
    </div>
  )
}

export default Time