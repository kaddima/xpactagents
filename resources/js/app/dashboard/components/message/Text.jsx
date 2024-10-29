import React from 'react'

const Text = ({className,text}) => {
  return (
  <div>
    <div className={`max-w-[230px] p-3 text-[13px] leading-none rounded-md ${className}`}>
      {text}
    </div>
    <div className='clear-both'></div>
  </div>
  
  )
}

export default Text