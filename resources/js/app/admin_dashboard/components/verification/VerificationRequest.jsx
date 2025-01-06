import React, { useEffect, useState } from 'react'
import { parseISO, format } from 'date-fns'
import { MdBlock, MdOutlineSkipPrevious, MdSkipNext } from 'react-icons/md'
import { hideLoading, showLoading } from '../../../utility/loading'
import Axios from '../../../utility/axios'
import VerificationDetails from './VerificationDetails'
import errorHandler from '../../../utility/errorHandler'


const TableRow = ({ data,setDetailsModal }) => {

	const onDetails = () => {
		setDetailsModal(prev => {
			return { open: true, data: data }
		})
	}

	return <tr>
		<td className='text-sm border-b dark:border-b-slate-800 py-3'>
			<div className='flex items-center gap-2'>
				<div className='w-8 h-8 bg-purple-900 text-white font-bold uppercase flex items-center justify-center text-lg'>
					{data.fullname ? data.fullname[0] : '-'}
				</div>
				<p>{data.fullname ? `${data.fullname}` : '-'}</p>
			</div>
		</td>
		<td className='text-sm border-b dark:border-b-slate-800'>{data.doc_type}</td>
		<td className='text-sm border-b dark:border-b-slate-800'>{data.created_at && format(parseISO(data.created_at), 'dd MMM Y')}</td>
		<td className='border-b dark:border-b-slate-800'>
			<button className='text-sky-600' title='More details' onClick={onDetails}>
				Details
			</button>

		</td>
	</tr>
}

const VerificationRequest = () => {

	const [usersDetails, setUsersDetails] = useState({ data: [], meta:{} })
	const [detailsModal, setDetailsModal] = useState({ open: false, data: null })

	const onshowMore = (url) => {

		//parse the url
		let link = new URL(url)
		let path = link.pathname
		let pageParam = link.searchParams.get('page')

		showLoading()

		Axios.get(path, { params: { page: pageParam } }).then(data => {
			setUsersDetails(data.data.data)
		}).catch(e => {
			errorHandler(e)
		}).finally(() => {

			hideLoading()
		})

	}

	useEffect(() => {
		Axios.get('/admin/users/verification-request').then(data => {
			setUsersDetails(data.data.data)
		}).catch(e => {
			errorHandler(e)
		})
	}, [])


	if (!usersDetails?.data.length) {

		return <div className='h-full flex flex-col items-center justify-center dark:bg-slate-900 bg-neutral-100'>
			<div className='text-center text-sm'>
				<h1 className='font-bold text-xl'>Empty verification request</h1>
				<p>No user request for verification badge at the moment</p>
			</div>
		</div>
	}

	return (
		<div className='p-3 dark:bg-slate-900 bg-neutral-100'>
			<div>
				<div>
					<h1 className='text-lg font-bold'>Verification Requests</h1>
					<p className='text-xs font-semibold leading-none'>
						This is the table of users currently requesting for a verification badge</p>
				</div>
				<div className='mt-5 overflow-x-scroll'>
					<table className='w-full table-auto text-black dark:text-slate-400'>
						<thead>
							<tr>
								<th className='text-left font-semibold text-sm'>Fullname</th>
								<th className='text-left font-semibold text-sm'>doc_type</th>
								<th className='text-left font-semibold text-sm'>Date</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{usersDetails && usersDetails?.data.map((v, i) => {
								return <TableRow key={i} 
								setUsersDetails={setUsersDetails} 
								data={v} 
								setDetailsModal={setDetailsModal} />
							})}
						</tbody>
					</table>
					{usersDetails.meta?.total > 0 && (
						<div className="flex gap-1 items-center float-right">
							<button
								onClick={() => onshowMore(usersDetails.meta.prevPageUrl)}
								disabled={!usersDetails.meta.prevPageUrl}
								className={usersDetails.meta.prevPageUrl ? 'inline-block' : 'hidden'}>
								<MdOutlineSkipPrevious />
							</button>
							{Array.from({ length: usersDetails.meta.lastPage }, (_, index) => (
								<button
									key={index + 1}
									onClick={() => onshowMore(usersDetails.meta.nextPageUrl.replace(/(page)=\d+/, `$1=${index + 1}`))}
									className={`${usersDetails.meta.currentPage == index + 1 ? 'border-b border-b-sky-800' : ''
										}`}>
									{index + 1}
								</button>
							))}
							<button
								onClick={() => onshowMore(usersDetails.meta.nextPageUrl)}
								disabled={!usersDetails.meta.nextPageUrl}
								className={usersDetails.meta.nextPageUrl ? 'inline-block' : 'hidden'}>
								<MdSkipNext />
							</button>
						</div>
					)}
				</div>
			</div>
			{detailsModal.open && 
			<VerificationDetails details={detailsModal.data} setDetailsModal={setDetailsModal} />}

		</div>
	)

}

export default VerificationRequest