import React,{useEffect,useState} from 'react'
import Listings from '../components/Listings'
import Axios from '../../utility/axios'
import EmptyState from '../components/EmptyState'
import Categories from '../../main/components/Categories'
import { useSearchParams } from 'react-router-dom'
import qs from 'query-string'

import {MdOutlineBarChart, MdOutlineBubbleChart} from "react-icons/md"

const ListingsPage = () => {
 
   const [propertyListing,setPropertyListing] = useState()
   const [searchParams,setSearchParams] = useSearchParams()

   const setListingType = (e)=>{

        let type = e.currentTarget.dataset.type

        let params = qs.parse(searchParams.toString())

        params = {...params, 'list-type':type}

        setSearchParams(params)

   }
     
      useEffect(()=>{

        let params = qs.parse(searchParams.toString())

        if(searchParams.get('list-type')){
            params = {...params, 'list-type':searchParams.get('list-type')}
        }

        Axios.get('/admin/listings/all',{params:params}).then(data=>{
            setPropertyListing(data.data.data)

        }).catch(e=>{

            console.log(e)
        })

      },[searchParams])
      
  return (
    <div className='h-full w-full overflow-scroll relative  '>
        <div className='sticky top-[-5px] z-[10] flex my-[4px] items-center rounded-xl bg-white dark:bg-main-dark-bg'>
            <div className='flex-1 overflow-x-scroll px-3'>
                <Categories/>
            </div>
            <div className='px-3 border-l dark:border-slate-800 '>
                <h1 className='text-sm font-semibold'>Listings</h1>
                 <ul className='flex gap-2 mt-3'>
                    <li className='text-sm w-full'>
                        <button data-type='all' onClick={setListingType} className={`${searchParams.get('list-type') == 'all' && 'border-white bg-black text-white'} flex items-center py-1 px-2 border dark:border-slate-800 rounded-lg`}>
                            <MdOutlineBarChart size={16}/>
                            <span className='inline-block ml-1'>All</span> 
                        </button>   
                    </li>
                    <li className='text-sm w-full'>
                        <button data-type='currentuser' onClick={setListingType} className={`${searchParams.get('list-type') == 'currentuser' && 'border-white bg-black text-white'} flex items-center py-1 px-2 border dark:border-slate-800 rounded-lg`}>
                            <MdOutlineBubbleChart size={16}/>
                            <span className='inline-block ml-1'>Yours</span> 
                        </button>
                    </li>
                </ul>
            </div>
           
        </div>
    
        <div className='pb-5'>
            {propertyListing?.data.length > 0 ? 
            <Listings propertyListing={propertyListing.data} 
            pagination={propertyListing} 
            setProperty={setPropertyListing} 
            listState={setPropertyListing}/> :
            
            <EmptyState title='Empty Listings' subtitle='You do not have any property or listings present in your catalog.'/>}  
        </div>
       
        
        {/* <Listings propertyListing={propertyListing.data} 
          pagination={propertyListing} 
          setProperty={setPropertyListing} 
          listState={setPropertyListing}/>   */}
    </div>
  )
}

export default ListingsPage