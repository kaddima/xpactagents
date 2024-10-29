import React,{useEffect, useState} from 'react'
import axios from 'axios'
import Slider from 'react-slick'
import {toast} from 'react-toastify'

import { ConfirmModal, PropertyCard } from '../components'
import $ from 'jquery'

const LatestProperty = () => {

  const [latestProperty, setLatestProperty] = useState([])
	
	const [propertyID,setPropertyID] = useState(null)

  const slickSetings =  {
  dots: true,
  infinite: true,
  autoplay:true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
    breakpoint: 750,
    settings: {
    slidesToShow: 2,
    slidesToScroll: 2
    }
    },
    {
    breakpoint: 480,
    settings: {
    slidesToShow: 1,
    slidesToScroll: 1
    }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
    ]
  }


  useEffect(()=>{

  axios.post('/dashboard/get-latest-properties').then(data=>{
    setLatestProperty(data.data.data)
  }).catch(e=>{
    console.log(e.response)
  })

  },[])

  return (
  <div className='h-3/5'>
  
  <Slider {... slickSetings} className="w-full">
    {latestProperty.map((v,i)=>{
    
    return <PropertyCard key={i} data={v}/>     
    })}    
  </Slider>
  
  </div>
  )
}

export default LatestProperty