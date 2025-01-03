import { useState } from "react";
import { Calendar } from "react-date-range";
import Time from "../Tour/Time";

const DatenTime = ({ setDateTime }) => {
	const [currentDate, setCurrentDate] = useState(new Date())
	return <>
		<h1 className='text-3xl font-bold'>Tour with a Partner Agent</h1>
		<p className='font-sm font-[400]'>
			Partner Agents work for other brokerages but share our commitment to customer service
		</p>

		<div className='mx-auto'>
			<Calendar
				date={new Date(currentDate)}

				onChange={(dateValue) => {
					//console.log(dateValue)
					if (isPast(dateValue)) {
						toast("Please select future date", { type: 'success' })
						return;
					}
					setCurrentDate(dateValue)

					setDateTime(prev => {
						return { ...prev, date: dateValue }
					})
				}}
			/>
		</div>
		<div>
			<h1 className='text-3xl font-bold'>When are you available?</h1>
			<p className='mb-5'>Choose a time that works for you.</p>
			<Time stateFn={setDateTime} />
		</div>
	</>
}

export default DatenTime