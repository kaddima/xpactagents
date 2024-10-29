import React, { useState,useEffect } from 'react'
import { useParams,Link,useNavigate, NavLink, useLocation } from 'react-router-dom';
import {toast} from 'react-toastify'
import {BsArrowLeft, BsCardImage, BsChevronDown, BsChevronUp} from "react-icons/bs"
import $ from 'jquery'

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { formatDistanceToNow } from 'date-fns';

import PhotoLists from "../components/PhotoLists"
import Tour from '../components/Tour/Tour';
import Axios from '../../utility/axios';
import Question from '../components/question/Question';
import { FaUser, FaUserCircle } from 'react-icons/fa';
import PropertyCard from '../components/PropertyCard';
  

const PropertyDetails = () => {

  // const [propertyDetails,setPropertyDetails] = useState({photos:[]})
  const [propertyDetails,setPropertyDetails] = useState(null)
  const [modelVisible,setModelVisible] = useState(false)
  const [showLess,setShowLess] = useState(false)
  
  const [showPhotoList,setShowPhotoList] = useState(false)

  const navigate = useNavigate()
  const propertyID = useParams().id

  const {hash} = useLocation()

  const UpdateImageState = (photos)=>{

   setPropertyDetails({...propertyDetails, photos:photos})

  }

  const handlePublish = ()=>{

		$('#spinner').fadeIn()

		axios.post('/dashboard/property/user-action',{property_id:propertyID,type:'publish_property'}).then(data=>{

			$('#spinner').fadeOut()

			setPropertyDetails({...propertyDetails, published:data.data.data})
			
		}).catch(e=>{
			$('#spinner').fadeOut()
			console.log(e)
		})
		
	}

  const handleYes = ()=>{

		setModelVisible(false)

		$('#spinner').fadeIn()

		axios.post('/dashboard/property/user-action',{property_id:propertyID,type:'delete-property'}).then(data=>{

			$('#spinner').fadeOut()

    if(data.data.data == 1){

    toast('property deleted successfully', {type:'success'})

			  navigate(`/dashboard/listings`)
    }
	
		}).catch(e=>{
			$('#spinner').fadeOut()
			console.log(e)
		})
		
	}
	const handleNo = ()=>{setModelVisible(false)}

	const handleBtnAction = ()=>{

		setModelVisible(true)

	}

  //scroll function
  useEffect(()=>{
  let target = $(`#property ${hash}`)
  if(hash.length && target.length){
    // animated top scrolling
    $('html, body, #property').animate({
    scrollTop: target.offset().top 
    });
  }
  
  },[hash])

  useEffect(()=>{

  Axios.get('/api/listings/details', {params:{propertyID}}).then(data=>{
    let property = data.data.data

    property = {...property, images:JSON.parse(property.images), 
    property_fact:JSON.parse(property.property_fact),amenities:JSON.parse(property.amenities)}

    //console.log(property)
     setPropertyDetails(property)
  }).catch(e=>{

    console.log(e.response)
  })
  },[propertyID])
   

  if(propertyDetails === null){

  return <div className='w-full h-full bg-white flex items-center justify-center'>
    <h1>Loading...</h1>
  </div>
  }

  return (
  <div className="bg-white relative w-full h-full overflow-x-hidden overflow-y-auto" id='property'>
  <div className='sticky hidden md:block top-[0px] z-30 w-10/12 mx-auto bg-white'>
    <div className='px-5'>
    <div className='flex justify-between items-center'>
    <ul className='flex items-center'>
      <li className='py-[0.75rem] px-[1rem]'>
        <NavLink to={'/app/listings'}>
        <div className='flex items-center space-x-1'>
          <BsArrowLeft/>
          <span>Back</span>
        </div>
        </NavLink>
      </li>
      <li className='py-[0.75rem] px-[1rem]'>
        <NavLink to={`#overview`}>
        Overview
        </NavLink>
      </li>
      <li className='py-[0.75rem] px-[1rem]'>
        <NavLink to="#property-details">
        property details
        </NavLink>
      </li>
      <li className='py-[0.75rem] px-[1rem]'>
        <NavLink to="#tour">
        Tour
        </NavLink>
      </li>
      <li className='py-[0.75rem] px-[1rem]'>
        <NavLink to={`#similar`} >
        Similar
        </NavLink>
      </li>
      </ul>

      <div>
      <NavLink to={`/dashboard/listings/favorite`}>
        Favorite
      </NavLink>
      </div>
    </div> 
    </div>
      
  </div>
  
  <div className='mt-[2px] px-3 md:px-0 md:w-10/12 mx-auto' >
    
    {/* INFOR */}
    <div className='mt-5' id='overview'>
    {/* IMAGE */}
    <div className='h-[16rem] md:h-[22rem] rounded-lg overflow-hidden'>
      <div className='h-full flex space-x-1 relative'>
      <div className='md:w-2/4 overflow-hidden'>
        {propertyDetails.images.length && (
        <img src={`/uploads/users/${propertyDetails.creator_id}/${propertyDetails.images && propertyDetails.images[0]}`} alt="" className='h-[22rem] w-full object-cover'/>) 
        }
        
      </div>
      <div className='w-2/4 hidden md:flex space-x-1'>
        <div className='w-2/4 '>
        {propertyDetails.images.length > 1 && (
          <img src={`/uploads/users/${propertyDetails.creator_id}/${propertyDetails.images && propertyDetails.images[1]}`} alt="" className='h-[22rem] w-full object-cover'/>
          )
        }
        </div>
        <div className='w-2/4'>
        {propertyDetails.images.length > 2 && (
        <img src={`/uploads/users/${propertyDetails.creator_id}/${propertyDetails.images && propertyDetails.images[2]}`} alt="" className='h-[22rem] w-full object-cover'/>)
        
        }
        </div>
      </div>

      <button onClick={()=>setShowPhotoList(true)} className='absolute bottom-4 space-x-3 right-4 flex py-2 px-5  items-center bg-white border border-black/80 rounded-md'>
        <BsCardImage/>
        <p className='font-semibold'><span>{propertyDetails?.images && propertyDetails?.images.length}</span> Photos</p>
      </button>
      </div>
      {showPhotoList && <>
      <PhotoLists 
      property_id={propertyID} 
      propertyDetails={propertyDetails} 
      images={propertyDetails.images} 
      closePhotoManager={setShowPhotoList}/>
      
    </>}
    </div>
    <div className='max-w-[800px]'>
      <div>
      <span className='inline-block w-2 h-2 rounded-full bg-green-600'></span>
      <h1 className='inline-block ml-2 text-sm'>
        {propertyDetails.category != 'land' ? 
        `For ${propertyDetails.category}` : propertyDetails.category} - 
        {propertyDetails.published == 1 ? 'Active' : (<span className='text-red-600 font-semibold pl-1'>Unpublished</span>)} 
        
      </h1>
      </div>

      <div className='mt-5' >
      <div >
        <span className='font-semibold'>{propertyDetails.address}</span>
        
      </div>
      <div className='flex md:flex-row flex-col md:space-x-10 border-b mt-5 pb-5'>
        <div>
        <p className='font-bold text-2xl'>₦{propertyDetails.amount && Number(propertyDetails.amount).toLocaleString()}</p>
        <p>Estimated price</p>
        </div>
        <div className='flex space-x-10 mt-3 md:mt-0'>
        <div>
          <p className='font-bold text-2xl'>{propertyDetails?.bedrooms}</p>
          <p>Beds</p>
        </div>
        <div>
          <p className='font-bold text-2xl'>{propertyDetails?.bathrooms}</p>
          <p>Baths</p>
        </div>
        <div>
          <p className='font-bold text-2xl'>{propertyDetails.property_fact.property_size}</p>
          <p className='capitalize'>{propertyDetails.property_fact.unit}</p>
        </div>
        </div>
      </div>
      </div>

      <div className='mt-10'>
      <h1 className='text-xl font-bold'>About this home</h1>

      <div className='mt-5'>
        <div className={`${!showLess ? "h-[100px]" : "h-auto"} overflow-hidden `} dangerouslySetInnerHTML={{__html:propertyDetails?.description}}>
        
        </div>

        <button className='' onClick={()=>setShowLess(!showLess)}>
          <div className='flex items-center space-x-2'>
          <span className='text-theme-color font-semibold'>Show less</span>
          {showLess ? <BsChevronDown/> :<BsChevronUp/>}
          </div>
        </button>
      </div>
      </div>
    </div>
    

    </div>

    {/* AVAILABLE FOR TOUR */}
    <div className='mt-8 max-w-[400px] border-b pb-5'>
    <div className='flex items-center space-x-5'>
      {/* <h1><TbChartHistogram size={28}/></h1> */}
      <div>
      <h1 className='font-semibold'>This property is available</h1>
      <p>You can currently tour this property</p>
      </div>
    </div>
    <div className='flex mt-3'>
      <p>Today:</p>
      <ul className='ml-2 font-semibold list-inside flex space-x-5 text-sky-800'>
      <li>4:00 pm</li>
      <li>5:00 pm</li>
      <li>6:00 pm</li>
      </ul>
    </div>
    </div>

    {/* Property Facts */}
    <div className='mt-8 max-w-[400px]' id='property-details'>
    <h1 className='text-xl font-bold'>Property facts</h1>
    <div className='mt-5'>
      <div className=''>
      <ul className='flex flex-col space-y-3'>
        {Object.keys(propertyDetails.property_fact).map((key,index)=>{

        return (
          <li key={index} className='flex justify-between items-center border-b pb-3'>
          <p className='capitalize font-semibold text-sm'>{key.replace('_',' ')}</p>

          {key == 'upload_time' ? 
            <p className=''>
            {formatDistanceToNow(new Date(propertyDetails.property_fact[key]),{addSuffix:true})}
            </p> : <p className=''>{propertyDetails.property_fact[key]} {key == 'property_size' ? 'Sq.ft':''}</p>}
          
          </li>
        )
        })}
      </ul>
      </div>
    </div>
    </div>

    {/* Amenities*/}
    {propertyDetails.amenities.length >= 1 && propertyDetails.category != 'land' && propertyDetails?.amenities?.length && <>
    <div className='mt-8 max-w-[400px]' id='property-details'>
      <h1 className='text-xl font-bold'>Amenities</h1>
      <div className='mt-5'>
      <div className=''>
        {propertyDetails.amenities?.map((value,index)=>{

        return (
          <p key={index} className='flex justify-between items-center border-b pb-3'>
          {value.amenities ? value.amenities : ''}
          </p>
        )
        })}
      </div>
      </div>
    </div>
    </>}

    <div className='mt-5'>
    <div className='flex items-center space-x-2'>
      <div className='w-16 h-16 border rounded-full flex items-center justify-center'>
      <FaUserCircle size={32}/>
      </div>
      <p>Listed by <span className='text-sky-800 font-semibold'>{propertyDetails?.agentDetails.first_name} {propertyDetails?.agentDetails.last_name}</span>• XpactAgent Corporation</p>
    
    </div>

    <p className='mt-3'>XpactAgent checked: <span className='text-sky-800 font-semibold'>few minutes ago </span></p>
    </div>
    

    {/* TAKE TOUR */}
    <div className='mt-8 max-w-[450px] overflow-scroll md:overflow-hidden' id='tour'>
      <h1 className='text-xl font-bold'>Take a tour with a buyer’s agent</h1>
      <Tour/>
    </div>

    {/* ASK AGENT QUESTION */}

    <div className='mt-10 max-w-[750px]'>
    <h1 className='text-xl font-bold'>Ask XpactAgent {propertyDetails?.agentDetails.first_name} a question</h1>
    <Question propertyDetails={propertyDetails}/>
    </div>
  </div>

  {/* SIMILAR Homes */}
  <div className='w-10/12 mx-auto mt-10 pb-10 border-b' id='similar'>
    <h1 className='font-bold text-xl'>Similar properties for you</h1>
    <p className='text-xs mt-2'>Homes similar to {propertyDetails?.name ? propertyDetails.name : 'This property'} are shown below.</p>
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-5'>
    {propertyDetails.similar.map((v,i)=>{

      return <Link key={i} onClick={(e)=>{
      e.preventDefault()
      //scroll to the top
      let target = $('#property')

      if(target.length){
        navigate(`/app/property/${v.id}`);
        const pos = $(target).offset().top
        // animated top scrolling
        $('#property').animate({scrollTop: pos});
      }
      }} to={`/app/property/${v.id}`} className='border hover:shadow-lg rounded-md overflow-hidden'>
        <PropertyCard  data={v}/>
      </Link>
    })}
    </div>
  </div>

  
  </div>
  )
}

export default PropertyDetails