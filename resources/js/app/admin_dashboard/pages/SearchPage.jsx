import React,{useEffect,useState} from 'react'
import Listings from '../components/Listings'
import Categories from "../components/Categories"
import Axios from '../../utility/axios'
import { useSearchParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'

const SearchPage = () => {
 
   const [propertyListing,setPropertyListing] = useState()
   const [searchParams,setSearchParams] = useSearchParams()
     
   useEffect(()=>{
    let params = {}

    searchParams.forEach((value,key)=>{

        params[key] = value;
    })

    Axios.get('/agent/property/listings/search', {params:params}).then(data=>{
        setPropertyListing(data.data.data)
 
    }).catch(e=>{

        console.log(e)
    })

  },[searchParams])

  if(!propertyListing?.data.length){

    return <EmptyState title='Empty listings' subtitle='Your search key matches no listings in our database'/>
  }
  
  return (
    <div className='h-full w-full px-5 pb-5 pt-3 overflow-scroll'>
    <div className='mb-2'>
        <h1 className='text-2xl font-bold'>Search</h1>
        <p className='text-xs'>All search matches are available here</p>
    </div>
    
      <Listings propertyListing={propertyListing?.data} pagination={propertyListing} setProperty={setPropertyListing}/>
         
    </div>
  )
}

export default SearchPage