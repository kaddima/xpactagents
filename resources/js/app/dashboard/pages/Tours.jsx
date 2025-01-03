import React from 'react'
import CalenderEvent from '../components/CalenderEvent'
import { format, parseISO } from 'date-fns'
import { useEffect } from 'react'
import { useState } from 'react'
import EmptyState from '../components/EmptyState'
import Axios from '../../utility/axios'
import { Link } from 'react-router-dom'
import { hideLoading, showLoading } from '../../utility/loading'
import { toast } from 'react-toastify'
import errorHandler from '../../utility/errorHandler'


const TableRow = ({ data, index, onResolve }) => {
	return (
		<tr className=''>
			<td className='hidden md:block text-center border-b-1 border-b-gray-300 py-3'>
				<span className='text-sm block'>{index}</span>
			</td>
			<td className='text-center border-b-1 border-b-gray-300'>
				<span className='text-sm text-center block'>{data.first_name} {data.last_name}</span>
			</td>
			<td className='text-center border-b-1 border-b-gray-300'>
				<span className='text-sm text-center block '>{data.phone}</span>
			</td>
			<td className='text-center border-b-1 border-b-gray-300'>
				<span className='text-sm text-center block '>{data.date && format(parseISO(data.date), 'eee, dd MMM Y')}</span>
			</td>
			<td className='text-center border-b-1 border-b-gray-300'>
				<span className='text-sm text-center block '>
					{format(parseISO(data.date), 'h:mm a')}
				</span>
			</td>

			<td className='border-b-1 border-b-gray-300'>
				<span className='text-sm block text-gray-700'></span>
			</td>
			<td className='border-b-1 border-b-gray-300'>
				<div className='text-xs font-[500] flex items-center flex-wrap'>
					<Link to={`/dashboard/property/${data.property_id}`}><span className='text-theme-color'>view</span></Link>
					<button onClick={() => onResolve(data.id)} className='px-2 border border-black/90 rounded-sm md:ml-3'>
						Resolve
					</button>
				</div>
			</td>
		</tr>
	)
}


const Tours = () => {

	const [tourList, setTourList] = useState({ data: [], meta: {} })

	const resolveTour = (tour_id) => {
		showLoading()
		Axios.patch(`/tours/${tour_id}`).then(data => {
			toast('Resolved successfully', { type: 'success' })

			setTourList(prev => {
				let data = prev.data.filter((v, i) => {
					return v.id !== tour_id
				})
				return { ...prev, data }
			})
		}).catch(e => {
			errorHandler(e)
		}).finally(() => {
			hideLoading()
		})
	}

	useEffect(() => {
		Axios.get('/tours',{params:{type:"unresolved"}}).then((data) => {
			setTourList(data.data?.data)
		}).catch(e => {
			errorHandler(e)
		})
	}, [])

	if (!tourList.data.length) {
		return (
			<div className='w-full h-full  '>
				<EmptyState title='No tour requests' subtitle='All tour request will be listed on this page' />
			</div>
		)
	}

	return (
		<div className='w-full'>
			<h1 className='text-2xl font-bold mb-8'>Tour requests</h1>
			<div className='  overflow-hidden py-5'>
				<div className='w-[98vw] md:w-[80vw] px-3 mx-auto'>
					<div className='mb-5'>
						<h1 className='text-lg font-semibold'>Calender view</h1>
						<p className='text-sm'>Preview of your approved tour dates</p>
					</div>
					<div className='h-[70vh] '>
						<CalenderEvent eventLists={tourList.data} />
					</div>
				</div>
				<div className='mt-5'>
					<div className='overflow-auto'>
						<div className=' rounded-lg space-y-4 p-5'>
							<div>
								<h1 className='text-xl font-semibold text-slate-600'>
									Tours / <span className='text-sm'>Table</span>
								</h1>
							</div>

							<div className='overflow-auto'>
								<table className='w-full table-auto text-slate-500'>
									<thead>
										<tr className='text-sm'>
											<th className='hidden md:block w-[5%]'>S/N</th>
											<th className='text-center'>Fullname</th>
											<th className='text-center'>Phone</th>
											<th className='text-center'>Date</th>
											<th className=''>Time</th>
											<th className=''></th>
										</tr>
									</thead>

									<tbody>

										{tourList.data.map((data, i) => (
											<TableRow key={i}
												data={data}
												index={i + 1}
												onResolve={resolveTour} />
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

export default Tours