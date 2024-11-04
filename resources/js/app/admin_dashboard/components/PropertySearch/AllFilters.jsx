import React, { useCallback, useEffect, useState } from 'react'
import Price from './Price';
import BedsNBaths from './BedsNBaths';
import States from './States';
import HomeType from './HomeType';
import { MdClose } from 'react-icons/md';
import For from './For';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const AllFilters = ({isOpen,onClose}) => {

    const [showAllFilter,setShowAllFilter] = useState(isOpen)
    const [searchValues,setSearchValues] = useState()
    const navigate = useNavigate()
    const path = useLocation().pathname
    
    const handleClose = useCallback(()=>{
        setShowAllFilter(false);
        setTimeout(()=>{onClose()},180)

    },[onClose])

    const onSearch = ()=>{

        handleClose()

        let a = Object.values(searchValues)
        let obj = {}

        for (let v of a){

            obj = {...obj, ...v}
        }

        let queryStr = '?'+ new URLSearchParams(obj).toString()
        navigate(`/admin/listings${queryStr}`)
    }



    useEffect(()=>{
        setShowAllFilter(isOpen)
    },[isOpen])

    
    if(!isOpen){

        return null
    }

  return (
    <div className='fixed inset-0 z-50 bg-neutral-800/10 text-slate-600'>
        <div className={`absolute right-0 w-[90%] md:w-[45vw] h-full bg-white dark:bg-slate-950 transition ${showAllFilter ? 'translate-x-0' : 'translate-x-[1000px]'} `}>
            <div className='h-16 px-2 md:px-8 py-5'>
                <p className='float-right cursor-pointer' onClick={handleClose}><MdClose size={24}/></p>
                <div className='clear-both'></div>
            </div>
            <div className='h-full-64 overflow-scroll'>
                <div className='border-b dark:border-slate-800 pb-6 px-2 md:px-8'>
                    <h1 className='text-lg md:text-xl font-bold'>Category</h1>
                    <div className='w-10/12 mx-auto text-sm'>
                        <For setSearchValues={setSearchValues}/>
                    </div>
                </div>

                {/* PRICE */}
                <div className='py-6 border-b dark:border-slate-800 px-2 md:px-9'>
                    <h1 className='text-lg md:text-xl font-bold'>Price</h1>
                    <div className='w-3/4 mx-auto'>
                        <Price setSearchValues={setSearchValues}/>
                    </div>
                    
                </div>

                {/* BEDS/BATHS */}
                <div className='border-b dark:border-slate-800 pb-6 px-2  md:px-8 py-8'>
                    <BedsNBaths setSearchValues={setSearchValues}/>
                </div>

                {/* STATES */}
                <div className='border-b dark:border-slate-800 pb-6 px-2  md:px-8 py-8'>
                    <h1 className='text-lg md:text-xl font-semibold'>States/LGAs</h1>
                    <p className='text-xs'>Type in for auto completion</p>

                    <div className='mt-4'>
                        <States setSearchValues={setSearchValues}/>
                    </div>
                </div>

                {/* Home type */}
                <div className='border-b dark:border-slate-800 pb-6 px-2  md:px-8 py-8'>
                    <div className='mb-2'>
                        <h1 className='text-lg md:text-xl font-semibold'>Home type</h1>
                    </div>
                    <HomeType setSearchValues={setSearchValues}/>
                </div>
                
            </div>
            <footer className='h-[60px]'>
                <div className='flex justify-between px-5 py-3'>
                    <div></div>
                    <button onClick={onSearch} className='bg-theme-color px-6 py-2 rounded-[2px] text-white font-semibold'>Search</button>
                </div>
            </footer>
        </div>
    </div>
  )
}

export default AllFilters