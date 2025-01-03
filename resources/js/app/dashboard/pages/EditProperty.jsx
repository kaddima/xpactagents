import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { useForm } from "react-hook-form"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { useSelector } from 'react-redux';
import $ from 'jquery'
import { toast } from 'react-toastify';

import { ImageUpload } from '../components';
import SelectedContainer from '../components/SelectedContainer';
import Datalist from '../components/Datalist';
import PhotoManager from '../components/PhotoManager';
import { BsCardImage } from 'react-icons/bs';
import Axios from '../../utility/axios';
import { hideLoading, showLoading } from '../../utility/loading';
import States from '../components/PropertySearch/States';
import errorHandler from '../../utility/errorHandler';

const EditProperty = () => {

	const initialValue = {
		name: '',
		address: '',
		amount: '',
		description: '',
		duration: '',
		bedrooms: '',
		amenities: '',
		property_type: '',
		bathrooms: '',
		toilets: '',
		property_category: '',
		property_fact: {
			unit: "sq.ft",
			size: 0,
			upload_time: "",
			year_built: "",
			flooring: "Tiles"
		}
	}

	const property_id = useParams().id
	const currentUser = useSelector(state => state.user.profile)
	const [propertyDetails, setPropertyDetails] = useState({})
	const [descriptionValue, setDescriptionValue] = useState('');
	const [showPhotoManager, setShowPhotoManager] = useState(false)
	const [amenities, setAmenities] = useState([])

	const { register,
		handleSubmit,
		watch,
		reset,
		formState: { errors } } = useForm({ defaultValues: initialValue })

	// WATCH FORM VALUES
	const property_category = watch('property_category')
	const propertyName = watch('name')
	const unit = watch('property_fact.unit')

	// ON FORM SUBMIT
	const submitForm = (data) => {
		//display spinner
		$('#spinner').fadeIn()

		let values = {
			...data,
			property_fact: { ...data.property_fact },
			description: descriptionValue,
			amenities
		}

		Axios.put(`/properties/${property_id}`, values).then(data => {
			toast('Update successful', { type: 'success' })
		}).catch(e => {
			errorHandler(e)
		}).finally(() => {
			//display spinner
			$('#spinner').fadeOut()
		})
	}

	// Update property image
	const setPropertyImage = (image) => {
		setPropertyDetails(prev => {
			if (Array.isArray(image)) {
				return { ...prev, images: image };
			} else {
				return { ...prev, images: [...prev.images, image] };
			}
		})
	}

	const onPublished = (property_id, status) => {

		if (currentUser.profile_complete != 1) {
			toast('You have to complete your registration before you can publish your properties',
				{ type: 'error' })
			return
		}

		showLoading()

		Axios.post(`/properties/${property_id}/published/${status}`).then(data => {
			toast(`Your property is now ${propertyDetails.published == 0 ? 'public ' : 'private'}`, { type: 'success' })
			setPropertyDetails(prev => {
				return { ...prev, published: prev.published == 1 ? 0 : 1 }
			})
		}).catch(e => {
			errorHandler(e)
		}).finally(() => {
			hideLoading()
		})


	}

	// Get property details
	useEffect(() => {
		Axios.get(`/agents/properties/${property_id}`).then(data => {
			let property = data.data.data

			reset({ ...property, property_category: property.category })
			setDescriptionValue(property.description)
			setPropertyDetails(property)
			setAmenities(property.amenities)
		}).catch(e => {
			errorHandler(e)
		})
	}, [])

	return (
		<div className='relative  '>
			<div className='w-11/12 mx-auto'>
				<div className=''>
					<div className='pt-5 md:flex justify-between items-center'>
						<div>
							<h1 className='text-2xl font-bold'>Edit Property</h1>
							<p className='text-xs'>This page modifies your listings</p>
						</div>

						<button onClick={(e) => {
							let publishStatus = e.target.getAttribute("data-status")
							onPublished(propertyDetails.id, publishStatus)
						}}
							data-status={propertyDetails.published == 0 ? "true" : "false"}
							className={`border-[2px] ${propertyDetails.published == 1 ?
								'border-green-600' :
								'border-red-600'} text-xs px-5 transition py-2 rounded-md 
						 	hover:bg-theme-color hover:text-white mt-3 md:mt-0`}>
							{propertyDetails.published == 1 ? 'Unpublish' : 'Publish'} this property
						</button>

					</div>

					<div className='mt-10'>
						{/* Propeerty nme */}
						<div>
							<h1 className='text-xl md:text-4xl capitalize pb-5'>{propertyName}</h1>
						</div>
						{/* IMAGE */}
						<div className='h-[16rem] md:h-[22rem] rounded-lg relative'>
							<div className='h-full flex space-x-1 relative'>
								<div className='md:w-2/4 overflow-hidden rounded-tl-lg rounded-bl-lg'>
									{(propertyDetails?.images && propertyDetails?.images.length) ? (
										<img src={propertyDetails.images[0].image_path} alt="" className='h-[22rem] w-full object-cover' />)
										:

										<ImageUpload property_id={property_id} getPhoto={true} fn={setPropertyImage} />
									}

								</div>
								<div className='w-2/4 md:flex hidden space-x-1 overflow-hidden rounded-tr-lg rounded-br-lg'>
									<div className='w-2/4 '>
										{(propertyDetails?.images && propertyDetails?.images.length) > 1 ? (
											<img src={propertyDetails.images[1].image_path} alt="" className='h-[22rem] w-full object-cover' />)
											:

											<ImageUpload property_id={property_id} getPhoto={true} fn={setPropertyImage} />
										}
									</div>
									<div className='w-2/4'>
										{(propertyDetails?.images && propertyDetails?.images.length) > 2 ? (
											<img src={propertyDetails.images[2].image_path} alt="" className='h-[22rem] w-full object-cover' />)
											:

											<ImageUpload property_id={property_id} getPhoto={true} fn={setPropertyImage} />
										}
									</div>
								</div>

								<button onClick={() => setShowPhotoManager(true)} className='absolute bottom-4 space-x-3 right-4 flex py-2 px-5  items-center bg-white dark:bg-main-dark-bg border border-black/80 rounded-md'>
									<BsCardImage />
									<p className='font-semibold'><span>{propertyDetails?.images && propertyDetails?.images.length}</span> Photos</p>
								</button>
							</div>

							{showPhotoManager && <>
								<PhotoManager
									property_id={property_id}
									currentUser={currentUser}
									images={propertyDetails.images}
									setFn={setPropertyImage}
									closePhotoManager={setShowPhotoManager} />

							</>}

						</div>


						<form action="" onSubmit={handleSubmit(submitForm)}>
							<div className='flex flex-col md:flex-row gap-5 mt-5'>
								<div className='md:w-3/5'>
									<div className='text-sm space-y-5 px-2'>

										<div>
											<label htmlFor="" className='block'>Name</label>
											<input type="text" {...register('name', { required: "Name of listing must be filled  " })} className='form-input bg-transparent border dark:border-slate-800 w-full' placeholder='Property name'
											/>
											{errors.name && (
												<p className="text-red-400 text-xs">{errors.name.message}</p>
											)}
										</div>

										<div>
											<label htmlFor="" className='block'>Amount</label>
											<input type="number" {...register('amount')} className='form-input bg-transparent border w-full dark:border-slate-800' placeholder='Amount'
											/>
										</div>
										<div>
											<p className='mb-2 text-sm font-[400]'>Description</p>
											<div className='h-[250px] overflow-auto'>
												<ReactQuill theme="snow" value={descriptionValue} onChange={setDescriptionValue} className='h-[200px]' />
												<div className=''></div>

											</div>
										</div>

										<div>
											<h1>States and Lgas</h1>
											<States register={register} className={'bg-transparent'} optState={watch('state')} />
											{errors.state && (
												<p className="text-red-400 text-xs">{errors.state.message}</p>
											)}
											{errors.lga && (
												<p className="text-red-400 text-xs">{errors.lga.message}</p>
											)}
										</div>

										<div>
											<label htmlFor="" className='block'>Address</label>
											<input type="text" {...register('address')} className='form-input bg-transparent border w-full dark:border-slate-800' placeholder='Address'
											/>
										</div>

										<div>
											<label htmlFor="" className='block'>Property category</label>
											<select name="property_category" 
											{...register('category', { required: "Please choose the property category" })} 
											className='form-select bg-transparent border w-full dark:border-slate-800'    >
												<option value="">Choose property type</option>
												<option value="sell">For sell</option>
												<option value="rent">For rent</option>
												<option value="short_let">Short let</option>
												<option value="land">Land</option>
											</select>

											{errors.property_category && (
												<p className="text-red-400 text-xs">{errors.property_category.message}</p>
											)}
										</div>

										<div>
											<label htmlFor="" className='block'>other category</label>
											<select name="other_category" {...register('other_category', { required: "Please choose the property category" })} defaultValue={'any'} className='form-select bg-transparent border w-full dark:border-slate-800'>
												<option value="modern">Modern</option>
												<option value="lux">Luxury</option>
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
												<select name="duration" {...register('duration')} className='form-select bg-transparent border w-full dark:border-slate-800'  >
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
												<input list='property-type' name='property_type' {...register("property_type", { required: "Property type must be filled  " })} type='text' className='form-input bg-transparent border w-full dark:border-slate-800 ' />
												<datalist id='property-type' className='form-select w-full focus:outline-0 focus:border- text-xs text-slate-400'>
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
													<select name="bedrooms" {...register('bedrooms')} className='form-select bg-transparent border w-full dark:border-slate-800'
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
													<select name="bathrooms" {...register('bathrooms')} className='form-select bg-transparent border w-full dark:border-slate-800'    >
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
													<select name="toilets" {...register('toilets')} id="" className='form-select bg-transparent border w-full dark:border-slate-800'    >
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
											{/* <button className='rounded w-full py-2 bg-green-600 text-white uppercase font-semibold text-sm'>
                                            {property_id ? "Update" : "Create"}
                                        </button> */}
											<div className={`fixed bottom-5 right-5 text-sm z-[300]`}>
												<div className='flex items-center gap-3'>
													<button type='submit' className='bg-theme-color text-white py-2 px-4 rounded'>
														Update
													</button>
													<Link to={`/dashboard/property/${property_id}`} className='text-gray-800 bg-gray-300 font-semibold border py-2 rounded px-3'>View</Link>
												</div>
											</div>
										</div>


									</div>


								</div>

								<div className='md:w-2/5'>
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
													className='form-input bg-transparent border w-full dark:border-slate-800 ' />
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
															{...register('property_fact.size')}
															className='form-input bg-transparent border w-full dark:border-slate-800'
															placeholder='Enter property size' />
													</div>
													<div className='w-[40%] flex-1'>
														<input list='unit' name='property_type'
															{...register("property_fact.unit")}
															type='text'
															className='form-input bg-transparent border w-full dark:border-slate-800'
															placeholder='Enter Measurement' />
														<datalist id='unit'
															className='form-select w-full focus:outline-0 focus:border-
														 text-xs text-slate-400'>
															<option className='bg-slate-600 text-gray-300' value="plot" />
															<option className='bg-slate-600 text-gray-300' value="acre" />
															<option className='bg-slate-600 text-gray-300' value="hectare" />
															<option className='bg-slate-600 text-gray-300' value="sq.ft" />
														</datalist>
													</div>
												</div>
											</div>
											{property_category != 'land' && <>
												<div>
													<label htmlFor="">Flooring (tiles,wood,)</label>
													<input type="text"
														{...register('property_fact.flooring')}
														className='form-input bg-transparent border w-full dark:border-slate-800 ' />
												</div>
											</>}
										</div>
									</div>

									{property_category != 'land' && <>
										<div className='mt-5 bg-slate-800 p-1 rounded-[2px] text-slate-200'>
											<h1 className='text-lg font-semibold'>Amenities</h1>
											<p className='text-sm'>Select or add multiple amenities.</p>
											<div className='mt-3'>
												<div className=''>
													<div className='flex flex-wrap items-center gap-2'>

														{amenities?.map((amenitie, i) => {
															return <SelectedContainer key={i} name={amenitie} setValues={setAmenities} />
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

export default EditProperty