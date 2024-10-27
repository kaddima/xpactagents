import React, { useMemo } from 'react'
import {MdApartment, MdOutlinePublishedWithChanges,MdOutlineUnpublished} from "react-icons/md"
import {Link} from 'react-router-dom'
import {FaBed,FaBath,FaToilet, FaHeart} from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { loginModalOpen } from '../store/mainSlice'
import { hideLoading, showLoading } from '../../utility/loading'
import Axios from '../../utility/axios'
import { updateUserInfo } from '../store/userSlice'

const PropertyCard = ({data :v}) => {

    const dispatch = useDispatch()
    const currentUser = useSelector(state=>state.user.userInfo)
    let favorites = currentUser.favorite_properties

    const isFavorite = useMemo(()=>{
        
    favorites = favorites ? JSON.parse(favorites) : []

    if(favorites && favorites.length){

        return favorites.includes(v.id)
    }
    },[favorites])

    const onFavorite = (property_id)=>{
        
        if(!currentUser.first_name){

            dispatch(loginModalOpen())
            return
        }
        showLoading()
        Axios.post('/property/favorite', {property_id}).then(data=>{
            dispatch(updateUserInfo(data.data.data))
        }).catch(e=>{

            console.log(e.response)
        }).finally(()=>{

            hideLoading()
        })
    }
  return (

        <div className="max-h-[400px] bg-white text-slate-600 relative">
            
            <div className='absolute top-5 right-2 bg-black/50 rounded-lg p-1' onClick={(e)=>{e.preventDefault();onFavorite(v.id);}}>
                <FaHeart size={24} className={`${isFavorite ? 'text-pink-400' : 'text-white'} transition`}/>
            </div>

            <div className='h-[200px]'>
                    <img src={`/uploads/users/${v.creator_id}/${v.images && JSON.parse(v?.images)[0]}`} alt="" className="w-full h-full object-cover"/>
            </div>
            <div className="px-3 ">
                <div className='py-2'>
                    <div className="flex space-x-2 items-center">
                        <div className="w-2 h-2 rounded-full bg-theme-color"></div>
                        <span className="text-xs">{v?.category.replace('_',' ')}</span>
                    </div>
                    
                    <p className="font-semibold text-xl">₦{v.amount ? parseFloat(v?.amount).toLocaleString(): '-'}{(v?.category == 'rent' || v?.category == 'short_let') ? `/${v.duration ? v?.duration : '-'}` : ''}</p>

                    <div className='flex items-center'>
                        {v?.category !== 'land' && ( 
                        <div className="text-sm font-[400] flex space-x-2 mr-3">
                            <div className='flex items-center space-x-1'>
                                <FaBed size={16}/>
                                <span>{v?.bedrooms}</span>
                            </div>
                            <div className=' flex items-center space-x-2'>
                                <FaBath size={16}/> 
                                <span>{v?.bathrooms}</span>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <FaToilet size={16}/>
                                <span> {v?.toilets}</span>
                            </div>
                            

                        </div>)}
                        <div className=''>
                            <span className='inline-block font-semibold'>
                                {v.property_fact && parseFloat((JSON.parse(v.property_fact)).property_size).toLocaleString()}
                                {v.property_fact && 
                                (parseFloat((JSON.parse(v.property_fact)).property_size) > 1 && (JSON.parse(v.property_fact)).unit != 'sq.ft')
                                  ? (JSON.parse(v.property_fact)).unit+'s' 
                                  : (JSON.parse(v.property_fact)).unit}
                            </span>
                        </div>
                    </div>
                  
                    
                    <p className="text-sm mt-1">{v?.address}</p>

                    {v.category != 'land' && <>
                        <div className='flex items-center text-xs mt-2'>
                            <MdApartment/>
                            <span>{v.property_type} </span>   
                        </div>
                    </>}

                </div>
                
            </div>

            {/* <div className='mt-auto'>
                <div className='flex justify-end space-x-2 md:space-x-4 items-start'>
                    <Link to={`/dashboard/property/${v?.id}`} className='text-sm text-[#d92228] p-2 rounded-md hover:bg-slate-200'>View</Link>
                    <button className='p-2 rounded-md hover:bg-slate-200' title={v?.published == 1 ? `Property is pulished` : `Property not yet published`}>
                        {v?.published == 1 ? <MdOutlineUnpublished className='text-red-700'/> : <MdOutlinePublishedWithChanges className='text-green-600'/>}
                    </button>
                    <Link to={`/dashboard/property/${v?.id}/edit`} className='p-2 rounded-md hover:bg-slate-200'>
                        <FaEdit/>
                    </Link>
                    
                </div>
            </div>           */}
        </div>    

)
}

export default PropertyCard