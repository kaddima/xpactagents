import { useCallback, useEffect, useState } from "react"

import {IoMdClose} from "react-icons/io"
import Button from "../Button"

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  disabled,
  footer,
  btnLabel='Sign in'

}) => {

  const [showModal,setShowModal] = useState(isOpen)

  const handleClose = useCallback(()=>{

  if(disabled) return

  setShowModal(false)

  setTimeout(()=>{onClose()},300)
  },[disabled,onClose])

  useEffect(()=>{

  setShowModal(isOpen)
  
  },[isOpen])


  if(!isOpen){
  return null
  }

  return (
  <div className="fixed z-50 flex justify-center items-center overflow-x-hidden overflow-y-auto inset-0
  outline-none focus:outline-none bg-neutral-800/70">
  <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 h-full lg:h-auto md:h-auto mx-auto">
    <div className={`duration-300 h-full ${showModal ? 'translate-y-0 opacity-100' :'translate-y-full opacity-0'}`}>
    <div className="p-6 h-full md:h-auto rounded-lg shadow-lg relative bg-white space-y-5">
      <div className="rounded-t">
      <button
      onClick={handleClose} 
      className="float-right relative z-30">
        <IoMdClose size={18}/>  
      </button>
      <div className="clear-both"></div>
      <div className="text-lg font-semibold">
        {title}
      </div>
       </div>

      {/* BODY */}
      <div className="pt-2">
      {body}
      </div>

      {/* FOOTER */}
      <div>
      {footer}
      </div>
    </div>
      
    </div>
  </div>
  
  </div>
  )
}

export default Modal