import React from 'react'
import _ from 'lodash'
import {useNavigate } from 'react-router-dom'

import { TbUsersGroup} from 'react-icons/tb'

import { useState } from 'react'
import { useEffect } from 'react'
import { format } from 'date-fns'
import { parseISO } from 'date-fns'
import Axios from '../../../utility/axios'


const Card = ({icon,name,number})=>{

    return   <div className='rounded-lg p-2 w-full bg-white dark:bg-slate-800'>
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

const TableRow = ({data,index,onResolve})=>{

   
	return (
		  <tr className='text-black dark:text-slate-400'>
			   <td className='text-left border-b-1 border-b-gray-300 dark:border-b-slate-800 py-3'>
				  <span className='text-sm block'>{data.first_name}</span>
			  </td>
			   <td className='text-left border-b-1 border-b-gray-300 dark:border-b-slate-800 w-full overflow-x-scroll'>
				  <span className='text-sm block w-full'>{data.email}</span>
			  </td>
			  <td className='text-left border-b-1 border-b-gray-300 dark:border-b-slate-800 pl-1'>
				  <span className='text-sm block '>{data.created_at && format(parseISO(data.created_at), 'dd MMM Y')}</span>
			  </td>
			 
			  <td className='text-left border-b-1 border-b-gray-300 dark:border-b-slate-800'>
				  <span className={`text-sm text-white text-center block rounded px-1 bg-[#2b969e]`}>Admin</span>
			  </td>
			  
		  </tr>
	)
  }

const AdminDashboard = () => {
    const [admsDetails, setAdmsDetails] = useState()
    //get state account
    const navigate = useNavigate()

    useEffect(()=>{

        Axios.get('/adms/overview').then(data=>{
            setAdmsDetails(data.data.data)
        }).catch(e=>{

            console.log(e.response)
        })

    },[])

  return (
    <div className='w-full h-full px-3'>
        <div className='pt-5'>
            <h1 className='text-2xl font-bold'>Adms Overview</h1>

            <div className='mt-5 flex flex-col gap-3 md:flex-row'>
                <div className='md:w-2/4'>  
                    <div className='relative gap-2 md:gap-5 flex items-center w-full bg-[#238f5d] rounded-xl p-3'>
                        <span>
                            <svg className='w-[40px] h-[40px] md:w-[80px] md:h-[80px]' viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M31.8333 79.1667H4.16659C2.33325 79.1667 0.833252 77.6667 0.833252 75.8333V29.8333C0.833252 29 1.16659 28 1.83325 27.5L29.4999 1.66667C30.4999 0.833332 31.8333 0.499999 32.9999 0.999999C34.3333 1.66667 34.9999 2.83333 34.9999 4.16667V76C34.9999 77.6667 33.4999 79.1667 31.8333 79.1667ZM7.33325 72.6667H28.4999V11.6667L7.33325 31.3333V72.6667Z" fill="white"></path>
                                <path d="M75.8333 79.1667H31.6666C29.8333 79.1667 28.3333 77.6667 28.3333 75.8334V36.6667C28.3333 34.8334 29.8333 33.3334 31.6666 33.3334H75.8333C77.6666 33.3334 79.1666 34.8334 79.1666 36.6667V76C79.1666 77.6667 77.6666 79.1667 75.8333 79.1667ZM34.9999 72.6667H72.6666V39.8334H34.9999V72.6667Z" fill="white"></path><path d="M60.1665 79.1667H47.3332C45.4999 79.1667 43.9999 77.6667 43.9999 75.8334V55.5C43.9999 53.6667 45.4999 52.1667 47.3332 52.1667H60.1665C61.9999 52.1667 63.4999 53.6667 63.4999 55.5V75.8334C63.4999 77.6667 61.9999 79.1667 60.1665 79.1667ZM50.6665 72.6667H56.9999V58.8334H50.6665V72.6667Z" fill="white"></path>
                            </svg>
                        </span>
                        <div className='flex justify-between items-center w-full relative z-[1] bg-transparent'>
                            <div className='text-white space-y-2'>
                                <h1 className='text-sm md:text-xl font-semibold'>Total Admin</h1>
                                <div className='w-full h-2 bg-slate-200 rounded-lg'>
                                    <div className='w-[60%] h-full  '></div>
                                </div>
                                <p className='text-xs md:text-sm leading-none'>This represents the total admins on your account</p>
                            </div>
                            <div className='text-lg md:text-2xl text-white font-bold ml-2 md:pl-0'>
                                {admsDetails?.adminsCount}
                            </div>
                        </div>
                    </div> 
                    <div className='mt-5'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <Card name="Total users" number={admsDetails?.regularUsersCount} icon={<TbUsersGroup size={32} className='text-sky-600'/>}/>
                            <Card name="Total agents" number={admsDetails?.agentsCount } icon={<TbUsersGroup size={32} className='text-green-600'/>}/>
                            <Card name="All users" number={admsDetails?.totalUsersCount} icon={<TbUsersGroup size={32} className='text-orange-600'/>}/>
                        </div>
                    </div>   
                </div>
                <div className='md:w-2/4'>
                    <div className='h-full p-2 bg-white dark:bg-slate-800'>
                        <h1 className='text-xs uppercase pb-2 border-b dark:border-b-slate-800 font-semibold'>Most Recent admin</h1>

                        <div>
                            <table className='w-full table-fixed'>
                                <thead>
                                    <tr>
                                        <th className='text-left font-semibold text-sm text-black dark:text-slate-400'>First name</th>
                                        <th className='text-left font-semibold text-sm w-[35%] text-black dark:text-slate-400'>Email</th>
                                        <th className='text-left font-semibold text-sm text-black dark:text-slate-400'>Date</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admsDetails?.recentAdmins && admsDetails?.recentAdmins.map((v,i)=>{

                                        return <TableRow key={i} data={v}/>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>               
            </div>

        </div>
    </div>
  )
}

export default AdminDashboard