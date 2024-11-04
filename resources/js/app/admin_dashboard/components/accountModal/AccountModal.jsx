import React from 'react'
import { AccountModalLists } from '../../data/data'

import { setModalContent} from '../../store/mainSlice'

import {FaAngleRight} from "react-icons/fa"
import { useDispatch } from 'react-redux'



const AccountModal = () => {

  const dispatch = useDispatch()

  const handleOnClick = (list)=>{

  /* DIFFERENT FUNCTIONS TO RETURN BASED ON ACTIONS NEEDED */

    const AccountStatus = ()=>{
      alert('acoount status')
    }

    const switchDemo = ()=>{
      alert('switch demo')
    }

    const logOut = ()=>{
      alert('logged out')
    }

  /* WILL DISPLAY CONTENTS FOR MODALCONTENTS DEPENDING ON AN ID */
  const showContent = (list)=>{
   
    dispatch(setModalContent(list.id))
  }

  switch (list.id) {
    //Account status
    case 1:
      AccountStatus();
      break;
    // SWITCH TO DEMO
    case 6:
        switchDemo()
        break;
	
	case 7:
		logOut()
		break;

    default:
      showContent(list)
  }

}


  return (
    <div className='fixed left-0 top-16 h-[90vh] cursor-pointer z-[1000] w-screen'>
        <div className='mt-1 mr-2 md:mr-0 float-right shadow-sm bg-slate-100 shadow-black w-3/4 md:w-278 dark:bg-slate-800 px-1 py-1 rounded-lg'>
              {AccountModalLists.map((list, i)=>(
                <div key={i} className='flex justify-between hover:bg-slate-300 hover:dark:bg-slate-700 items-center dark:text-gray-50 
                font-bold px-2 py-2 md:px-3 md:py-3 rounded-lg' onClick={()=>handleOnClick(list)}>
                        <div className='flex items-center'>
                            <span className='text-lg md:text-3xl inline-block mr-3'>{list.icon}</span>
                            <span className='inline-block capitalize text-sm '>{list.title}</span>
                        </div>
                        {list.title === "account status" && <span className='text-xs p-1 text-gray-200 bg-amber-600'>not verified</span>}
                        {list.title !== "account status" && <span className='font-bold text-xl'><FaAngleRight/></span>}
                        
                </div>
                    
             ))}     
        </div>
    </div>
  )
}

export default AccountModal