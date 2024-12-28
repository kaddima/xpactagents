import React, { useEffect, useState } from 'react'
import Listings from '../components/Listings'
import Axios from '../../utility/axios'
import EmptyState from '../components/EmptyState'

const Favorites = () => {

  const [propertyListing, setPropertyListing] = useState([])

  useEffect(() => {

    Axios.get('/properties/favorites').then(data => {
      setPropertyListing(data.data.data)
    }).catch(e => {
      console.log(e)
    })

  }, [])
  return (
    <div className='h-full w-full overflow-hidden'>
      <div className='mb-2'>
        <h1 className='text-2xl font-bold'>Favorites</h1>
        <p className='text-xs'>All your favorite listings are available here</p>
      </div>
      {propertyListing.length > 0 ? <Listings propertyListing={propertyListing} listState={setPropertyListing} /> : <EmptyState title='Empty Listings' subtitle='You do not have any property or listings present in your favorite catalog.' />}
    </div>
  )
}

export default Favorites