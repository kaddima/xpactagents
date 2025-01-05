
import { parseISO, format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { BsTrash } from 'react-icons/bs'
import { FaLockOpen } from 'react-icons/fa'
import { MdBlock, MdOutlineSkipPrevious, MdSkipNext } from 'react-icons/md'
import { hideLoading, showLoading } from '../../../utility/loading'
import { toast } from 'react-toastify'
import SearchBox from '../../components/SearchBox'
import Axios from '../../../utility/axios'
import errorHandler from '../../../utility/errorHandler'
import { useLocation } from 'react-router-dom'

const TableRow = ({ data, setUsersDetails }) => {
	const onDelete = () => {
		if (window.confirm('Delete the user?')) {
			showLoading()

			Axios.post('/users/delete', { user_id: data.id }).then(result => {
				toast('User deleted', { type: 'success' })
				setUsersDetails(prev => {
					let newUsers = prev.data.filter((v, i) => {
						return data.id != v.id
					})
					return { ...prev, data: newUsers }
				})

			}).catch(e => {
				errorHandler(e)
			}).finally(() => {
				hideLoading()
			})
		}

	}

	const onBlock = () => {
		showLoading()
		Axios.post('/users/block', { user_id: data.id }).then(result => {
			setUsersDetails(prev => {
				let users = { ...prev }

				for (let user of users.data) {

					if (user.id == data.id) {

						let is_blocked = user.block

						if (is_blocked == 0) {
							is_blocked = 1
						} else {
							is_blocked = 0
						}
						user.block = is_blocked
						break
					}
				}
				return users
			})

		}).catch(e => {
			errorHandler(e)
		}).finally(() => {
			hideLoading()
		})
	}


	return <tr>
		<td className='text-sm border-b dark:border-b-slate-800 py-3'>
			<div className='flex items-center gap-2'>
				<div className='w-8 h-8 bg-purple-900 text-white font-bold uppercase flex items-center justify-center text-lg'>
					{data.first_name ? data.first_name[0] : '-'}
				</div>
				<p>{data.first_name ? `${data.first_name} ${data.last_name}` : '-'}</p>
			</div>
		</td>
		<td className='text-sm border-b dark:border-b-slate-800'>{data.email}</td>
		<td className='border-b text-sm dark:border-b-slate-800'>{data.phone}</td>
		<td className='text-sm border-b dark:border-b-slate-800'>{data.created_at && format(parseISO(data.created_at), 'dd MMM Y')}</td>
		<td className='border-b dark:border-b-slate-800'>
			<div className='space-x-2'>
				<button className='text-red-600' title='Block user' onClick={onBlock}>
					{data.block == 1 ? <FaLockOpen size={18} className='text-sky-600' /> : <MdBlock size={18} />}

				</button>
				<button className='text-red-600' title='Delete user' onClick={onDelete}>
					<BsTrash size={18} />
				</button>
			</div>
		</td>
	</tr>
}

const RegularUser = () => {
	const [usersDetails, setUsersDetails] = useState({ data: [], meta: {} })
	const location = useLocation();

	const getSearchParams = () => {
		const searchParams = new URLSearchParams(location.search);
		let params = {};
		searchParams.forEach((value, key) => {
			params[key] = value;
		});
		return params;
	};

	const onshowMore = (url) => {
		//parse the url
		let link = new URL(url)
		let path = link.pathname
		// Grab all search parameters dynamically
		const params = getSearchParams();
		let page = link.searchParams.get("page");
		showLoading()

		Axios.get(path, { params: { page, type:"user", ...params } }).then(data => {
			setUsersDetails(data.data.data)
		}).catch(e => {
			errorHandler(e)
		}).finally(() => {
			hideLoading()
		})
	}

	useEffect(() => {
		Axios.get('/admin/users', {params:{type:"user"}}).then(data => {
			let users = data.data.data
			setUsersDetails(users)
		}).catch(e => {
			errorHandler(e)
		})
	}, [])

	return (
		<div className='h-full p-3'>
			<div>
				<div>
					<h1 className='text-lg font-bold'>Users</h1>
					<p className='text-xs font-semibold leading-none'>This is the full list of all regular users on the application</p>
				</div>
				<div className='md:flex justify-between mt-5'>
					<div></div>
					<div className='w-full md:w-3/5'>
						<SearchBox type={'user'} statefn={setUsersDetails} />
					</div>
				</div>
				{(!usersDetails?.data.length) ?
					<div className='h-full flex flex-col items-center justify-center'>
						<div className='text-center text-sm'>
							<h1 className='font-bold text-xl'>Empty Users</h1>
							<p>You current do not have any users</p>
						</div>
					</div>
					:
					<div className='mt-5 overflow-x-scroll'>
						<table className='w-full table-auto text-black dark:text-slate-400'>
							<thead>
								<tr>
									<th className='text-left font-semibold text-sm'>Fullname</th>
									<th className='text-left font-semibold text-sm'>Email</th>
									<th className='text-left font-semibold text-sm'>Phone</th>
									<th className='text-left font-semibold text-sm'>Date</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{usersDetails && usersDetails?.data.map((v, i) => {
									return <TableRow key={i} setUsersDetails={setUsersDetails} data={v} />
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
				}

			</div>
		</div>
	)
}

export default RegularUser