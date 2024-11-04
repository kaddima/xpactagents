import React,{useEffect,useState} from 'react'
import Listings from '../components/Listings'
import Categories from "../components/Categories"
import Axios from '../../utility/axios'
import { useSearchParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

const ListingsPage = () => {
 
   const [propertyListing,setPropertyListing] = useState({data:[]})
   const [searchParams,setParams] = useSearchParams()
     
      useEffect(()=>{
        
        Axios.get('/api/listings',{params:{'other_category':searchParams.get('other-category')}}).then(data=>{
            setPropertyListing(data.data.data)

        }).catch(e=>{

            console.log(e)
        })

      },[searchParams])
    
  return (
    <div className='h-full w-full px-5 pb-5 pt-3 overflow-scroll'>
      <div className='sticky top-[-1em]   z-[10]'>
        <Categories/>
      </div>
      
      {!propertyListing?.data.length ? <EmptyState title='Empty Listing' subtitle='No listings present in this category'/> : 
        <Listings propertyListing={propertyListing.data} setProperty={setPropertyListing} pagination={propertyListing}/>
      }
      
         
    </div>
  )
}

export default ListingsPage