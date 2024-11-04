import React from 'react'
import CalenderEvent from '../../components/CalenderEvent'
import { format, parseISO } from 'date-fns'
import { useEffect } from 'react'
import { useState } from 'react'
import EmptyState from '../../components/EmptyState'
import Axios from '../../../utility/axios'
import { Link, useParams } from 'react-router-dom'

const TableRow = ({data,index})=>{

   
	return (
		  <tr className='py-3'>
			  <td className='hidden md:block text-center border-b-1 border-b-gray-300 py-3'>
				  <span className='text-sm block text-gray-700'>{index}</span>
			  </td>
			   <td className='text-center border-b-1 border-b-gray-300'>
				  <span className='text-sm text-center block text-gray-700'>{data.first_name} {data.last_name}</span>
			  </td>
			   <td className='text-center border-b-1 border-b-gray-300'>
				  <span className='text-sm text-center block text-gray-700'>{data.phone}</span>
			  </td>
			  <td className='text-center border-b-1 border-b-gray-300'>
				  <span className='text-sm text-center block text-gray-700'>{data.date && format(parseISO(data.date), 'eee, dd MMM Y')}</span>
			  </td>
			  <td className='text-center border-b-1 border-b-gray-300'>
				  <span className='text-sm text-center block text-gray-700'>
					  {format(parseISO(data.date), 'h:mm a')}
				  </span>
			  </td>
  
			  <td className='border-b-1 border-b-gray-300'>
				  <span className='text-sm block text-gray-700'></span>
			  </td>
			  <td className='border-b-1 border-b-gray-300'>
				<div className='text-xs font-[500] flex items-center flex-wrap'>
					<Link to={`/admin/listings/${data.property_id}`}><span className='text-theme-color'>view</span></Link>
					
				</div>
			  </td>
		  </tr>
	)
  }
  

const AgentTours = () => {

	const [tourList,setTourList] = useState([])
    const agent_id = useParams().id

	useEffect(()=>{

			Axios.get('/tours/agent/all', {params:{agent_id}}).then((data)=>{
				setTourList(data.data.data)
				//console.log(data.data)
			}).catch(e=>{
				console.log(e)
			})
		},[])


	if(!tourList.length){

		return (
			<div className='w-full h-full  '>
				<EmptyState title='No tour requests' subtitle='All tour request will be listed on this page'/>
			</div>
			
		)
	}
	
  return (
    <div className='w-full'>
        <div className='  overflow-hidden'>
			<div className='w-[98vw] md:w-[80vw] px-3 mx-auto'>
				<div className='mb-5'>
					<h1 className='text-lg font-semibold'>Calender view</h1>
					<p className='text-sm'>Preview of your approved tour dates</p>
				</div>
				<div className='h-[70vh] '>
					<CalenderEvent eventLists={tourList}/>
				</div>
				
			</div>  
          

			<div className='mt-5'>
				<div className='overflow-auto'>
					<div className=' rounded-lg space-y-4 p-5'>
						<div>
							<h1 className='text-xl font-semibold text-slate-600'>Tours / <span className='text-sm'>Table</span></h1>
							{/* <div>
								<Link to="#">Accepted</Link>
							</div> */}
						</div>
						
						<div className='overflow-auto'>
							<table className='w-full table-auto border-separate text-slate-500'>
								<thead>
									<tr className='text-sm'>
										<th className='hidden md:block w-[5%]'>S/N</th>
										<th className='text-center'>Fullname</th>
										<th className='text-center'>Phone</th>
										{/* <th className='text-center'>Debit</th> */}
										<th className='text-center'>Date</th>
										<th className=''>Time</th>
										<th className=''></th>
									</tr>
								</thead>

								<tbody>

									{tourList.map((data,i)=>(

										<TableRow key={i} data={data} index={i+1}/>

									))}
									
								
								</tbody>
							</table>
						</div>
					</div>
				
				</div>	
			</div>
   
        </div>
        
    </div> 
  )
}

export default AgentTours