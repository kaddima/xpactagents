import React from 'react'
import { MdApartment, MdOutlinePublishedWithChanges, MdOutlineUnpublished, MdVerifiedUser } from "react-icons/md"
import { Link, button } from 'react-router-dom'
import { FaBed, FaBath, FaToilet, FaEdit, FaTrash, FaHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Axios from '../../utility/axios'
import { hideLoading, showLoading } from '../../utility/loading'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { useMemo } from 'react'
import { updateFavorites, updateProfile } from '../store/userSlice'


const PropertyCard = ({ data: v, listState = false }) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const currentUser = useSelector(state => state.user.profile)

	let favorites = useSelector(state => state.user.favorites)

	const isFavorite = useMemo(() => {
		if (favorites && favorites.length) {

			for (let i = 0; i < favorites.length; i++) {
				if (favorites[i].id == v.id) {
					return true
				}
			}
			return false
		}
	}, [favorites])

	const onDelete = (property_id) => {
		if (window.confirm("Delete this listing?")) {
			showLoading()

			Axios.delete(`/properties/${property_id}`).then(data => {
				toast('Property deleted', { type: 'success' })

				if (listState !== false) {
					listState(prev => {

						let data = prev.data
						data = data.filter((v, i) => {
							return v.id !== property_id
						})
						return { ...prev, data: data }
					})
				}
			}).catch(e => {
				errorHandler(e)
			}).finally(() => {
				hideLoading()
			})
		}
	}

	const onFavorite = (property_id, type) => {
		const method = type === "add" ? 'post' : 'delete'; // Determine whether it's a POST or DELETE request
		const url = `/properties/${property_id}/favorite`;

		showLoading();

		Axios({ method, url })  // Use dynamic method (POST or DELETE) here
			.then(data => {
				dispatch(updateFavorites(data.data.data));
			})
			.catch(e => {
				errorHandler(e)
			})
			.finally(() => {
				hideLoading();
			});
	};

	return (
		<div className="max-h-[400px] relative">

			{v.published == 0 && <div className='absolute top-5 left-2 px-1 bg-theme-color
			 rounded text-white text-[10px] uppercase font-bold'>
				this property is not pulished
			</div>}

			<div className='absolute top-5 right-2 bg-black/50 rounded-lg p-1'
				data-type={isFavorite ? "remove" : "add"}
				onClick={(e) => {
					let type = e.currentTarget.getAttribute("data-type")
					onFavorite(v.id, type)
				}}>
				<FaHeart size={24} className={`${isFavorite ? 'text-pink-400' : 'text-white'} transition`} />
			</div>

			<div className='h-[200px]'>
				<img src={v.images} alt="" className="w-full h-full object-cover" />
			</div>
			<div className="px-3 ">
				<div className='border-b dark:border-b-slate-800 py-2'>
					<div className="flex space-x-2 items-center">
						<div className="w-2 h-2 rounded-full bg-theme-color"></div>
						<span className="text-xs">{v?.category.replace('_', ' ')}</span>
					</div>

					<p className="font-semibold text-xl">
						₦{v.amount ? parseFloat(v?.amount).toLocaleString() : '-'}
						{(v?.category == 'rent' || v?.category == 'short_let')
							? `/${v.duration ? v?.duration : '-'}` : ''}</p>

					<div className='flex items-center'>
						{v?.category !== 'land' && (
							<div className="text-sm font-[400] flex space-x-2 mr-3">
								<div className='flex items-center space-x-1'>
									<FaBed size={16} />
									<span>{v?.bedrooms}</span>
								</div>
								<div className=' flex items-center space-x-2'>
									<FaBath size={16} />
									<span>{v?.bathrooms}</span>
								</div>
								<div className='flex items-center space-x-2'>
									<FaToilet size={16} />
									<span> {v?.toilets}</span>
								</div>
							</div>)}
						<div className=''>
							<span className='inline-block font-semibold'>
								{v.property_fact && parseFloat(v.property_fact.property_size).toLocaleString()}
								{v.property_fact &&
									(parseFloat(v.property_fact.property_size) > 1 && v.property_fact.unit != 'sq.ft')
									? v.property_fact.unit + 's'
									: v.property_fact.unit}
							</span>
						</div>
					</div>
					<p className="text-sm mt-1">{v?.address}</p>

					{v.category != 'land' && <>
						<div className='flex items-center text-xs mt-2'>
							<MdApartment />
							<span>{v.property_type} </span>
						</div>
					</>}
				</div>
			</div>

			<div className='mt-auto'>
				<div className='flex justify-end space-x-2 md:space-x-4 items-start'>
					<button onClick={() => navigate(`/admin/listings/${v?.id}`)}
						className='text-sm text-[#d92228] p-2 rounded-md hover:bg-slate-200'>
						View
					</button>
					<button onClick={() => navigate(`/admin/listings/${v?.id}/edit`)}
						className='p-2 rounded-md hover:bg-slate-200'>
						<FaEdit />
					</button>
					<button onClick={(e) => { e.stopPropagation(); onDelete(v.id) }}
						className='p-2 rounded-md hover:bg-slate-200'>
						<FaTrash />
					</button>
				</div>
			</div>
		</div>
	)
}

export default PropertyCard