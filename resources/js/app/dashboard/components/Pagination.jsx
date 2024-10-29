import React from 'react'
import {BsArrowLeftShort,BsArrowRightShort} from "react-icons/bs"
import { Link,useParams} from 'react-router-dom'

const Pagination = ({links,pageNo,totalPage}) => {
  const category = useParams().name

  return (
  <div className='w-full'>
    <div className='flex space-x-2'>
      <Link to={`/admin/property/category/${category}?page=${pageNo != 1 ? pageNo-1 : 1}`}
        className="flex space-x-1 items-center bg-slate-600 text-white font-bold text-xs px-1 rounded">
        <BsArrowLeftShort/>
        <span>Prev</span> 
        
      </Link>
      {links.slice(1, links.length -1).map((v,i)=>{

        return <Link to={`/admin/property/category/${category}?page=${v.label}`}
           className={`${v.active && `bg-green-700`} w-5 h-5 text-center bg-theme-color rounded text-white text-sm`} >
          {v.label}
        </Link>
      
      })}
      <Link to={`/admin/property/category/${category}?page=${pageNo != totalPage ? +pageNo + 1 : totalPage}`}
        className="flex space-x-1 items-center bg-slate-600 text-white font-bold text-xs px-1 rounded">
        <span>Next</span> 
        <BsArrowRightShort/>
      </Link>
    </div>
  </div>
  )
}

export default Pagination