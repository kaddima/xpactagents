import React,{useState,useEffect} from 'react'
import {useParams,Link, useSearchParams} from 'react-router-dom'
import axios from 'axios'

import {Pagination, PropertyCard} from "../components"


const PropertiesByCategory = () => {

    const [properties,setProperties] = useState({data:[]})
    const [searchParams] = useSearchParams({page:1})
    let page = searchParams.get('page')
    const category = useParams().name

    useEffect(()=>{

        
        axios.get(`/dashboard/property/category?page=${searchParams.get('page')}`,{params:{category:category.replace('-','_')}}).then(data=>{

             setProperties(data.data.data)

            //console.log(data.data.data)
        }).catch(e=>{

            console.log(e.response)
        })

       
    },[page])

  return (
    <div className='w-full h-full   overflow-auto'>

        <div className="mx-auto shadow pb-1 sticky z-[9999]  ">
            <form action="">
                <div className="flex px-2">
                    <div>
                        <select name="" id="" className="form-select border">
                            <option value="buy">Buy</option>
                            <option value="rent">Rent</option>
                            <option value="short-let">Short Let</option>
                        </select>
                    </div>

                    <div>
                        <input type="text" placeholder="search by address" className="form-input border"/>
                    </div>

                    <div className="ml-2">
                        <select name="" id="" className="form-select border">
                            <option value="buy">House</option>
                            <option value="rent">Land</option>
                            <option value="short-let">Flats and Apartments</option>
                            <option value="">short stay</option>
                            <option value="">Duplex</option>
                            <option value=""></option>
                        </select>
                    </div>

                    {/* <div className="ml-3">
                        <select name="beds" id="" className="form-select border md:w-24">
                            <option value="">Beds</option>

                        @for($i=1; $i < 11; $i++)
                                <option>{{$i}}</option>
                        @endfor
                        </select>
                    </div> */}

                    <div className="ml-3">
                        <input type="number" name="min-price" id="" placeholder="Min price" className="form-input border md:w-32"/>
                    </div>

                    <div className="ml-3">
                        <input type="number" name="max-price" id="" placeholder="Max price" className="form-input border md:w-32"/>
                    </div>

                    <div>
                        <button className="bg-theme-color px-3 py-2 ml-5 text-white rounded-md">Filter</button>
                    </div>
                </div>
                
            </form>
        </div>

        <div>
            <div className='flex'>
                {properties?.data.map((v,i)=>{

                    return <div className='w-4/12 h-[300px]'>
                        <PropertyCard key={i} data={v}/>
                        </div>
                })}
                
            </div>
            <div>
                {properties?.total > properties?.per_page && (
                    <div className='float-right'>

                        <Pagination pageNo={page} totalPage={properties.total} links={properties?.links}/>
                                            
                    </div>
                 )}
            </div>

            
            
        </div>
    </div>
  )
}

export default PropertiesByCategory