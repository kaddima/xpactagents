import React from 'react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { hideLoading, showLoading } from '../../../utility/loading'
// ICONS
import { RiLockPasswordLine } from "react-icons/ri"
import Axios from '../../../utility/axios'
import errorHandler from '../../../utility/errorHandler'

const ChangePassword = () => {

	const { register, 
		handleSubmit, 
		watch, reset, 
		formState: { errors } } = useForm()

	const onSubmitForm = (formData) => {
		showLoading()

		Axios.post('/change-password', formData).then((data) => {
			toast("Password changed", { type: 'success' })
			reset()
		}).catch(e => {
			errorHandler(e)
		}).then(() => {
			hideLoading()
		})
	}

	return (
		<>
			<div className='max-w-[550px] rounded-lg px-4 py-3 '>
				<div className=' w-full p-5'>
					<div className='flex justify-between items-center'>
						<div>
							<h1 className='text-xl font-semibold'>Change password</h1>
							<p className='text-xs'></p>
						</div>

						<span className='text-4xl opacity-60'><RiLockPasswordLine /></span>
					</div>
					<form className='mt-4 text-sm font-semibold space-y-3' onSubmit={handleSubmit(onSubmitForm)}>
						<div className=''>
							<label htmlFor="" className='block'>Password</label>
							<input type="password" name="old_password" {...register('old_password',
								{
									required: "please enter password",
									minLength: { value: 6, message: "Password too short" }
								})} className={`form-input rounded-md placeholder:text-gray-400 placeholder:text-sm
									 border-slate-300 dark:border-slate-800 dark:bg-transparent mt-1 pl-2 w-full `}
								placeholder='Enter your old password' />

							{errors.old_password && (
								<p className="text-red-400 text-xs">{errors.old_password.message}</p>
							)}

						</div>
						<div className=''>
							<label htmlFor="" className='block'>New password</label>
							<input type="password" name="new_password" {...register('new_password',
								{
									required: "please enter new password",
									minLength: { value: 6, message: "Password too short" }
								})} className={`form-input rounded-md placeholder:text-gray-400 placeholder:text-sm
									 border-slate-300 dark:border-slate-800 dark:bg-transparent mt-1 pl-2 w-full `}
								placeholder='Enter your new password' />
							{errors.new_password && (
								<p className="text-red-400 text-xs">{errors.new_password.message}</p>
							)}
						</div>
						<div className=''>
							<label htmlFor="" className='block'>Confirm password</label>
							<input type="password" name="confirm_password" {...register("confirm_password", {
								required: "Please enter confirm password",
								minLength: { value: 6, message: "Password too short" },
								validate: (val) => {
									if (watch('new_password') != val) {
										return "Your passwords do no match";
									}
								},
							})} className={`form-input rounded-md placeholder:text-gray-400 placeholder:text-sm
								 border-slate-300 dark:border-slate-800 dark:bg-transparent mt-1 pl-2 w-full `}
								placeholder='confirm password' />
							{errors.confirm_password && (
								<p className="text-red-400 text-xs">{errors.confirm_password.message}</p>
							)}

						</div>
						<div className='mt-3'>
							<button type='submit' className='text-sm text-white block w-full py-2 rounded hover:bg-theme-color/90
							 transition bg-theme-color'>
								Change
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

export default ChangePassword