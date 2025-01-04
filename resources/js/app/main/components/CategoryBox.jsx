import React, { useCallback } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import qs from "query-string"


const CategoryBox = ({ icon: Icon, label }) => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  let path = useLocation().pathname

  const handleClick = useCallback(() => {
    let currentQuery = {}
    if (params) {
      currentQuery = qs.parse(params.toString())
    }

    const updatedQuery = { ...currentQuery, 'other-category': label }

    const url = qs.stringifyUrl({
      url: path,
      query: updatedQuery
    }, { skipNull: true })

    navigate(url)

  }, [label, params])

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center gap-2 p-3 hover:border-b-neutral-400  
    border-b-2 hover:text-neutral-500 transition cursor-pointer 
    ${params.get('other-category') == label ? 'border-b-neutral-500' : 'border-transparent'}
    `}>
      <Icon size={26} />
      <div className='font-medium text-sm'>
        {label}
      </div>
    </div>
  )
}

export default CategoryBox