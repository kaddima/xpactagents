import React from 'react'
import Slider from "react-slick";
import {BsArrowRightCircle,BsArrowLeftCircle} from 'react-icons/bs'

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";



const PrevArrow = ({onClick, className,})=>{

    return <button onClick={onClick} className="w-5,h-5 p-1 absolute left-0 z-[999] 
    block   text-[#d92228] top-2/4 rounded-full">
        <BsArrowLeftCircle/>
    </button>

}

const NextArrow = ({onClick, className,})=>{

    return <button onClick={onClick} className="w-5,h-5 p-1 absolute right-0 block
       text-[#d92228] top-2/4 rounded-full">
        <BsArrowRightCircle/>
    </button>
}


const PropertyImages = () => {


    let slider1, slider2


    const [sliderState ,setSliderState] = useState({
        nav1 : null,
        nav2 : null
    })


    useEffect(()=>{
        setSliderState({nav1 : slider1,nav2:slider2})
        
    },[])



  return (
    <div>
    {/* FIRST SLIDER SLICK */}
    <div className="relative w-full h-[200px] sm:h-[250px] md:h-[350px]">
        <Slider ref={slider => slider1 = slider}  asNavFor={sliderState.nav2} nextArrow={<NextArrow/>} prevArrow={<PrevArrow/>}>          
            {propertyDetails?.photos.map((v,i)=>{

                return  (
                <div key={i} className="mb-2 h-full">
                    <div className="shadow-sm shadow-gray-200 bg-[#fffffa] space-y-2 h-full">
                        <div className="rounded-md overflow-hidden border h-full">
                            <img src={`/uploads/${v.name ? v.name : ''}`} alt="" className=""/>
                        </div>
                    </div>    
                </div>   )           
            })}               
        </Slider>
   </div>
    
    {/* SECOND SLIDER SLICK */}
    <div className="relative w-full h-[50px] md:h-[150px] sm:h-[100px] mt-5">
         <Slider ref={slider => slider2 = slider}  asNavFor={sliderState.nav1}  slidesToShow={3}
        swipeToSlide={true}
        focusOnSelect={true}
        infinite={false}>
        
        {propertyDetails?.photos.map((v,i)=>{

            return  (
                <div key={i} className="mr-4 mb-2 h-full">
                    <div className="shadow-sm shadow-gray-200 bg-[#fffffa] space-y-2 h-full">
                        <div className="rounded-md overflow-hidden border h-full">
                            <img src={`/uploads/${v.name ? v.name : ''}`} alt="" className="w-full h-full"/>
                        </div>
                    </div>    
                </div>   )           
        })}
                
    </Slider>
    </div>
   
</div>
  )
}

export default PropertyImages