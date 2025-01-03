import React, { useState } from 'react'
import { Calendar } from 'react-date-range'
import Time from '../components/Tour/Time'
import { useForm } from "react-hook-form"
import { BsArrowLeft } from 'react-icons/bs'
import { format, getDate, getMonth, isPast, parse, toDate } from 'date-fns'
import { toast } from 'react-toastify'
import { hideLoading, showLoading } from '../../utility/loading'
import TourResquestSuccess from '../components/modals/PopUp/TourResquestSuccess'
import { tourRequestSuccessModalOpen } from '../store/mainSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import amTopm from '../../utility/amToPm'
import { getYear } from 'date-fns'
import Axios from '../../utility/axios'
import errorHandler from '../../utility/errorHandler'
import UserDetails from '../components/scheduleTor/userDetails'
import DatenTime from '../components/scheduleTor/datenTime'

const ScheduleTour = () => {
	const currentUser = useSelector(state=>state.user.profile);
	const [body, setBody] = useState('date_time')
	const { register, 
		handleSubmit, 
		reset,
		setError, 
		formState: { errors } } = useForm()
	const [dateTime, setDateTime] = useState({
		date: Date.now(),
		time: null
	})

	const property_id = useParams().id
	const dispatch = useDispatch()

	const onRequestTour = (data) => {
		if (!dateTime.time) {
			setBody('date_time')
			return
		}

		showLoading()

		const date = new Date(dateTime.date);
		let year = getYear(date)
		let month = getMonth(date) + 1
		let day = getDate(date)

		let fullDate = `${year}-${month}-${day} ${amTopm(dateTime.time)}`

		let formValues = { ...data, date: fullDate, property_id }

		Axios.post('/tours', formValues).then(data => {
			reset()
			setDateTime({
				date: Date.now(),
				time: null
			})

			//open the tour request success modal
			dispatch(tourRequestSuccessModalOpen())

		}).catch(e => {
			let response = e.response.data
			if (response.error == "Validation Error") {
				Object.keys(response.messages).forEach(field => {
					let errMsg = response.messages[field][0]
					setError(field, { type:"manual",message:errMsg });  // Display toast for each validation error

				});
			}else{
				errorHandler(e)
			}
		}).then(() => {
			hideLoading()
		})
	}

	return (
		<div className='w-full h-full overflow-scroll'>
			<div className='max-w-[750px] px-4 mx-auto pt-5 pb-16 relative'>
				<TourResquestSuccess />
				<div className='pt-8 text-slate-600'>

					{body == 'date_time' && <DatenTime setDateTime={setDateTime} />}
					{body == 'user_details' && <div>
						<div onClick={() => setBody('date_time')} className='mb-3 hover:bg-slate-300 p-1 rounded cursor-pointer inline-block'>
							<BsArrowLeft size={18} />
						</div>
						<UserDetails register={register} errorState={errors} />
					</div>}
					{body == 'date_time' && (
						<div className='mt-5'>
							<button
								type='button'
								disabled={dateTime.time ? false : true}
								onClick={() => setBody('user_details')}
								className={`${dateTime.time ? "hover:bg-theme-color/80" : 'cursor-not-allowed bg-theme-color/60'}
                         bg-theme-color  text-white font-semibold rounded-md py-[0.5rem] px-[1rem]`}>
								Next
							</button>
						</div>
					)}

					{body == 'user_details' && (
						<div className='mt-5'>
							<button onClick={handleSubmit(onRequestTour)}
								className='bg-theme-color text-white font-semibold rounded-md py-[0.5rem] px-[1rem]'>
								Request tour
							</button>
						</div>
					)}
				</div>
			</div>
			<div className='fixed bg-white dark:bg-slate-900 bottom-0 w-full py-2'>
				<div className='flex items-center justify-center text-center space-x-5 font-[430] text-sm'>
					<div className='mx-5'>
						<h1>Date </h1>
						<p className='font-bold'>{format(dateTime.date, 'eee, MMM dd')}</p>
					</div>
					<div className='ml-5'>
						<h1>Selected time</h1>
						<p className='font-bold'>{dateTime.time ? dateTime.time : '-'}</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ScheduleTour