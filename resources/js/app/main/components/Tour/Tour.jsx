import React, { useState } from 'react'
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Link, useParams } from 'react-router-dom';

const dateTime = ()=>{
    return (
        <div>
            <div className=''>
            <Calendar 
                    date={new Date(currentDate)}

                    onChange={(date)=>{
                        setCurrentDate(date)
                    }}

                />

            </div>
            <div>
                <select name="" id="" className='form-select border w-full'>
                    <option value="">11:30am</option>
                    <option value="">11:30am</option>
                    <option value="">11:30am</option>
                    <option value="">11:30am</option>
                    <option value="">11:30am</option>
                    <option value="">11:30am</option>
                    <option value="">11:30am</option>
                    <option value="">11:30am</option>
                    <option value="">11:30am</option>
                    <option value="">11:30am</option>
                </select>
            </div>
        </div>
    )
}

const Tour = () => {
    const [currentDate, setCurrentDate] = useState(Date.now())
    const property_id = useParams().id
  return (

    <div className='mt-8 w-full'>
        {/* <div className='w-full'>
            <ul className='flex items-center w-full justify-center'>
                <li className=''>
                    <button className='px-10 py-1 border rounded border-sky-800 font-semibold text-sky-800'>
                        In-Person
                    </button>      
                </li>
                <li className=''>
                    <button className='px-10 py-1  border rounded border-sky-800 font-semibold text-sky-800'>
                        Video chat
                    </button>      
                </li>
            </ul>
        </div> */}
        <div className=''>
            <Calendar 
                    date={new Date(currentDate)}

                    onChange={(date)=>{
                        setCurrentDate(date)
                    }}

                />

        </div>
        <div>
            <select name="" id="" className='form-select border w-full'>
                <option value="">11:30am</option>
                <option value="">11:30am</option>
                <option value="">11:30am</option>
                <option value="">11:30am</option>
                <option value="">11:30am</option>
                <option value="">11:30am</option>
                <option value="">11:30am</option>
                <option value="">11:30am</option>
                <option value="">11:30am</option>
                <option value="">11:30am</option>
            </select>
        </div>

        <div className='mt-5'>
            <Link to={`/app/tour/${property_id}/checkout`} className='bg-sky-800 font-semibold text-center text-white p-2 w-full block rounded'>Request this time</Link>
        </div>
    </div>

  )
}

export default Tour