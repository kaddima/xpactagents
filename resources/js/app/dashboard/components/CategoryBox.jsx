import React, { useCallback } from 'react'
import { useSearchParams,useNavigate } from 'react-router-dom'
import qs from "query-string"


const CategoryBox = ({icon,label,selected}) => {
  
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const handleClick = useCallback(()=>{

    let currentQuery = {}

    if(params){
      currentQuery = qs.parse(params.toString())
    }

    const updatedQuery = {...currentQuery,category:label}

    if(params?.get('category') === label){
      delete updatedQuery.category
    }

    const url = qs.stringifyUrl({
      url:'/',
      query:updatedQuery
    }, {skipNull:true})

    navigate(url)
    

  },[label,params])

  return (
  <div 
  onClick={handleClick}
  className={`flex flex-col items-center justify-center gap-2 p-3 
  border-b-2 hover:text-neutral-800 transition cursor-pointer 
  ${selected ? 'border-b-neutral-800' : 'border-transparent'}
  ${selected ? 'text-neutral-800' : 'text-neutra-500'}`}>
    {icon}
    <div className='font-medium text-sm'>
      {label}
    </div>
  </div>
  )
}

export default CategoryBox