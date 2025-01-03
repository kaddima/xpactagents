import React, { useEffect, useState } from 'react'
import Listings from '../components/Listings'
import Categories from "../components/Categories"
import Axios from '../../utility/axios'
import { useSearchParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import errorHandler from '../../utility/errorHandler'

const ListingsPage = () => {

  const [propertyListing, setPropertyListing] = useState({ data: [], meta: {} })
  const [searchParams, setParams] = useSearchParams()

  useEffect(() => {

    const other_category = searchParams.get('other-category')
    Axios.get('/properties',
      {
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
    <div className='h-full w-full px-5 pb-5 pt-3 overflow-scroll'>
      <div className='sticky top-[-1em]   z-[10]'>
        <Categories />
      </div>

      {!propertyListing?.data.length ? <EmptyState title='Empty Listing' subtitle='No listings present in this category' /> :
        <Listings propertyListing={propertyListing.data} setProperty={setPropertyListing} pagination={propertyListing.meta} />
      }


    </div>
  )
}

export default ListingsPage