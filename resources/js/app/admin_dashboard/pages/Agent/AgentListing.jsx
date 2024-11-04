import React,{useEffect,useState} from 'react'
import Listings from '../../components/Listings'
import Axios from '../../../utility/axios'
import EmptyState from '../../components/EmptyState'
import { useParams, useSearchParams } from 'react-router-dom'
import qs from "query-string"

const AgentListing = () => {
 
	const [propertyListing,setPropertyListing] = useState()
   	const agent_id = useParams().id
	const [searchParams,setSearchParams] = useSearchParams()
	 
	useEffect(()=>{

		let params = qs.parse(searchParams.toString())

		Axios.get('/admin/agent/listings',{params:{agent_id, ...params}}).then(data=>{
			setPropertyListing(data.data.data)

		}).catch(e=>{

			console.log(e)
		})

	},[searchParams])

	if(!propertyListing?.data.length){

	return <EmptyState title='Empty Listings' subtitle='You do not have any property or listings present in your catalog.'/>
	}
	  
  return (
	<div className='h-full w-full overflow-scroll  '>
		{/* {propertyListing?.data.length > 0 ? 
		  <Listings propertyListing={propertyListing.data} 
		  pagination={propertyListing} 
		  setProperty={setPropertyListing} 
		  listState={setPropertyListing}/> :
		  
		  <EmptyState title='Empty Listings' subtitle='You do not have any property or listings present in your catalog.'/>}   */}
		<Listings propertyListing={propertyListing.data} 
		  pagination={propertyListing} 
		  setProperty={setPropertyListing} 
		  listState={setPropertyListing}
		  moreParams={{agent_id}}/>  
	</div>
  )
}

export default AgentListing