import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PropertyCard from './PropertyCard'
import { hideLoading, showLoading } from '../../utility/loading'
import Axios from '../../utility/axios'

const Listings = ({propertyListing=[],listState=[],pagination=false,setProperty=()=>{}}) => {

    const [showMore,setShowMore] = useState(pagination)
    const [searchParams,setSearchParams] = useSearchParams()

    let params = useMemo(()=>{

        let param = {}

        searchParams.forEach((value,key)=>{

            param[key] = value;
        })


        return param

    },[searchParams])

    const onshowMore = (url)=>{

        //parse the url
        let link  = new URL(url)
        let path = link.pathname
        let pageParam = link.searchParams.get('page')

       showLoading()

        Axios.get(path, {params:{...params,page:pageParam}}).then(data=>{

            setProperty(prev=>{
                let appendedListing = {data : prev.data.concat(data.data.data.data)}
                return {...data.data.data, ...appendedListing}
            })
        }).catch(e=>{

            console.log(e)
        }).finally(()=>{

            hideLoading()
        })

    }

    useEffect(()=>{
        setShowMore(pagination)
    },[pagination])


  return (
    <div className='w-full h-[calc(100%-59px)] p-3 bg-white overflow-scroll mb-1'>
        <div className='grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3'>
         {propertyListing?.map((v,i)=>{
                              
              return (
              <div key={i} className='hover:shadow-lg border rounded-xl overflow-hidden cursor-pointer bg-white'>
                <PropertyCard  data={v} listState={listState}/>
              </div>
              )
          })} 
      </div>

      {showMore?.next_page_url && <div className='mt-5 mb-3'>
            <h1 className='text-center mb-3 font-semibold'>Continue exploring our listings</h1>
            <button onClick={()=>onshowMore(showMore?.next_page_url)} className='block max-w-[150px] bg-black text-white text-sm font-semibold mx-auto px-5 py-2 rounded border border-black'>Show more</button>
        </div>}
    </div>
  )
}

export default Listings