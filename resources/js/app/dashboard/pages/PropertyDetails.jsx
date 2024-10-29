import React, { useState,useEffect } from 'react'
import { useParams,useNavigate, NavLink,useLocation} from 'react-router-dom';
import {toast} from 'react-toastify'
import $ from "jquery"
import { formatDistanceToNow } from 'date-fns';
import {FaRegEdit} from "react-icons/fa"
import {BsArrowLeft, BsCardImage, BsChevronDown, BsChevronUp} from "react-icons/bs"
import { ImageUpload} from '../components';


import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useSelector } from 'react-redux';
import PhotoManager from '../components/PhotoManager';
import Axios from '../../utility/axios';


const PropertyDetails = () => {

  // const [propertyDetails,setPropertyDetails] = useState({photos:[]})
  const currentUser = useSelector(state=>state.user.profile)
  const [propertyDetails,setPropertyDetails] = useState(null)
  const [modelVisible,setModelVisible] = useState(false)
  const [showLess,setShowLess] = useState(false)
  const [showPhotoManager,setShowPhotoManager] = useState(false)

  const navigate = useNavigate()
  const propertyID = useParams().id

  const location = useLocation().hash

  const handlePublish = ()=>{

		$('#spinner').fadeIn()

		Axios.post('/dashboard/property/user-action',{property_id:propertyID,type:'publish_property'}).then(data=>{

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

		Axios.post('/dashboard/property/user-action',{property_id:propertyID,type:'delete-property'}).then(data=>{

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


  // Update property image
  const setPropertyImage = (image)=>{

  setPropertyDetails(prev=>{

    return {...prev, images:image}
  })
  }

  //scroll function
  useEffect(()=>{

  let target = $(location)
  if(location.length && target.length){

    const pos = $(target).offset().top
    // animated top scrolling
    $('#property').animate({scrollTop: pos});
  }
   
  },[location])

  // Get property details
  useEffect(()=>{

  console.log(currentUser)

  Axios.post('/dashboard/property-details', {propertyID}).then(data=>{
    let property = data.data.data

    property = {...property, images:JSON.parse(property.images), 
    property_fact:JSON.parse(property.property_fact),amenities:JSON.parse(property.amenities)}

    //console.log(property)
    setPropertyDetails(property)
  }).catch(e=>{

    console.log(e.response)
  })
  },[])

   

  if(propertyDetails === null){

  return <div className='w-full h-full bg-white flex items-center justify-center'>
    <h1>Loading...</h1>
  </div>
  }

  return (
  <div className="bg-white relative w-full h-full overflow-auto" id='property'>
  <div className='fixed bottom-3 right-3 bg-sky-800 text-white font-[400] rounded'>
    <NavLink to={`/dashboard/property/${propertyID}/edit`} className='px-7 py-2 cursor-pointer inline-block'>
    <FaRegEdit size={18} className='inline-block mt-[-5px]'/>
    <span className='inline-block'>Edit</span>
    </NavLink>
  </div>
  <div className='hidden md:sticky top-[0px] z-50 w-10/12 mx-auto bg-white'>
    <div className='px-5'>
    <div className='flex justify-between items-center'>
      <ul className='flex items-center'>
      <li className='py-[0.75rem] px-[1rem]'>
        <NavLink to={'/dashboard/listings'}>
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

  <div className='mt-[2px] md:w-10/12 mx-auto px-3 md:px-0'>
    {/* IMAGE */}
    <div className='h-[16rem] md:h-[22rem] rounded-lg'>
    <div className='h-full flex md:flex-row flex-col space-x-1 relative'>
      <div className='md:w-2/4 overflow-hidden'>
      {propertyDetails.images.length ? (
        <img src={`/uploads/users/${propertyDetails?.creator_id}/${propertyDetails.images && propertyDetails.images[0]}`} alt="" className='h-[22rem] w-full object-cover'/>)
        :

        <ImageUpload property_id={propertyDetails.id}/>
      }
      
      </div>
      <div className='md:w-2/4 md:flex space-x-1 hidden'>
      <div className='w-2/4 '>
      {propertyDetails.images.length > 1 ? (
        <img src={`/uploads/users/${propertyDetails?.creator_id}/${propertyDetails.images && propertyDetails.images[1]}`} alt="" className='h-[22rem] w-full object-cover'/>)
        :

        <ImageUpload property_id={propertyDetails.id}/>
      }
      </div>
      <div className='w-2/4'>
      {propertyDetails.images.length > 2 ? (
        <img src={`/uploads/users/${propertyDetails?.creator_id}/${propertyDetails.images && propertyDetails.images[2]}`} alt="" className='h-[22rem] w-full object-cover'/>)
        :

        <ImageUpload property_id={propertyDetails.id}/>
      }
      </div>
      </div>

      <button onClick={()=>setShowPhotoManager(true)} className='absolute bottom-4 space-x-3 right-4 flex py-2 px-5  items-center bg-white border border-black/80 rounded-md'>
      <BsCardImage/>
      <p className='font-semibold'><span>{propertyDetails?.images && propertyDetails?.images.length}</span> Photos</p>
      </button>
    </div>
    {showPhotoManager && <>
      <PhotoManager 
      property_id={propertyID} 
      currentUser={currentUser} 
      images={propertyDetails.images} 
      setFn={setPropertyImage}
      closePhotoManager={setShowPhotoManager}/>
      
    </>}
    </div>

    {/* INFOR */}

    <div className='mt-5 max-w-[800px]' id='overview'>
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
      <div className='flex flex-wrap md:space-x-10 border-b mt-5 pb-5'>
      <div>
        <p className='font-bold text-2xl'>₦{propertyDetails.amount && Number(propertyDetails.amount).toLocaleString()}</p>
        <p>Estimated price</p>
      </div>

      <div className='flex space-x-10 mt-4 md:mt-0'>
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

    {/* SIMILAR Homes */}
    <div className='mt-10 pb-10 border-b' id='similar'>
    <h1 className='font-bold text-xl'>Similar properties for you</h1>
    <p className='text-xs mt-2'>Homes similar to 9130 S La Salle St are listed between $126K to $375K at an average of $180 per square foot.</p>
    <div className='grid grid-cols-3 gap-3 mt-5'>
      <div className='border max-h-[400px] rounded-xl overflow-hidden'>
      <div className='h-[250px]'>
        <img src="/images/item_40.jpg" alt="" className='w-full'/>
      </div>
      <div className='p-4'>
        <h1 className='text-lg font-bold'>$220,300</h1>
        <div className='flex items-center gap-4 text-sm'>
        <p>2 Beds</p>
        <p>1 Bath</p>
        <p>1,000 Sq.Ft</p>
        </div>
        <p className='text-sm'>4563 the address i chose</p>
      </div>
      </div>
      <div className='border max-h-[400px] rounded-xl overflow-hidden'>
      <div className='h-[250px]'>
        <img src="/images/item_40.jpg" alt="" className='w-full'/>
      </div>
      <div className='p-4'>
        <h1 className='text-lg font-bold'>$220,300</h1>
        <div className='flex items-center gap-4 text-sm'>
        <p>2 Beds</p>
        <p>1 Bath</p>
        <p>1,000 Sq.Ft</p>
        </div>
        <p className='text-sm'>4563 the address i chose</p>
      </div>
      </div>
      <div className='border max-h-[400px] rounded-xl overflow-hidden'>
      <div className='h-[250px]'>
        <img src="/images/item_40.jpg" alt="" className='w-full'/>
      </div>
      <div className='p-4'>
        <h1 className='text-lg font-bold'>$220,300</h1>
        <div className='flex items-center gap-4 text-sm'>
        <p>2 Beds</p>
        <p>1 Bath</p>
        <p>1,000 Sq.Ft</p>
        </div>
        <p className='text-sm'>4563 the address i chose</p>
      </div>
      </div>
      <div className='border max-h-[400px] rounded-xl overflow-hidden'>
      <div className='h-[250px]'>
        <img src="/images/item_40.jpg" alt="" className='w-full'/>
      </div>
      <div className='p-4'>
        <h1 className='text-lg font-bold'>$220,300</h1>
        <div className='flex items-center gap-4 text-sm'>
        <p>2 Beds</p>
        <p>1 Bath</p>
        <p>1,000 Sq.Ft</p>
        </div>
        <p className='text-sm'>4563 the address i chose</p>
      </div>
      </div>
      <div className='border max-h-[400px] rounded-xl overflow-hidden'>
      <div className='h-[250px]'>
        <img src="/images/item_40.jpg" alt="" className='w-full'/>
      </div>
      <div className='p-4'>
        <h1 className='text-lg font-bold'>$220,300</h1>
        <div className='flex items-center gap-4 text-sm'>
        <p>2 Beds</p>
        <p>1 Bath</p>
        <p>1,000 Sq.Ft</p>
        </div>
        <p className='text-sm'>4563 the address i chose</p>
      </div>
      </div>
      <div className='border max-h-[400px] rounded-xl overflow-hidden'>
      <div className='h-[250px] overflow-hidden'>
        <img src="/images/item_40.jpg" alt="" className='w-full'/>
      </div>
      <div className='p-4'>
        <h1 className='text-lg font-bold'>$220,300</h1>
        <div className='flex items-center gap-4 text-sm'>
        <p>2 Beds</p>
        <p>1 Bath</p>
        <p>1,000 Sq.Ft</p>
        </div>
        <p className='text-sm'>4563 the address i chose</p>
      </div>
      </div>
    </div>

    <button className='border mt-5 border-black rounded-lg px-10 py-3 block mx-auto font-bold '>
      View more properties      
    </button>
    </div>

  </div>   
  </div>
  )
}

export default PropertyDetails