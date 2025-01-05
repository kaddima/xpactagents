import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { useForm } from "react-hook-form"
import { hideLoading, showLoading } from '../../utility/loading'
import Axios from '../../utility/axios'
import errorHandler from '../../utility/errorHandler'
import { useSearchParams } from 'react-router-dom'

/**
 * 
 * @param {*} type
 * Determines which user type to search for--user or agents
 * @param statefn
 * This update the users list 
 * @returns 
 */
const SearchBox = ({ type, statefn }) => {

	const { register, handleSubmit, formState: { errors } } = useForm()
	const [params, setSearchParams] = useSearchParams()

	const generateSearchParams = (data) => {
		const isNumber = (data) => {
			let regex = /^(070|080|081|090|091)\d{8}$/;
			return regex.test(data);
		};

		const isEmail = (data) => {
			let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			return regex.test(data);
		};

		if (isNumber(data)) {
			return { type: "phone", value: data }
		} else if (isEmail(data)) {
			return { type: "email", value: data }
		} else {
			return { type: "name", value: data }
		}
	};

	const onSearch = (data) => {
		const result = generateSearchParams(data.q)
		let q = { [result.type]: result.value, search_type: type }
		showLoading()
		Axios.get('/admin/users/search', { params: q }).then(result => {
			setSearchParams(q)
			statefn(result.data.data)
		}).catch(e => {
			errorHandler(e)
		}).finally(() => {
			hideLoading()
		})
	}

	return (
		<div>
			<form action="" onSubmit={handleSubmit(onSearch)}>
				<div className='relative'>
					<input type="text" {...register('q', { required: true })} className='form-input w-full bg-transparent rounded shadow-md h-10' placeholder={`Search ${type} by name`} />
					<button className='rounded-tr rounded-br absolute w-12 top-0 right-0 flex justify-center items-center bg-purple-950 hover:bg-purple-950/60 text-white h-10'>
						<FaSearch size={24} />
					</button>
				</div>

			</form>
		</div>
	)
}

export default SearchBox