import React, { useEffect, useState } from 'react'
import Listings from '../components/Listings'
import Axios from '../../utility/axios'
import EmptyState from '../components/EmptyState'
import Categories from '../../main/components/Categories'
import { useSearchParams } from 'react-router-dom'
import qs from 'query-string'
import errorHandler from '../../utility/errorHandler'

const ListingsPage = () => {

	const [propertyListing, setPropertyListing] = useState({ data: [], meta: {} })
	const [searchParams, setSearchParams] = useSearchParams()

	useEffect(() => {

		const other_category = searchParams.get('other-category')
		Axios.get('/admin/properties', {
			// only pass in the other_category value if its not "any"
			params: other_category && other_category.toLocaleLowerCase() !== "any" ?
				{ 'other_category': other_category } : {}
		}).then(data => {
			setPropertyListing(data.data.data)
		}).catch(e => {
			errorHandler(e)
		})

	}, [searchParams])

	return (
		<div className='h-full w-full overflow-scroll relative  '>
			<div className='sticky top-[-5px] z-[10] my-[4px] items-center rounded-xl bg-white dark:bg-main-dark-bg'>
				<div className='overflow-x-scroll px-3'>
					<Categories />
				</div>
			</div>

			<div className='pb-5'>
				{propertyListing?.data.length > 0 ?
					<Listings propertyListing={propertyListing.data}
						pagination={propertyListing.meta}
						setProperty={setPropertyListing}
						listState={setPropertyListing} /> :

					<EmptyState title='Empty Listings' subtitle='You do not have any property or listings present in your catalog.' />}
			</div>
		</div>
	)
}

export default ListingsPage