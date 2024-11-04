import React,{useEffect, useState}  from 'react'
import {Link} from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'
import UserMenu from "./UserMenu"
	

// import logo from "../../data/logo-small.png"

import { toggleActiveMenu,setActiveMenu_screenSize, changeDisplayMode,
	} from '../../store/mainSlice'
import PropertySearch from '../PropertySearch/PropertySearch'
import { MdDarkMode, MdOutlineDarkMode } from 'react-icons/md'


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
			<div className='md:hidden relative'>
				<div className=''>
					<img src='/images/logo/logo.svg?v1.0' alt="" className='w-34 md:w-[125px] h-20 object-cover'/>
				</div>
				<button onClick={changeDIsplayMode} className='absolute top-5 right-0'>
					{displayMode === 'dark' ? <MdDarkMode size={24}/> : <MdOutlineDarkMode size={24}/>}
					
				</button>
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