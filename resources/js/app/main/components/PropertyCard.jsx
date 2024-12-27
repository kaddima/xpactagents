import React, { useMemo } from 'react'
import {MdApartment} from "react-icons/md"
import {FaBed,FaBath,FaToilet, FaHeart} from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { loginModalOpen } from '../store/mainSlice'
import { hideLoading, showLoading } from '../../utility/loading'
import Axios from '../../utility/axios'
import { updateFavorites} from '../store/userSlice'

const PropertyCard = ({data :v}) => {

    const dispatch = useDispatch()
    const currentUser = useSelector(state=>state.user.userInfo)
    let favorites = useSelector(state=>state.user.favorites)

    const isFavorite = useMemo(()=>{
        
    if(favorites && favorites.length){

        for (let i = 0; i < favorites.length; i++) {

            if(favorites[i].property_id == v.id){
                    return true
                }
            
        }
        return false
    }
    },[favorites])

    const onFavorite = (property_id)=>{
        
        if(!currentUser.email){

            dispatch(loginModalOpen())
            return
        }
        showLoading()
        Axios.post('/property/favorite', {property_id}).then(data=>{
            dispatch(updateFavorites(data.data.data))
        }).catch(e=>{

            console.log(e.response)
        }).finally(()=>{

            hideLoading()
        })
    }
  return (

        <div className="max-h-[400px] relative">
            
            <div className='absolute top-5 right-2 bg-black/50 rounded-lg p-1' onClick={(e)=>{e.preventDefault();onFavorite(v.id);}}>
                <FaHeart size={24} className={`${isFavorite ? 'text-pink-400' : 'text-white'} transition`}/>
            </div>

            <div className='h-[200px]'>
                <img src={v?.images} alt={`${v.name} image`} className="w-full h-full object-cover"/>
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
                                {v.property_fact && parseFloat(v.property_fact.property_size).toLocaleString()}
                                {v.property_fact && 
                                (parseFloat(v.property_fact.property_size) > 1 && v.property_fact.unit != 'sq.ft')
                                  ? v.property_fact.unit+'s' 
                                  : v.property_fact.unit}
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
        </div>    

)
}

export default PropertyCard