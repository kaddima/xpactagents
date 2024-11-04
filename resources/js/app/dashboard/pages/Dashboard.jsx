import React from 'react'
import _ from 'lodash'
import { Link, NavLink,Outlet, useNavigate } from 'react-router-dom'


import { FaEllipsisH,FaHouseUser,FaUsers,FaThList, FaRegUserCircle, FaUserCircle } from 'react-icons/fa'
import { MdOutlineShowChart,MdBungalow,MdHouse,MdLandscape, MdClose, MdCheck, MdApartment, MdHourglassEmpty } from 'react-icons/md'
import { useSelector } from 'react-redux'
import Categories from '../components/Categories'
import { BsEye, BsHouseDoor, BsPieChartFill } from 'react-icons/bs'
import { TbChartCandle, TbHourglassEmpty } from 'react-icons/tb'
import MessageLayout from './Messages/MessageLayout'
import EmptyState from '../components/EmptyState'


const Card = ({icon,name,number})=>{

    return   <div className='rounded-lg bg-main-bg dark:bg-slate-900 p-2 w-full'>
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

const Dashboard = () => {
    //get state account
    let propertyDetails = useSelector(state=>state.user.propertyDetails)
    const navigate = useNavigate()

  return (
    <div className='w-full h-full px-3'>
        <div className='pt-5'>
            <h1 className='text-2xl font-bold'>Dashboard</h1>

            <div className='mt-5 flex flex-col gap-3 md:flex-row'>
                <div className='md:w-2/4'>  
                    <div className='relative gap-2 md:gap-5 flex items-center w-full overflow-hidden bg-[#ff6746] rounded-xl p-3'>
                        <div className='absolute bg-total-img right-0 w-1/4 h-full bg-no-repeat bg-[100%_100%]'></div>
                        <span>
                            <svg className='w-[40px] h-[40px] md:w-[80px] md:h-[80px]' viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M31.8333 79.1667H4.16659C2.33325 79.1667 0.833252 77.6667 0.833252 75.8333V29.8333C0.833252 29 1.16659 28 1.83325 27.5L29.4999 1.66667C30.4999 0.833332 31.8333 0.499999 32.9999 0.999999C34.3333 1.66667 34.9999 2.83333 34.9999 4.16667V76C34.9999 77.6667 33.4999 79.1667 31.8333 79.1667ZM7.33325 72.6667H28.4999V11.6667L7.33325 31.3333V72.6667Z" fill="white"></path>
                                <path d="M75.8333 79.1667H31.6666C29.8333 79.1667 28.3333 77.6667 28.3333 75.8334V36.6667C28.3333 34.8334 29.8333 33.3334 31.6666 33.3334H75.8333C77.6666 33.3334 79.1666 34.8334 79.1666 36.6667V76C79.1666 77.6667 77.6666 79.1667 75.8333 79.1667ZM34.9999 72.6667H72.6666V39.8334H34.9999V72.6667Z" fill="white"></path><path d="M60.1665 79.1667H47.3332C45.4999 79.1667 43.9999 77.6667 43.9999 75.8334V55.5C43.9999 53.6667 45.4999 52.1667 47.3332 52.1667H60.1665C61.9999 52.1667 63.4999 53.6667 63.4999 55.5V75.8334C63.4999 77.6667 61.9999 79.1667 60.1665 79.1667ZM50.6665 72.6667H56.9999V58.8334H50.6665V72.6667Z" fill="white"></path>
                            </svg>
                        </span>
                        <div className='flex justify-between items-center w-full relative z-[1] bg-transparent'>
                            <div className='text-white space-y-2'>
                                <h1 className='text-sm md:text-xl font-semibold'>Total Properties</h1>
                                <div className='w-full h-2 bg-slate-200 rounded-lg'>
                                    <div className='w-[60%] h-full  '></div>
                                </div>
                                <p className='text-xs md:text-sm leading-none'>This represents the total listings on your account</p>
                            </div>
                            <div className='text-lg md:text-2xl text-white font-bold ml-2 md:pl-0'>
                                {propertyDetails?.propertyCount}
                            </div>
                        </div>
                    </div> 
                    <div className='mt-5'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <Card name="Properties for sale" number={propertyDetails?.forSellCount} icon={<BsPieChartFill size={32} className='text-sky-600'/>}/>
                            <Card name="Properties for rent" number={propertyDetails?.rentCount} icon={<TbChartCandle size={32} className='text-green-600'/>}/>
                            <Card name="Land" number={propertyDetails?.landCount} icon={<MdLandscape size={32} className='text-orange-600'/>}/>
                            <Card name="Properties for short let" number={propertyDetails?.shortLetCount} icon={<MdApartment size={32} className='text-theme-color'/>}/>
                        </div>
                    </div>   
                </div>
                <div className='md:w-2/4'>
                    <div className='w-full rounded-xl p-2 h-full bg-main-bg dark:bg-slate-900'>
                        <div className='w-full'>
                            <div>
                                <div className='flex items-center justify-between'>
                                    <h1 className='text-[13px] font-semibold uppercase'>Unpublished listings</h1>
                                    <p>{propertyDetails?.unpublishedProperty && propertyDetails?.unpublishedPropertyCount}</p>
                                </div>
                                <p className='text-[10px] text-sky-600'>Unpublished properties are only visible to you</p>
                                
                            </div>
                            
                            <div className='mt-2'>
                                {propertyDetails?.unpublishedProperty && propertyDetails?.unpublishedProperty.length ? 
                                ( <ul className='space-y-3'>
                                    
                                    {propertyDetails.unpublishedProperty.map((v,i)=>{

                                        return <li key={i} className=''>
                                            <div className={`w-full px-2 text-[11px] transition cursor-pointer hover:bg-neutral-100 `}>
                                                <h1 className='overflow-ellipsis overflow-hidden font-[400] whitespace-nowrap w-full uppercase'>{v.name}</h1>
                                                <div className='flex items-center justify-between'>
                                                    <p className='text-[12px] font-semibold'>₦{parseFloat(v.amount).toLocaleString()}</p>
                                                    <div className='flex items-center'>
                                                        <BsHouseDoor/>
                                                        <span>{v.property_type}</span>   
                                                    </div>
                                                </div>
                                                <p className='overflow-ellipsis font-semibold overflow-hidden whitespace-nowrap w-full'>{v.address}</p>
                                                <div className='flex justify-between items-center'>
                                                    <p><BsEye size={20} onClick={(e)=>{e.stopPropagation();navigate(`/dashboard/property/${v?.id}/edit`)}} className='cursor-pointer'/></p>
                                                    <p className=''>{v.bedrooms}beds | {v.bathrooms}baths </p>
                                                </div>
                                                
                                            </div>
                                        </li>
                                    })}
                                    
                                
                                </ul>) : 
                                
                                <div className='h-[calc(100%-3rem)] flex items-center justify-center'>
                                    <div className='text-center'>
                                        <div className='flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-neutral-200 dark:bg-slate-800'>
                                            <MdHourglassEmpty size={32}/>
                                        </div>
                                        
                                        <h1 className='text-lg font-semibold'>No unpublished Listings</h1>
                                        <p className='text-sm'>Your unpublished listings are shown here and can be seen by only you</p>
                                    </div>
                                </div>}
                                
                           </div>
                        </div>
                    </div>
                </div>               
            </div>

            <div className='mt-5  border-2 dark:border-slate-800'>
                <MessageLayout/>
            </div>    
        </div>
    </div>
  )
}

export default Dashboard