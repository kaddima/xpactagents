import React from 'react'
import Container from '../Container'
import Search from './Search'
import UserMenu from './UserMenu'
import PropertySearch from "../PropertySearch/PropertySearch"
import Nav from './Nav'

import { MdDarkMode,MdOutlineDarkMode } from "react-icons/md";
import { useSelector,useDispatch } from 'react-redux'
import { changeDisplayMode } from '../../store/mainSlice'
import { displayName } from 'react-quill'

const Navbar = () => {
    const dispatch = useDispatch()
    const displayMode = useSelector(state=>state.main.displayMode)
    const changeDIsplayMode = ()=>{

        let mode;
        if(displayMode == "dark"){

            mode = 'white'

        }else{
            mode = 'dark'
        }

        dispatch(changeDisplayMode(mode))
    }
  
    return (
    <div className='fixe w-full z-10'>
        <div className='px-2 md:px-5 mx-auto'>
            <div className='flex items-center justify-between gap-3 md:gap-0'>
                <div className='md:w-[150px] relative'>
                    <a href="/" 
                    className="items-center text-xl 
                    font-extrabold tracking-tight cursor-pointer inline-block">
                        
                        <img src='/images/logo/logo.svg?v1.0' alt="" className='w-34 md:w-[125px] h-20 object-cover'/>
                        
                    </a>

                    <button onClick={changeDIsplayMode} className='absolute top-5 right-0'>
                        {displayMode === 'dark' ? <MdDarkMode size={24}/> : <MdOutlineDarkMode size={24}/>}
                        
                    </button>
                </div>
                {/* <Nav/> */}
                <div className='flex items-center md:justify-between justify-end md:flex-1'>
                    <div className='md:ml-8 md:flex-1'>
                        <PropertySearch/>
                    </div>
                    <div className='ml-2'>
                        <UserMenu/>
                    </div>
                    
                </div>
                
            </div>
            
        </div>
    </div>
  )
}

export default Navbar