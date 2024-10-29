import React from 'react'

const MenuItem = ({label,onClick,className,icon=false}) => {
  return (
  <div 
  onClick={onClick}
  className={`px-4 py-3 hover:bg-neutral-100 transition ${className}`}>
    <div className='flex items-center w-full'>
      <p className='mr-2'>{icon}</p>
      <div className='w-full'>{label}</div>
    </div>
  </div>
  )
}

export default MenuItem