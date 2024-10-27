import React,{useEffect, useState}  from 'react'
import {Link} from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import UserMenu from "./UserMenu"
	

// import logo from "../../data/logo-small.png"

import { toggleActiveMenu,setActiveMenu_screenSize,
	} from '../../store/mainSlice'
import PropertySearch from '../PropertySearch/PropertySearch'


const NavButton = ({title, customFunc,icon,color,dotColor})=>{
return	(
	<button title={title} type='button'
			style={{color}}
			className="relative text-xl rounded-full p-3 hover:bg-light-gray" 
			onClick={customFunc}>
			<span style={{background:dotColor}}
			className="absolute inline-flex rounded-full border right-2 top-2"/>
			{icon}

	</button>
	)
}

const Navbar = () => {

	
	const dispatch = useDispatch()

	const[screenSize,setScreenSize] = useState()

	useEffect(()=>{
							//get the screen size
		const handleResize = ()=>setScreenSize(window.innerWidth)

		window.addEventListener('resize', handleResize)

		handleResize()

		return ()=>window.removeEventListener('resize', handleResize)
	},[])

	useEffect(()=>{

		if (screenSize <= 900) {
			dispatch(setActiveMenu_screenSize({active:false,screenSize}))
		}else{
			dispatch(setActiveMenu_screenSize({active:true,screenSize}))
		}

	},[screenSize])

	return (
		<div className='flex justify-between relative items-center w-full h-[90px] px-2 md:px-5'>
			<div className='md:hidden'>
				<div className='w-32 h-20 '>
					<img src='/images/logo/Logo.svg' alt="" className='w-full'/>
				</div>
			</div>
			<div className='flex items-center md:justify-between justify-end gap-2 w-full'>
				<div >
					<PropertySearch/>
				</div>
				<div>
					<UserMenu/>
				</div>
				
			</div>
			
		</div>
	)
}

export default Navbar