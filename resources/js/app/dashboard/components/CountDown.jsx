import React,{useState,useEffect} from 'react'

import {BsArrowRightCircle} from "react-icons/bs"

import $ from "jquery"

const CountDown = () => {

  const [countDown, setCountDown] = useState({min:'',secs:''})
  const [counting,setCounting] = useState(true)

  const handleClick = (e)=>{

    countDownFn()
    setCounting(true)

     //enable the confirm button
     $('#confirm-otp').attr('disabled',false).css({opacity:'1'})
  }

  const countDownFn = ()=>{

    let date = new Date()
    let t = setInterval(function () {
      var now = new Date().getTime();
      // Set the date we're counting down to
      var countDownDate = new Date(date);

      countDownDate.setMinutes(countDownDate.getMinutes() + 0);
      countDownDate.setSeconds(countDownDate.getSeconds() + 9);

      countDownDate = countDownDate.getTime();

      // var countDownDate = now + 1000*60*60*24;
      // Find the distance between now and the count down date
      var distance = countDownDate - now;
      // Time calculations for days, hours, minutes and seconds
      // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountDown({...countDown, min:minutes, secs:seconds})

       // let htmlMSG = 'Note the eTCC expires in '+minutes +'m '+seconds+"s"
      if (distance < 1){
        setCounting(false)
        clearInterval(t)

        //disable the confirm button
        $('#confirm-otp').attr('disabled',true).css({opacity:'0.7'})
        return
      }

    },1000)
  }

  useEffect(()=>{

     countDownFn()

      //$('#time-notifier').html(htmlMSG)
  },[])

  return (
  <div>
    {counting ? (
      <div>
        <p className='text-blue-500'>Note, the eTCC expires in {countDown.min}m {countDown.secs}s</p>
      </div>
    ) : (
    <div className=''>
      <div className='flex items-center justify-between flex-wrap'>
        <div>
          <span className='text-blue-500'>Your eTCC has expired.</span>
        </div>
        <button onClick={handleClick} className='text-gray-600 bg-gray-200 hover:bg-gray-400 hover:text-gray-800 p-2 rounded'>
          <div className='flex items-center space-x-1'>
            <span>New eTCC</span>
            <BsArrowRightCircle/>
          </div>
          
        </button>
      </div>
       
    </div>
    )}
  </div>
  )
}

export default CountDown