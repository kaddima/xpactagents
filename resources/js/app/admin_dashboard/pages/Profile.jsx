import React,{ useState} from 'react'
import $ from 'jquery'
import axios from 'axios'
import {MdOutlineLocationOn} from "react-icons/md"
import { format, parseISO } from 'date-fns'
import { useSelector,useDispatch } from 'react-redux'
import {toast} from 'react-toastify'
import { updateUserProfile } from '../../store/accountSlice'

import {ProfileEdit} from "../../components"
import { useParams } from 'react-router-dom'


const Profile = () => {

    const dispatch = useDispatch()    


  return (
    <div className='  md:h-full text-gray-500 md:p-5 p-2 md:overflow-auto'>
        <h1 className='font-extrabold text-gray-500 mb-5 text-xl'>User Profile</h1>
        <div className='md:flex md:space-x-5 items-center'>
            <div className='w-32 h-32 bg-slate-300 rounded-full relative mx-auto mb-4'>
                <img src={`/uploads/`} alt="" className='w-32 h-32 rounded-full'/>
                <div className='cursor-pointer absolute bottom-5 right-2'>
                     <span data-name='photo' className="inline-block hover:bg-gray-100 p-1 rounded cursor-pointer bg-gray-50 text-blue-600 font-bold text-xs">Change</span>
                </div>
            </div>
            <div className='flex-1 '>
                <div>
                    <div className='flex items-center space-x-5'>
                        <div className='flex items-center space-x-3'>
                            <h1 className='text-lg md:text-2xl font-bold'>Steve williams</h1> 
                            <span data-name='f_name'  className="inline-block hover:bg-gray-100 p-1 rounded cursor-pointer text-blue-600 text-xs">edit</span>
                        </div> 

                        <div className='flex items-center space-x-3'>
                            <h1 className='text-lg md:text-2xl font-bold'>williams</h1> 
                            <span data-name='l_name'  className="inline-block hover:bg-gray-100 p-1 rounded cursor-pointer text-blue-600 text-xs">edit</span>
                        </div> 
                    </div>   
                                  
                    <div className='flex items-center space-x-1 text-xs -mt-1 font-semibold'>
                        <span><MdOutlineLocationOn/></span>
                        {/* <span>{userDetails.state}, {userDetails.country}</span> */}
                    </div>
                   
                </div>
                
                <div className='mt-2 text-xs font-semibold flex items-center space-x-2'>
                    <p>Acct number</p>
                    <div className='flex items-center space-x-1 text-lg'>
                        <p className='text-sm -mt-1 font-bold'>234567890</p>
                        <button >
                            <span data-name='account_number'  className="inline-block hover:bg-gray-100 p-1 rounded cursor-pointer text-blue-600 text-xs">edit</span>
                        </button>
                        
                    </div>     
                </div>
                <div className='text-xs font-semibold flex items-center space-x-2'>
                    <p>Savings</p>
                    <div className='flex items-center space-x-1 text-lg'>
                        <p className='text-sm -mt-1 font-bold'>$3000</p>
                        <button >
                            <span data-name='savings' className="inline-block hover:bg-gray-100 p-1 rounded cursor-pointer text-blue-600 text-xs">edit</span>
                        </button>      
                    </div>   
                </div>
                <div className='mt-1 text-xs font-semibold flex items-center space-x-2'>
                    <div>
                        <span>Total balance</span>
                        <p className='text-sm -mt-1 font-bold'>300,000</p>
                    </div>
                    <button >
                        <span data-name='account_balance' className="inline-block hover:bg-gray-100 p-1 rounded cursor-pointer text-blue-600 text-xs">edit</span>
                    </button>
               </div>
                <div className='mt-2 border-b-2 rounded-lg pb-2 space-y-1'>
                    <h1 className='text-sm text-gray-400 font-semibold uppercase mb-2'>Card Information </h1>
                    <div className='text-xs font-semibold flex items-center space-x-2'>
                        <p>Card number</p>
                        <div className='flex items-center space-x-1 text-lg'>
                            <p className='text-sm -mt-1 font-bold'>22222222222237222222244</p>
                            <button >
                                <span data-name='card_number' className="inline-block hover:bg-gray-100 p-1 rounded cursor-pointer text-blue-600 text-xs">edit</span>
                            </button>      
                        </div>   
                    </div>
                    <div className='text-xs font-semibold flex items-center space-x-2'>
                        <p>CVC</p>
                        <div className='flex items-center space-x-1 text-lg'>
                            <p className='text-sm -mt-1 font-bold'>456</p>
                            <button >
                                <span data-name='cvc'  className="inline-block hover:bg-gray-100 p-1 rounded cursor-pointer text-blue-600 text-xs">edit</span>
                            </button>      
                        </div>   
                    </div>
                    <div className='text-xs font-semibold flex items-center space-x-2'>
                        <p>Expiration date</p>
                        <div className='flex items-center space-x-1 text-lg'>
                            <p className='text-sm -mt-1 font-bold'>10/24</p>
                            <button >
                                <span data-name='exp' className="inline-block hover:bg-gray-100 p-1 rounded cursor-pointer text-blue-600 text-xs">edit</span>
                            </button>      
                        </div>   
                    </div>
                    <div className='text-xs font-semibold flex items-center space-x-2'>
                        <p>Spending Limit</p>
                        <div className='flex items-center space-x-1 text-lg'>
                            <p className='text-sm -mt-1 font-bold'>$3000</p>
                            <button >
                                <span data-name='spending_limit'  className="inline-block hover:bg-gray-100 p-1 rounded cursor-pointer text-blue-600 text-xs">edit</span>
                            </button>      
                        </div>   
                    </div>
                    <div className='text-xs font-semibold flex items-center space-x-2'>
                        <p>Spent (Card usage)</p>
                        <div className='flex items-center space-x-1 text-lg'>
                            <p className='text-sm -mt-1 font-bold'>$3440</p>
                            <button >
                                <span data-name='spent'  className="inline-block hover:bg-gray-100 p-1 rounded cursor-pointer text-blue-600 text-xs">edit</span>
                            </button>      
                        </div>   
                    </div>
                    <div className='flex items-center space-x-2 text-xs font-semibold'>
                        <span>Card Status</span>
                        
                        <button >
                            <span className={`inline-block text-sm font-semibold border-2 `}>active</span>
                        </button> 
                    </div>
                    <div className='text-xs font-semibold flex items-center space-x-2'>
                        <div>
                            <span>Card balance</span>
                            <p className='text-sm -mt-1 font-bold'>$3000</p>
                        </div>
                        <button >
                            <span data-name='card_balance'  className="inline-block hover:bg-gray-100 p-1 rounded cursor-pointer text-blue-600 text-xs">edit</span>
                        </button>
                    </div>
                </div>  
            </div>
        </div>

        <div className='md:w-4/6 space-y-5 text-gray-500 mt-4 md:pl-4 pr-2'>
            <div className='flex flex-col md:flex-row md:items-center justify-between'>
                <div className='md:w-2/4 space-y-2'>
                    <div className='text-xs  font-extrabold'>
                        <span>Account type :</span>
                        <span className='inline-block ml-3 '>Savings</span>

                        <button >
                            <span data-name='account_type' className="inline-block hover:bg-gray-100 p-1 rounded cursor-pointer text-blue-600 text-xs">edit</span>
                        </button>
                    </div> 
                </div>
                <div className='flex items-center space-x-2 text-xs font-semibold'>
                    <span>Status</span>
                    <span className='inline-block px-2 border border-green-500 text-green-800 rounded-xl'>Active</span>
                </div>
                
            </div>
            <div className='pt-2'>
                <p className='uppercase font-bold text-sm '>Contact information</p>

                <div className='mt-4 space-y-2 text-xs font-bold'>
                    <div className='flex'>
                        <span className='w-32'>Phone</span>
                        <div className='flex items-center space-x-2'>
                            <span className='font-semibold'>8959467889</span>
                            <span data-name='phone' className="inline-block hover:bg-gray-100 p-1 rounded cursor-pointer text-blue-600 text-xs">edit</span>
                            </div>
                    </div>
                    
                    <div className='flex'>
                        <span className='w-32'>Zip code</span>
    
                        <div className='flex items-center space-x-2'>
                            <p className='font-semibold'>111000</p>
                            <span data-name='zip_code' className="inline-block rounded cursor-pointer text-blue-600 text-xs">edit</span>

                            </div>
                    </div>
                    <div className='flex'>
                        <span className='w-32'>Email</span>
                        <div className='flex items-center space-x-2'>
                            <span className=' font-semibold'>a@gmail.com</span>
                       </div>        
                    </div>
                    <div className='flex'>
                        <span className='w-32'>Country</span>
                        <div className='flex items-center space-x-2'>
                            <span className=' font-semibold'>Nigeria</span>
                            <span data-name='country' className="inline-block rounded cursor-pointer text-blue-600 text-xs">edit</span>
                        </div>  
                        
                    </div>
                    <div className='flex'>
                        <span className='w-32'>City</span>
                        <div className='flex items-center space-x-2'>
                            <span className=' font-semibold'>Lagos</span>
                            <span data-name='state'  className="inline-block rounded cursor-pointer text-blue-600 text-xs">edit</span>
                        </div> 
                        
                    </div>
                </div>
            </div>

            <div>
                <p className='uppercase font-bold text-sm'>Basic Information</p>
                <div className='mt-3 space-y-3  text-xs font-bold'>
                    <div className='flex'>
                        <span className='w-32'>Birthday</span>
                        <div className='flex items-center space-x-2'>
                            <span className=' font-semibold'>22/3/203</span>
                            <span data-name='dob'  className="inline-block rounded cursor-pointer text-blue-600 text-xs">edit</span>
                        </div>         
                    </div>
                    <div className='flex'>
                        <span className='w-32'>Gender</span>
                        <div className='flex items-center space-x-2'>
                            <span className=' font-semibold'>Male</span>
                        </div>          
                    </div>
                </div>
            </div>
        </div>
        {/* <div className='hidden' id='profile-edit'>
            {profileEditShow && <ProfileEdit data={inputData} unmountFn={()=>{setProfileEditShow(false)}}/>}
        </div> */}
         
    </div>
  )
}

export default Profile