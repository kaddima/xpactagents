import React, { useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import ImageUpload from './ImageUpload'
import { BsTrash } from 'react-icons/bs'
import $ from 'jquery'
import { toast } from 'react-toastify'
import Axios from '../../utility/axios'
import errorHandler from '../../utility/errorHandler'

const PhotoManager = ({ property_id, images = [],
	setFn, closePhotoManager }) => {


	const deleteImage = (image) => {
		$('#spinner').fadeIn()

		const data = { property_id, image_ids: [image.id] }
		Axios.delete(`/properties/${property_id}/images`, { data }).then((data) => {
			toast('Photo deleted', { type: 'success' })
			// Filter out the image that matches the one to delete
			let newImages = images.filter((v) => v.id != image.id);
			setFn(newImages)
		}).catch((e) => {
			errorHandler(e)
		}).finally(() => {

			//display spinner
			$('#spinner').fadeOut()
		})
	}

	return (
		<div className='fixed z-[900] inset-0 w-screen h-screen bg-black/20 md:py-8'>
			<div className='md:w-11/12 h-full mx-auto bg-white dark:bg-slate-900 rounded md:rounded-2xl overflow-hidden pb-7'>
				<header className='border-b px-7 pt-5 h-16'>
					<div className='flex items-center justify-between'>
						<h1 className='text-lg font-semibold'>Photos({images.length})</h1>
						<MdClose size={24} onClick={() => { closePhotoManager(prev => !prev) }} className='cursor-pointer' />
					</div>
				</header>

				<div className='md:flex gap-3 w-full pt-7 px-3 md:px-7 h-[calc(100%-64px)] overflow-scroll'>
					<div className='max-w-[250px] space-y-2'>
						<p>Upload new image</p>
						{/* <ImageUpload property_id={property_id} getPhoto={true} fn={setFn}/> */}
						<ImageUpload property_id={property_id} getPhoto={true} fn={setFn} />
					</div>
					<div className='flex-1 mt-5 md:mt-0'>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2'>
							{images && images.length > 0 && images.map((v, i) => {
								return (
									<div key={i} className='w-full relative'>
										<img src={v.image_path} alt="" className='rounded w-full h-[220px] object-cover' />

										<button type='button' onClick={() => deleteImage(v)} className='absolute bg-slate-100/60 rounded text-red-600 p-2 cursor-pointer right-0 top-0'>
											<BsTrash size={18} />
										</button>

									</div>
								)
							})}
						</div>

					</div>
				</div>
			</div>
		</div>
	)
}

export default PhotoManager