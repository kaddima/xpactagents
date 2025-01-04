import React, { useState, useEffect } from 'react'
import { FaUpload } from 'react-icons/fa'
import { toast } from 'react-toastify'
import $ from 'jquery'
import Axios from '../../utility/axios';
import { hideLoading, showLoading } from '../../utility/loading';

const ImageUpload = ({ uploadType = "property", property_id = null, getPhoto = false, fn }) => {

	const [image, setImage] = useState(null);

	const uploadImage = (e) => {
		e.preventDefault()
		//display spinner
		showLoading()

		let url
		let reader = new FileReader();

		reader.readAsDataURL(image)
		reader.addEventListener('load', (e) => {
			let img = document.createElement('img')

			img.src = e.target.result

			img.onload = (e) => {
				const MAX_WIDTH = 800;
				const MAX_HEIGHT = 600;

				let quality = .9

				let width = img.width
				let height = img.height;

				//change the resizing logic
				if (width > height) {
					if (width > MAX_WIDTH) {
						height = height * (MAX_WIDTH / width);
						width = MAX_WIDTH;

						quality = .99
					}
				} else {
					if (height > MAX_HEIGHT) {
						width = width * (MAX_HEIGHT / height);
						height = MAX_HEIGHT
						quality = .99
					}
				}

				//dynamically create a canvas element
				let canvas = document.createElement('canvas')
				canvas.width = width
				canvas.height = height

				let ctx = canvas.getContext('2d')

				ctx.drawImage(img, 0, 0, width, height)

				//show resized image in preview element
				// let dataUrl = canvas.toDataURL(imageFile)

				// document.getElementById('preview').src = dataUrl
				canvas.toBlob((blob) => {

					let formdata = new FormData()
					formdata.append('image', blob)
					formdata.append('upload_type', uploadType)
					formdata.append('file_name', image.name)

					if (uploadType == 'property') {
						url = `/properties/${property_id}/images`
						formdata.append('property_id', property_id)
						formdata.append('get_photo', getPhoto ? 1 : 0)
					} else {
						url = "/users/image"
					}
					Axios({
						method: 'post',
						url,
						data: formdata,
						headers: { 'Content-Type': 'multipart/form-data' }
					}).then(data => {
						$('#spinner').fadeOut()

						if (data.data.status != 1) {
							toast(data.data.error, { type: 'error' })
							return false
						}

						toast('Image uploaded', { type: 'success' })

						if (getPhoto) {
							fn(data.data.data)
						}
					}).catch(e => {
						errorHandler(e)
					}).finally(() => {
						hideLoading()
					})

				}, 'image/jpeg', quality)
			}
		})
	}
	
	return (
		<div className='w-full'>
			<div className='w-full md:min-h-[150px] max-h-[220px] rounded-lg bg-gray-200 dark:bg-slate-900 overflow-hidden relative'>
				<img src={image && URL.createObjectURL(image)} alt="" className='w-full md:min-h-[150px] max-h-[220px] object-cover' />
				{image !== null && (<div className='w-10 h-10 rounded-full overflow-hidden bg-theme-color absolute bottom-1 right-0'>
					<button className='text-white w-full h-full flex justify-center items-center ' onClick={uploadImage}><FaUpload /></button>
				</div>)}
			</div>
			<div className='mt-2 border dark:border-slate-800 overflow-hidden w-full'>
				<input id='property_image' className='w-full overflow-hidden' type="file" onChange={(e) => {
					setImage(e.target.files[0])
				}} />
			</div>
		</div>
	)
}

export default ImageUpload