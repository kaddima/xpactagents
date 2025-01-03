import React, { useState } from 'react'
import { Calendar } from 'react-date-range'
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Link, useParams } from 'react-router-dom';

const Tour = () => {
	const [currentDate, setCurrentDate] = useState(Date.now())
	const property_id = useParams().id
	return (

		<div className='mt-8 w-full'>
			<div className=''>
				<Calendar
					date={new Date(currentDate)}

					onChange={(date) => {
						setCurrentDate(date)
					}}

				/>

			</div>
			<div>
				<select name="" id="" className='form-select border dark:bg-transparent w-full'>
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