import React from 'react'
import { FaSearch } from 'react-icons/fa'
import {useForm} from "react-hook-form"
import { hideLoading, showLoading } from '../../utility/loading'
import Axios from '../../utility/axios'

/**
 * 
 * @param {*} type
 * Determines which user type to search for--user or agents
 * @param statefn
 * This update the users list 
 * @returns 
 */
const SearchBox = ({type,statefn}) => {

    const {register,handleSubmit,formState:{errors}} = useForm()

    const onSearch = (data)=>{
        let q = {...data,search_type:type}
        showLoading()
        Axios.get('/users/search', {params:q}).then(result=>{
            statefn(result.data.data)
            
        }).catch(e=>{
            console.log(e.response)
        }).finally(()=>{
            hideLoading()
        })
    }

  return (
    <div>
        <form action="" onSubmit={handleSubmit(onSearch)}>
            <div className='relative'>
                <input type="text" {...register('q',{required:true})} className='form-input w-full bg-transparent rounded shadow-md h-10' placeholder={`Search ${type} by name`}/>
                <button className='rounded-tr rounded-br absolute w-12 top-0 right-0 flex justify-center items-center bg-purple-950 hover:bg-purple-950/60 text-white h-10'>
                    <FaSearch size={24}/>
                </button>
            </div>
            
        </form>
    </div>
  )
}

export default SearchBox