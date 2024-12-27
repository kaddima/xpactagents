import React, { useEffect, useState } from 'react'
import Listings from '../components/Listings'
import Axios from '../../utility/axios'
import EmptyState from '../components/EmptyState'

const ListingsPage = () => {
  const [propertyListing, setPropertyListing] = useState({ data: [], meta: {} })

  useEffect(() => {
    Axios.get(`/agents/properties`).then(data => {
      setPropertyListing(data.data.data)

    }).catch(e => {
      console.log(e)
    })

  }, [])

  if (!propertyListing?.data.length) {
    return <EmptyState title='Empty Listings' subtitle='You do not have any property or listings present in your catalog.' />
  }

  return (
    <div className='h-full w-full overflow-hidden'>
      <div className='mb-2 px-3 md:px-0   md:bg-transparent py-2'>
        <h1 className='text-2xl font-bold'>Listings</h1>
        <p className='text-xs'>All your listings are available here</p>
      </div>
      <Listings propertyListing={propertyListing.data}
        pagination={propertyListing.meta}
        setProperty={setPropertyListing}
        listState={setPropertyListing} />
    </div>
  )
}

export default ListingsPage