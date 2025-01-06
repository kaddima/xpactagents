import React from 'react'
import {
	MdEditLocation, MdEmail,
	MdOutlineLocationOn,
	MdOutlineUploadFile, MdSignalWifiStatusbar4Bar, MdVerified
} from "react-icons/md"
import { FaHouseUser, FaLocationArrow, FaWhatsapp } from 'react-icons/fa'
import { BsTelephoneFill } from 'react-icons/bs'
import EmptyState from '../../components/EmptyState'
import { formatDistance } from 'date-fns'
import { format } from 'date-fns'
import { useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Axios from '../../../utility/axios'
import errorHandler from '../../../utility/errorHandler'

const AgentProfile = () => {

	const [userDetails, setUserDetails] = useState()
	const user_id = useParams().id


	useEffect(() => {
		Axios.get(`/admin/users/${user_id}`).then(data => {
			setUserDetails(data.data.data)
		}).catch(e => {	
			errorHandler(e)
		})
	}, [])


	return (
		<div className='h-full text-sm p-5 overflow-scroll'>
			<h1 className='font-bold mb-5 text-2xl'>User Profile</h1>

			{userDetails?.profile_complete == 1 ? (<div className=''>
				<div className='md:w-3/5'>
					<div>
						{userDetails?.photo ?
							(<div>
								<img src={userDetails.photo} alt="" className='h-[22rem] w-full object-cover' />
							</div>) :
							(<div className='border border-dashed dark:border-slate-600 p-3 rounded'>
								<div className='font-bold'>
									<h1>Agent has no image</h1>
									<p className='text-sm font-normal text-sky-600'>The agents image shows here if they upload one</p>
								</div>
							</div>)}
					</div>

					<div className='space-y-4 text-gray-500 mt-4 pl-4 pr-2'>
						<div className='border-b pb-3'>
							<div className='flex items-center space-x-2'>
								<h1 className='text-2xl font-semibold'>{userDetails.first_name}
									{userDetails.middle_name ? userDetails.middle_name : ''} {userDetails.last_name}</h1>
								{userDetails.id_verified == 1 ? <MdVerified size={24} className='text-sky-600' /> : null}
							</div>
							<div className='flex items-center space-x-1 -mt-1 font-semibold'>
								<span><MdOutlineLocationOn /></span>
								<span>{userDetails.state}, Nigeria</span>
							</div>

							<div className='flex items-center mt-2'>
								<h1><MdOutlineUploadFile className="inline-block mt-[-2px]" /> Registered: </h1>
								<p className='pl-3 font-semibold'>{formatDistance(new Date(userDetails.created_at), new Date(), { addSuffix: true })}</p>
							</div>

							<div className='flex items-center mt-2'>
								<h1><MdOutlineUploadFile className="inline-block mt-[-2px]" />Last seen: </h1>
								<p className='pl-3 font-semibold'>{formatDistance(new Date(userDetails.last_seen), new Date(), { addSuffix: true })}</p>
							</div>

						</div>
						<div className='flex items-center justify-between'>
							<span className='font-semibold'><MdSignalWifiStatusbar4Bar className='inline-block' /> Account status:</span>
							<span className='inline-block px-2 border border-green-500 text-green-800 rounded-xl'>Active</span>
						</div>


						<div className='pt-2'>
							<p className='uppercase font-bold text-sm '>Contact information</p>

							<div className='mt-4 space-y-2   font-bold'>
								<div className='flex'>
									<span className='w-32'><BsTelephoneFill className='inline-block' /> Phone</span>
									<span className=' font-semibold'>{userDetails.phone}</span>
								</div>
								<div className='flex'>
									<span className='w-32'><FaWhatsapp className='inline-block' /> Whatsapp</span>
									<span className=' font-semibold'>{userDetails.whatsapp ? userDetails.whatsapp : '-'}</span>
								</div>
								<div className='flex'>
									<span className='w-32'><MdEditLocation className='inline-block' /> Address</span>
									<span className=' font-semibold'>{userDetails.address}</span>
								</div>
								<div className='flex'>
									<span className='w-32'><MdEmail className='inline-block' /> Email</span>
									<span className=' font-semibold'>{userDetails.email}</span>
								</div>
								<div className='flex'>
									<span className='w-32'><FaLocationArrow className='inline-block' /> State/Lga</span>
									<span className=' font-semibold'>{userDetails.state}/{userDetails.lga ? userDetails.lga : '-'}</span>
								</div>

							</div>
						</div>

						<div>
							<p className='uppercase font-bold text-sm '>Basic Information</p>
							<div className='mt-3 space-y-3    font-bold'>
								<div className='flex'>
									<span className='w-32'>Birthday</span>
									<span className=' font-semibold'>{userDetails.dob ? format(new Date(userDetails.dob), 'dd MMM, y') : '-'}</span>
								</div>
								<div className='flex'>
									<span className='w-32'>Gender</span>
									<span className=' font-semibold'>{userDetails.gender}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>) : <>
				<EmptyState title='Uncomplete Registration' subtitle="This user haven't completed their registration."
					showReset={false}
				/>
			</>}

		</div>
	)
}

export default AgentProfile