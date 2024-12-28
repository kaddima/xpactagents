import React from 'react'
import { toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { hideLoading, showLoading } from '../../../utility/loading'

// ICONS
import { RiLockPasswordLine } from "react-icons/ri"
import Axios from '../../../utility/axios'

const ChangePassword = () => {

	const { register, handleSubmit, watch, reset, formState: { errors } } = useForm()

	const onSubmitForm = (formData) => {

		showLoading()
		Axios.post('/change-password', formData)
			.then((data) => {
				if (data.data.status !== false) {
					toast("Password changed successfully", { type: 'success' });
					reset();
					return;
				} else {
					toast(data.data.message, { type: 'error' });
				}
			})
			.catch((e) => {
				if (e.response.status === 403) {
					toast(e.response.data.message, { type: 'error' });
				}
			})
			.finally(() => {
				hideLoading();
			});

	}


	return (
		<>
			<div className='h-full max-w-[550px] text-gray-600 rounded-lg px-4 py-3 '>
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
								})} className={`form-input dark:bg-transparent dark:border-slate-800 rounded-md placeholder:text-gray-400 placeholder:text-sm border-slate-300 mt-1 pl-2 w-full `}
								placeholder='Enter your old password' />

							{errors.password && (
								<p className="text-red-400 text-xs">{errors.password.message}</p>
							)}

						</div>
						<div className=''>
							<label htmlFor="" className='block'>New password</label>
							<input type="password" name="new_password" {...register('new_password',
								{
									required: "please enter new password",
									minLength: { value: 6, message: "Password too short" }
								})} className={`form-input dark:bg-transparent dark:border-slate-800 rounded-md placeholder:text-gray-400 placeholder:text-sm border-slate-300 mt-1 pl-2 w-full `}
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
							})} className={`form-input dark:bg-transparent dark:border-slate-800 rounded-md placeholder:text-gray-400 placeholder:text-sm border-slate-300 mt-1 pl-2 w-full `}
								placeholder='confirm password' />
							{errors.confirm_password && (
								<p className="text-red-400 text-xs">{errors.confirm_password.message}</p>
							)}

						</div>
						<div className='mt-3'>
							<button type='submit' className='text-sm text-white block w-full py-2 rounded hover:bg-theme-color/90 transition bg-theme-color'>
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