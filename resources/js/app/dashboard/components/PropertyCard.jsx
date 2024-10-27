import React from 'react'
import {MdApartment, MdOutlinePublishedWithChanges,MdOutlineUnpublished} from "react-icons/md"
import {Link, button} from 'react-router-dom'
import {FaBed,FaBath,FaToilet,FaEdit,FaTrash, FaHeart} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Axios from '../../utility/axios'
import { hideLoading, showLoading } from '../../utility/loading'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { useMemo } from 'react'
import { updateProfile } from '../store/userSlice'


const PropertyCard = ({data :v,listState=false}) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    let favorites = useSelector(state=>state.user.profile.favorite_properties)
    
    const isFavorite = useMemo(()=>{
        favorites = favorites ? JSON.parse(favorites) : []

        if(favorites && favorites.length){

          return favorites.includes(v.id)
        }
    },[favorites])

    const onDelete = (property_id)=>{

        if(window.confirm("Delete this listing?")){
            showLoading()

            Axios.post('/property/delete', {property_id}).then(data=>{
                toast('Property deleted', {type:'success'})

                if(listState !== false){

                    listState(prev=>{

                        return prev.filter((v,i)=>{
                            return v.id !== property_id
                        })
                     })
                }

            }).catch(e=>{
                console.log(e)
            }).finally(()=>{
                hideLoading()
            })
        }
    }

    const onFavorite = (property_id)=>{
        showLoading()

        Axios.post('/property/favorite', {property_id}).then(data=>{
            dispatch(updateProfile(data.data.data))
        }).catch(e=>{

            console.log(e.response)
        }).finally(()=>{

            hideLoading()
        })
    }

  return (

        <div className="max-h-[400px] bg-white text-slate-600 relative">
            
            {v.published == 0 && <div className='absolute top-5 left-2 px-1 bg-theme-color rounded text-white text-[10px] uppercase font-bold'>
                this property is not pulished
            </div>}

            <div className='absolute top-5 right-2 bg-black/50 rounded-lg p-1' onClick={()=>onFavorite(v.id)}>
                <FaHeart size={24} className={`${isFavorite ? 'text-pink-400' : 'text-white'} transition`}/>
            </div>
            
            <div className='h-[200px]'>
                <img src={`/uploads/users/${v.creator_id}/${v.images && JSON.parse(v?.images)[0]}`} alt="" className="w-full h-full object-cover"/>
            </div>
            <div className="px-3 ">
                <div className='border-b py-2 border-slate-300'>
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

            <div className='mt-auto'>
                <div className='flex justify-end space-x-2 md:space-x-4 items-start'>
                    <button onClick={()=>navigate(`/dashboard/property/${v?.id}`)}  className='text-sm text-[#d92228] p-2 rounded-md hover:bg-slate-200'>View</button>
                    <button onClick={()=>navigate(`/dashboard/property/${v?.id}/edit`)} className='p-2 rounded-md hover:bg-slate-200'>
                        <FaEdit/>
                    </button>
                    <button onClick={(e)=>{e.stopPropagation();onDelete(v.id)}}  className='p-2 rounded-md hover:bg-slate-200'>
                        <FaTrash/>
                    </button>
                    
                </div>
            </div>          
        </div>    

)
}

export default PropertyCard