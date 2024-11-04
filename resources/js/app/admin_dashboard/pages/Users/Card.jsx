import React from 'react'

const Card = ({icon,name,number,className}) => {
    return   <div className={`${className ? className : ''}   rounded-lg p-2 w-full bg-neutral-100 dark:bg-slate-900`}>
        <div className='flex justify-between items-center'>
           <div className='space-y-3'>
                <h1 className='text-lg font-bold'>{number}</h1>
                <p className='text-sm'>{name}</p>
           </div>
           <span>
               {icon} 
           </span>
        </div>
   
    </div>
}

export default Card