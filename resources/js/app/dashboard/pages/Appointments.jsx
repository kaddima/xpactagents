import React,{useState} from 'react'
import {useSelector,useDispatch} from "react-redux"

import axios from 'axios'
import {toast} from "react-toastify"

import { updateAppointments} from '../store/accountSlice'

const TableRow = ({data})=>{

  const dispatch = useDispatch()

  const handleResolve = (e)=>{

  axios.post('/admin/appointments/resolve', {appointment_id:data.id}).then(data=>{
    toast('Appointments has been resolved', {type:'success'});
    dispatch(updateAppointments(data.data.data))
    
  }).catch(e=>{

    console.log(e)
  })
  }

  return (
  <tr className=''>
  <td className='border-b-1 border-b-gray-300'>
    <div className='flex items-center'>
    <div className='w-4 h-4 rounded-full bg-blue-600 flex justify-center items-center p-4'>
      <span className='font-bold'>{data.first_name.toUpperCase()[0]}</span>
    </div>
    <div>
      <p className='text-sm text-gray-700'>{data.first_name} {data.last_name}</p>
    </div>
    </div>
  </td>

  <td className='border-b-1 border-b-gray-300'>
    <span className='text-sm text-center block text-gray-700'>{data.email}</span>
  </td>

  <td className='border-b-1 border-b-gray-300'>
    <span className='text-sm text-center block text-gray-700'>{data.phone}</span>
  </td>

  <td className='border-b-1 border-b-gray-300'>
    <span className='text-sm text-center block text-gray-700'>{data.date}</span>
  </td>

  <td className='border-b-1 border-b-gray-300'>
    <span className='text-sm text-center block text-gray-700'>{data.date}</span>
  </td>

  <td className='border-b-1 border-b-gray-300'>
    <div className='flex items-center space-x-1 flex-wrap'>
    <div>
      <button type='button'
      title='Edit Agent'
      data-type="edit-agent"
      onClick={handleResolve}
      className='p-1 bg-sky-800 rounded inline-block text-center
      cursor-pointer hover:bg-slate-300 text-slate-600 text-sm hover:dark:bg-slate-800'>
      Resolve
      </button>
    </div>
    </div>
  </td>
  </tr>
  )
}

const Appointments = () => {

  const appointments = useSelector(state=>state.account.appointments)

  if(appointments.length == 0 ){

  return (

    <div className='w-full h-full bg-white overflow-auto flex justify-center items-center'>
    <div>
      <h1>No appointments available</h1>
    </div>
    </div>
  )
  }

  return (
  <div className='w-full h-full bg-white overflow-auto'>
  <div className='w-11/12  mx-auto text-gray-500 pt-5 md:h-full overflow-auto'>
    <div className='mb-5'>
    <h1 className='text-xl font-bold'>Agents</h1>
    <p className='text-xs'>The table displays all agents</p>
    </div>

    <div>
    <table className='w-full table-auto border-collapse  text-gray-700'>
      <thead>
      <tr>
        <th className=''>
        Name
        </th>
        <th className='text-center'>Email</th>
        <th className='text-center'>phone</th>
        <th className='text-center'>scheduled date</th>
        <th className='text-center'>created at</th>
        <th className='w-[20%]'></th>
      </tr>
      </thead>

      <tbody>

      {appointments.map((data,i)=>{

      return <TableRow key={i} data={data}/>
      })}
          
      </tbody>
    </table>
    </div>
  </div>

  </div>
  )
}

export default Appointments