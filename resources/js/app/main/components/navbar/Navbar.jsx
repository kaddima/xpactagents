import React from 'react'
import Container from '../Container'
import Search from './Search'
import UserMenu from './UserMenu'
import PropertySearch from "../PropertySearch/PropertySearch"
import Nav from './Nav'

const Navbar = () => {
  return (
    <div className='fixe w-full bg-white z-10'>
        <div className='border-b-[1px] px-2 md:px-5 mx-auto'>
            <div className='flex items-center justify-between gap-3 md:gap-0'>
                <div className='md:w-[148px]'>
                    <a href="/" 
                    className="items-center flex text-xl 
                    font-extrabold tracking-tight cursor-pointer dark:text-white text-slate-900">
                        
                        <div className=''>
                            <img src='/images/logo/Logo.svg' alt="" className='w-32 md:w-[148px] h-20 md:h-[85px] object-cover'/>
                        </div>
                    </a>
                </div>
                {/* <Nav/> */}
                <div className='flex items-center md:justify-between justify-end md:flex-1'>
                    <div className='md:ml-8 md:flex-1'>
                        <PropertySearch/>
                    </div>
                    <div>
                        <UserMenu/>
                    </div>
                    
                </div>
                
            </div>
            
        </div>
    </div>
  )
}

export default Navbar