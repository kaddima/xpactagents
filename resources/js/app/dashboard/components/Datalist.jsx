import React, { useEffect, useState } from 'react'
import { MdAdd } from 'react-icons/md'
import { useForm } from "react-hook-form"
import $ from 'jquery'

const Datalist = ({ setAmenities=()=>{} }) => {

	const [showForm, setShowForm] = useState(false)
	const [btnDisabled, setBtnDisabled] = useState(false)

	const { handleSubmit, register, formState: { errors }, reset } = useForm()

	const onAdd = (data) => {
		//empty the form
		$('#input').val('')

		setAmenities(state => {
			let arr = []

			//prevent duplicate amenities
			for (let i = 0; i < state.length; i++) {
				if (state[i] == data.amenities) {
					return state
				}
			}

			return [...state, data.amenities]
		})

	}

	useEffect(() => {
		$(function () {

			var handler = function (event) {
				// if the target is a descendent of container do nothing
				if ($(event.target).is(".add-amenities, .add-amenities *")) return;

				setShowForm(false);
				$('#input').val('')
			}

			$(document).on("click", handler);
		})
	}, [])

	if (!showForm) {
		return (
			<div className='w-8'>
				<button onClick={() => { setShowForm(true) }} disabled={btnDisabled} className='add-amenities'>
					<MdAdd size={24} />
				</button>
			</div>
		)
	}

	return (
		<div className='absolute left-0   border md:w-[35vw] max-w-[230px] text-slate-600 add-amenities'>
			<input {...register('amenities', { required: "Please provide a genre" })}
				id='input'
				list={'value'}
				className='bg-transparent form-input w-full'
				placeholder='Enter genre' />
			<datalist id={'value'}>
				<option className='bg-slate-600 text-gray-300' value="Air conditioning" />
				<option className='bg-slate-600 text-gray-300' value="Dishwasher" />
				<option className='bg-slate-600 text-gray-300' value="Furnished" />
				<option className='bg-slate-600 text-gray-300' value="In-unit washer & dryer" />
				<option className='bg-slate-600 text-gray-300' value="Laundry facility" />
				<option className='bg-slate-600 text-gray-300' value="Parking allowed" />
				<option className='bg-slate-600 text-gray-300' value="pool" />
				<option className='bg-slate-600 text-gray-300' value="Utilities included" />
			</datalist>
			{errors.amenities && <p className='text-xs block text-red-600'>{errors.amenities.message}</p>}

			<div className='flex absolute text-xs -top-3 right-0 gap-3'>
				<button
					onClick={handleSubmit(onAdd)}
					className='bg-[#65c0cf] text-white px-2 py-1 font-bold rounded'>
					Add
				</button>
				<button
					onClick={() => { setShowForm(false); $('#input').val('') }}
					className=' bg-[#65c0cf] text-white font-bold px-2 py-1 rounded'>
					Cancel
				</button>
			</div>
		</div>
	)
}

export default Datalist