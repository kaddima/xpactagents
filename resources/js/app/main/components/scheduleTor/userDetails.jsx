const UserDetails = ({ register, errorState }) => {
	return <>
		<form action="">
			<div className='space-y-5'>
				<div>
					<h1 className='text-3xl font-bold'>Tell us a little about yourself</h1>
					<p className='font-sm font-[400]'>We will never share your information or spam you.</p>
				</div>
				<div>
					<label htmlFor="">First name</label>
					<input type="text"
						{...register('first_name', { required: "Please provide first name" })}
						className='form-input border dark:bg-transparent rounded block w-full'
						placeholder='John' />
					{errorState.first_name && (
						<p className="text-red-400 text-sm">{errorState.first_name.message}</p>
					)}
				</div>
				<div>
					<label htmlFor="">Last name</label>
					<input type="text"
						{...register('last_name', { required: "Please provide second name" })}
						className='form-input border dark:bg-transparent rounded block w-full'
						placeholder='Doe' />
					{errorState.last_name && (
						<p className="text-red-400 text-sm">{errorState.last_name.message}</p>
					)}
				</div>
				<div>
					<label htmlFor="">Email</label>
					<input type="email"
						{...register('email', { required: "Please provide email address" })}
						className='form-input border dark:bg-transparent rounded block w-full'
						placeholder='Doe' />
					{errorState.email && (
						<p className="text-red-400 text-sm">{errorState.email.message}</p>
					)}
				</div>
				<div>
					<label htmlFor="">Phone</label>
					<input type="text"
						{...register('phone', {
							required: "Phone number is required",
							minLength: { value: 11, message: "Phone length too short" }
						})}
						className='form-input border dark:bg-transparent rounded block w-full'
						placeholder='(+234) 902 -4567-233' />
					{errorState.phone && (
						<p className="text-red-400 text-sm">{errorState.phone.message}</p>
					)}
					<p className='text-slate-500 text-sm pt-4'>
						By providing your phone number, you consent to receive calls/text
						messages from Redfin about your tour.</p>
				</div>

				<div>
					<label htmlFor="">
						Notes <span className='text-sm text-slate-500'>(optional)</span>
					</label>
					<textarea name="" id=""
						{...register('notes')}
						className='w-full form-textarea dark:bg-transparent'
						placeholder='Are there other times that could work for a tour? We could get you confirmed faster.'>

					</textarea>
				</div>

				<div>
					<p>What's the best way to contact you? <span>(Optional)</span></p>

					<div className='flex items-center space-x-5 mt-3'>
						<div>
							<input type="radio"
								id='email'
								{...register('best_contact', {required:"Please pick a preffered way to contact you"})}
								name='best_contact'
								className='h-5 w-5 form-radio dark:bg-transparent'
								value={'email'} />
							<label htmlFor="email" className='inline-block pl-2'>Email</label>
						</div>
						<div>
							<input type="radio"
								id='call'
								{...register('best_contact')}
								name='best_contact'
								className='h-5 w-5 form-radio dark:bg-transparent'
								value={'call'} />
							<label htmlFor="call" className='inline-block pl-2'>Call</label>
						</div>
						<div>
							<input type="radio"
								id='text'
								{...register('best_contact')}
								name='best_contact'
								className='h-5 w-5 form-radio dark:bg-transparent'
								value={'text'} />
							<label htmlFor="text" className='inline-block pl-2'>Text</label>
						</div>
						{errorState.best_contact && (
						<p className="text-red-400 text-sm">{errorState.best_contact.message}</p>
					)}
					</div>
				</div>

				<div>
					<p className='text-sm'>
						By continuing, you agree to our
						<a href="/terms-of-use" className='text-sky-800 font-semibold'>
							Terms of Use
						</a> and
						<a href="/privacy-policy" className='text-sky-800 font-semibold'>Privacy Policy</a>
					</p>
				</div>
			</div>
		</form>
	</>
}

export default UserDetails