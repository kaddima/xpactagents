import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { useForm } from "react-hook-form"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import $ from 'jquery'
import { toast } from 'react-toastify';

import { ImageUpload } from '../components';
import SelectedContainer from '../components/SelectedContainer';
import Datalist from '../components/Datalist';
import { MdHourglassEmpty } from 'react-icons/md';
import Axios from '../../utility/axios';
import States from '../components/PropertySearch/States';
import errorHandler from '../../utility/errorHandler';

const CreateProperty = () => {

	const initialValue = {
		name: '',
		address: '',
		amount: '',
		description: '',
		duration: 'year',
		bedrooms: '',
		bathrooms: '',
		toilets: '',
		category: '',
		property_fact: {
			unit: 'sq.ft',
			size: 0,
			upload_time: new Date().toString(),
			flooring: "Tiles"
		}
	}

	const [propertyID, setPropertyID] = useState(null)
	const [descriptionValue, setDescriptionValue] = useState('');
	const [amenities, setAmenities] = useState([])

	const { register,
		handleSubmit,
		watch,
		formState: { errors } } = useForm({ defaultValues: initialValue })


	// WATCH FORM VALUES
	const property_category = watch('category')
	const unit = watch('property_fact.unit')

	const submitForm = (data) => {

		//display spinner
		$('#spinner').fadeIn()

		let values = {
			...data,
			property_fact: { ...data.property_fact },
			description: descriptionValue,
			amenities
		}

		Axios.post('/properties', values).then(data => {
			toast('Listing created successfully', { type: 'success' })
			setPropertyID(data.data.data.property_id)
		}).catch(e => {
			errorHandler(e)
		}).finally(() => {

			$('#spinner').fadeOut()

			//scroll to the top
			let target = $('#main #create-property')

			if (target.length) {
				const pos = $(target).offset().top
				// animated top scrolling
				$('#main').animate({ scrollTop: pos });
			}
		})
	}

	return (

		<div className='relative' id='create-property'>
			<div className='md:w-11/12 mx-auto'>
				<div className='px-5 md:px-0'>
					<div className='pt-5'>
						<h1 className='text-2xl font-bold'>Create new property</h1>
						<p className='text-xs'>This page creates new listings</p>
					</div>

					<div className='mt-10'>
						{/* IMAGE */}

						<form action="" onSubmit={handleSubmit(submitForm)}>
							<div className='md:flex md:flex-row flex-col md:gap-5'>
								<div className='w-full md:w-3/5'>
									<div className='text-sm space-y-5 px-2'>

										<div className='max-h-[350px] overflow-hidden'>
											{propertyID ? (<div className='border border-dashed p-1 border-green-500 rounded-md'>
												<div className='mb-2'>
													<h1 className='text-sm text-slate-600 font-semibold'>Upload Image</h1>
													<ul className='text-xs list-disc ml-4'>
														<li>You can upload an image for your recently created listing or</li>
														<li>You can choose to upload an image later on the property
															<Link to={`/dashboard/property/${propertyID}/edit`}
																className='text-blue-400'>
																edit page</Link> </li>
													</ul>
												</div>
												<ImageUpload property_id={propertyID} />
											</div>) :
												(<div className='h-[150px] flex flex-col justify-center rounded-lg border-[2px]
												 border-orange-600 border-dashed'>
													<div className=''>
														<MdHourglassEmpty size={32} className='mx-auto' />
														<ul className='text-xs list-disc ml-4'>
															<li>To upload an image for the property first fill in the required fields</li>
															<li>Thereafter click on the
																<span className='text-orange-400 font-semibold'>"Create"</span>
																button to create your listings</li>
															<li>The image upload window will appear after the above steps</li>
														</ul>
													</div>
												</div>)}
										</div>

										<div>
											<label htmlFor="" className='block'>Name</label>
											<input type="text"
												{...register('name', { required: "Name of listing must be filled  " })}
												className='form-input bg-transparent  border w-full'
												placeholder='Property name'
											/>
											{errors.name && (
												<p className="text-red-400 text-xs">{errors.name.message}</p>
											)}
										</div>

										<div>
											<label htmlFor="" className='block'>Amount</label>
											<input type="number"
												{...register('amount')}
												className='form-input bg-transparent border w-full'
												placeholder='Amount'
											/>
										</div>

										<div>
											<p className='mb-2 text-sm font-[400]'>Description</p>
											<div className='h-[250px] overflow-auto'>
												<ReactQuill theme="snow"
													value={descriptionValue}
													onChange={setDescriptionValue}
													className='h-[200px]' />
												<div className=''></div>

											</div>
										</div>
										<div>
											<h1>States and Lgas</h1>
											<States register={register} className={'bg-transparent'} />
											{errors.state && (
												<p className="text-red-400 text-xs">{errors.state.message}</p>
											)}
											{errors.lga && (
												<p className="text-red-400 text-xs">{errors.lga.message}</p>
											)}
										</div>

										<div>
											<label htmlFor="" className='block'>Address</label>
											<input type="text"
												{...register('address')}
												className='form-input bg-transparent border w-full'
												placeholder='Address'
											/>
										</div>

										<div>
											<label htmlFor="" className='block'>Property category</label>
											<select name="category"
												{...register('category', { required: "Please choose the property category" })}
												className='form-select bg-transparent border w-full'    >
												<option value="">Choose property type</option>
												<option value="sell">For sell</option>
												<option value="rent">For rent</option>
												<option value="short_let">Short let</option>
												<option value="land">Land</option>
											</select>

											{errors.category && (
												<p className="text-red-400 text-xs">{errors.category.message}</p>
											)}
										</div>

										<div>
											<label htmlFor="" className='block'>other category</label>
											<select name="other_category"
												{...register('other_category', { required: "Please choose the property category" })}
												defaultValue={'any'}
												className='form-select bg-transparent border w-full'>
												<option value="any">Any</option>
												<option value="lux">Luxury</option>
												<option value="modern">Modern</option>
												<option value="beach">Beach</option>
												<option value="lake">Lake</option>
												<option value="pool">Pool</option>
												<option value="island">Island</option>
												<option value="camping">Camping</option>
												<option value="countryside">Country side</option>
												<option value="estate">Estate</option>
												<option value="mansion">Mansion</option>
												<option value="castle">Castle</option>
											</select>

											{errors.other_category && (
												<p className="text-red-400 text-xs">{errors.other_category.message}</p>
											)}
										</div>

										{(property_category !== 'land' && property_category !== 'sell') && (
											<div>
												<label htmlFor="" className='block'>Duration</label>
												<select name="duration"
													{...register('duration')}
													className='form-select bg-transparent border w-full'  >
													<option value="">Select duration</option>
													<option value="year">Year</option>
													<option value="month">Month</option>
													<option value="day">Day</option>
													<option value="week">Week</option>
												</select>
											</div>
										)}

										{(property_category !== 'land') && (<>

											<div>
												<label htmlFor="property-type">Property Type</label>
												<input list='property-type'
													name='property_type'
													{...register("property_type", { required: "Property type must be filled  " })}
													type='text'
													className='form-input bg-transparent border w-full ' />
												<datalist id='property-type'
													className='form-select w-full focus:outline-0 focus:border- text-xs text-slate-400'>
													<option className='bg-slate-600 text-gray-300' value="Condo" />
													<option className='bg-slate-600 text-gray-300' value="Duplex" />
													<option className='bg-slate-600 text-gray-300' value="Bungalow" />
													<option className='bg-slate-600 text-gray-300' value="Apartment" />
													<option className='bg-slate-600 text-gray-300' value="Mansion" />
												</datalist>
												{errors.property_type && (
													<p className="text-red-400 text-xs">{errors.property_type.message}</p>
												)}
											</div>

											<div className='flex justify-between items-center'>
												<div>
													<label htmlFor="" className='block'>Bedrooms</label>
													<select name="bedrooms"
														{...register('bedrooms')}
														className='form-select bg-transparent border w-full'
													>
														<option value="">How many bedrooms</option>
														{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) => {
															return (
																<option key={i} value={v}>{v}</option>
															)
														})}
													</select>
												</div>
												<div>
													<label htmlFor="" className='block'>Bathrooms</label>
													<select name="bathrooms"
														{...register('bathrooms')}
														className='form-select bg-transparent border w-full'>
														<option value="">How many bathrooms</option>
														{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) => {
															return (
																<option key={i} value={v}>{v}</option>
															)
														})}
													</select>
												</div>
												<div>
													<label htmlFor="" className='block'>Toilets</label>
													<select name="toilets"
														{...register('toilets')}
														id=""
														className='form-select bg-transparent border w-full'    >
														<option value="">How many toilets</option>
														{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, i) => {
															return (
																<option key={i} value={v}>{v}</option>
															)
														})}
													</select>
												</div>
											</div>
										</>)}
										<div>
											<div className={`fixed bottom-5 right-5 text-sm `}>
												<div className='flex items-center gap-3'>
													<button disabled={propertyID ? true : false}
														type='submit'
														className='disabled:cursor-not-allowed disabled:bg-theme-color/60 bg-theme-color
													 text-white py-2 px-4 rounded'>
														Create
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className='w-full md:w-2/5'>
									<div>
										<h1 className='text-lg font-semibold mb-4'>Property Facts</h1>
										<div className='space-y-3'>
											{property_category != 'land' && <>
												<div>
													<label htmlFor="" className='block'>Year Built</label>
													<input type="number"
														{...register("property_fact.year_built")}
														className='form-input bg-transparent border rounded w-full' />
												</div>
											</>}

											<div>
												<label htmlFor="">Time on Xpact Agent</label>
												<input type="datetime-local"
													{...register("property_fact.upload_time")}
													className='form-input bg-transparent border w-full ' />
											</div>

											<div>
												<p className='capitalize'>
													Property size(<span className='text-sm text-sky-800'>{unit ? unit : ''}</span>)
												</p>
												<span className='text-xs inline-block mt-[-3px] mb-1 text-slate-500'>
													Enter property size and choose unit of measurement
												</span>
												<div className='flex items-center w-full space-x-2'>
													<div className='w-[60%] flex-1'>
														<input type="number"
															{...register('property_fact.size', { required: "Please provide property size" })}
															className='form-input bg-transparent border w-full'
															placeholder='Enter property size' />
													</div>
													<div className='w-[40%] flex-1'>
														<input list='unit'
															name='property_type'
															{...register("property_fact.unit", { required: "Please provide unit" })}
															type='text'
															className='form-input bg-transparent border w-full'
															placeholder='Enter Measurement' />
														<datalist id='unit'
															className='form-select w-full focus:outline-0 focus:border- text-xs text-slate-400'>
															<option className='bg-slate-600 text-gray-300' value="plot" />
															<option className='bg-slate-600 text-gray-300' value="acre" />
															<option className='bg-slate-600 text-gray-300' value="hectare" />
															<option className='bg-slate-600 text-gray-300' value="sq.ft" />
														</datalist>
													</div>
												</div>
												{errors.property_fact && (
													<p className="text-red-400 text-xs">
														{errors.property_fact?.size.message}
													</p>
												)}
												{errors.property_fact && (
													<p className="text-red-400 text-xs">
														{errors.property_fact.unit?.message}
													</p>
												)}
											</div>
											{property_category != 'land' && <>
												<div>
													<label htmlFor="">Flooring (tiles,wood,)</label>
													<input type="text"
														{...register('property_fact.flooring')}
														className='form-input bg-transparent border w-full ' />
												</div>
											</>}
										</div>

									</div>

									{property_category != 'land' && <>
										<div className='mt-5'>
											<h1 className='text-lg font-semibold'>Amenities</h1>
											<p className='text-sm'>Select or add multiple amenities.</p>
											<div className='mt-3'>
												<div className='bg-slate-600'>
													<div className='flex flex-wrap items-center gap-2'>
														{amenities?.map((amenitie, i) => {
															return <SelectedContainer key={i}
																name={amenitie} setValues={setAmenities} />
														})}
													</div>
												</div>
												<div className='relative'>
													<Datalist setAmenities={setAmenities} />
												</div>

											</div>
										</div>
									</>}
									<div className='mt-5 hidden'>
										<h1 className='text-xl font-semibold '>Location</h1>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CreateProperty