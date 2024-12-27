import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PropertyCard from './PropertyCard'
import { hideLoading, showLoading } from '../../utility/loading'
import Axios from '../../utility/axios'

const Listings = ({ propertyListing = [], pagination = false, setProperty = () => { } }) => {
	const [showMore, setShowMore] = useState(pagination)
	const [searchParams, setSearchParams] = useSearchParams()

	let params = useMemo(() => {
		let param = {}

		searchParams.forEach((value, key) => {
			param[key] = value;
		})
		return param

	}, [searchParams])

	const onshowMore = (url) => {
		//parse the url
		let link = new URL(url)
		let path = link.pathname
		let pageParam = link.searchParams.get('page')

		showLoading()

		Axios.get(path, { params: { ...params, page: pageParam } }).then(data => {
			setProperty(prev => {
				return { data: prev.data.concat(data.data.data.data), meta: data.data.data.meta }
			})
		}).catch(e => {

			console.log(e)
		}).finally(() => {
			hideLoading()
		})

	}

	useEffect(() => {
		setShowMore(pagination)
	}, [pagination])

	return (
		<div className='w-full'>
			<div className='grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mt-5'>
				{propertyListing?.map((v, i) => {

					return (
						<Link key={i} to={`/app/property/${v.id}`} className='hover:shadow-lg border dark:border-slate-800 rounded-xl overflow-hidden'>
							<PropertyCard key={i} data={v} />
						</Link>
					)
				})}
			</div>
			{showMore?.nextPageUrl && <div className='mt-5 mb-3'>
				<h1 className='text-center mb-3 font-semibold'>Continue exploring our listings</h1>
				<button onClick={() => onshowMore(showMore?.nextPageUrl)} className='block max-w-[150px] bg-black text-white text-sm font-semibold mx-auto px-5 py-2 rounded border border-black'>Show more</button>
			</div>}

		</div>
	)
}

export default Listings