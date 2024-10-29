import React, { useState } from 'react'
import { Calendar } from 'react-date-range'
import Time from '../components/Tour/Time'
import {useForm} from "react-hook-form"
import { BsArrowLeft } from 'react-icons/bs'
import { addHours, format,getDate,getMonth,isPast, parse, toDate} from 'date-fns'
import { toast } from 'react-toastify'
import { hideLoading, showLoading } from '../../utility/loading'
import TourResquestSuccess from '../components/modals/PopUp/TourResquestSuccess'
import { tourRequestSuccessModalOpen } from '../store/mainSlice'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import amTopm from '../../utility/amToPm'
import { getYear } from 'date-fns'
import Axios from '../../utility/axios'

const DatenTime = ({setDateTime})=>{
  const [currentDate, setCurrentDate] = useState(new Date())
  return <>
    <h1 className='text-3xl font-bold'>Tour with a Partner Agent</h1>
    <p className='font-sm font-[400]'>Partner Agents work for other brokerages but share our commitment to customer service</p>
  
    <div className='mx-auto'>
    <Calendar 
      date={new Date(currentDate)}

      onChange={(dateValue)=>{

      //console.log(dateValue)
      if(isPast(dateValue)){

        toast("Please select future date", {type:'success'})
        return;
      } 

      setCurrentDate(dateValue)

      setDateTime(prev=>{

        return {...prev,date:dateValue}
      })
      }}

    />
    </div>

    <div>
    <h1 className='text-3xl font-bold'>When are you available?</h1>
    <p className='mb-5'>Choose a time that work for you.</p>
    <Time stateFn={setDateTime}/>
    </div>
  </>
}

const UserDetails = ({register,errorState})=>{


  return <>
  <form action="">
    <div className='space-y-5'>
    <div>
      <h1 className='text-3xl font-bold'>Tell us a little about yourself</h1>
      <p className='font-sm font-[400]'>We will never share your information or spam you.</p>
    </div>
    

    <div>
      <label htmlFor="">First name</label>
      <input type="text" {...register('first_name', {required:"Please provide first name"})} className='form-input border rounded block w-full' placeholder='John'/>
      {errorState.first_name && (
      <p className="text-red-400 text-sm">{errorState.first_name.message}</p>
      )}
    </div>
    <div>
      <label htmlFor="">Last name</label>
      <input type="text" {...register('last_name', {required:"Please provide second name"})} className='form-input border rounded block w-full' placeholder='Doe'/>
      {errorState.last_name && (
      <p className="text-red-400 text-sm">{errorState.last_name.message}</p>
      )}
    </div>
    <div>
      <label htmlFor="">Phone</label>
      <input type="text" 
      {...register('phone', {
      required:"Phone number is required",
      minLength:{value:11,message:"Phone length too short"}
      })}
       
      className='form-input border rounded block w-full' placeholder='(+234) 902 -4567-233'/>
      {errorState.phone && (
      <p className="text-red-400 text-sm">{errorState.phone.message}</p>
      )}
      <p className='text-slate-500 text-sm pt-4'>By providing your phone number, you consent to receive calls/text messages from Redfin about your tour.</p>
    </div>

    <div>
      <label htmlFor="">Notes <span className='text-sm text-slate-500'>(optional)</span></label>
      <textarea name="" id="" {...register('notes')} className='w-full form-textarea' placeholder='Are there other times that could work for a tour? We could get you confirmed faster.'>

      </textarea>
    </div>

    <div>
      <p>What's the best way to contact you? <span>(Optional)</span></p>
      
      <div className='flex items-center space-x-5 mt-3'>
      <div>
        <input type="radio" id='email' {...register('best_contact')} name='best_contact' className='h-5 w-5 form-radio' value={'email'} />
        <label htmlFor="email" className='inline-block pl-2'>Email</label>    
      </div>
      <div>
        <input type="radio" id='call' {...register('best_contact')} name='best_contact' className='h-5 w-5 form-radio' value={'call'}/>
        <label htmlFor="call" className='inline-block pl-2'>Call</label>
        
      </div>
      <div>
        <input type="radio" id='text' {...register('best_contact')} name='best_contact' className='h-5 w-5 form-radio' value={'text'}/>
        <label htmlFor="text" className='inline-block pl-2'>Text</label>
        
      </div>
      </div>
    </div>

    <div>
      <p className='text-sm'>By continuing, you agree to our <a href="/terms-of-use" className='text-sky-800 font-semibold'>Terms of Use</a> and <a href="/privacy-policy" className='text-sky-800 font-semibold'>Privacy Policy</a></p>
    </div>
  
    </div>
  </form> 

  </>
}

const ScheduleTour = () => {
  const [body,setBody] = useState('date_time')
  const {register,handleSubmit,reset,formState:{errors}} = useForm()
  const [dateTime,setDateTime] = useState({

  date: Date.now(),
  time:null
  })

  const property_id = useParams().id

  const dispatch = useDispatch()

  const onRequestTour = (data)=>{
  
  if(!dateTime.time){
    setBody('date_time')
    return
  }

  showLoading()

  const date = new Date(dateTime.date);

  let year = getYear(date)
  let month = getMonth(date)+1
  let day = getDate(date)

  let fullDate = `${year}-${month}-${day} ${amTopm(dateTime.time)}`

  let formValues = {...data, dateTime:fullDate,property_id}

  Axios.post('/tours/add', formValues).then(data=>{
    
    let results = data.data.data
    reset()
    setDateTime({
    date: Date.now(),
    time:null
    })

    //open the tour request success modal
    dispatch(tourRequestSuccessModalOpen())
    
  }).catch(e=>{

  }).then(()=>{
    hideLoading()
  })
 
  }

  return (
  <div className='w-full h-full overflow-scroll'>
  <div className='max-w-[750px] px-4 mx-auto pt-5 pb-16 relative'>
    <TourResquestSuccess/>
    <div className='pt-8 text-slate-600'>
     
    {body == 'date_time' && <DatenTime setDateTime={setDateTime}/>}
    {body == 'user_details' && <div>
      <div onClick={()=>setBody('date_time')} className='mb-3 hover:bg-slate-300 p-1 rounded cursor-pointer inline-block'>
      <BsArrowLeft size={18} />
      </div>
      <UserDetails register={register} errorState={errors}/>
      </div>}
    {body == 'date_time' && (
      <div className='mt-5'>
      <button 
      type='button' 
      disabled={dateTime.time ? false : true} 
      onClick={()=>setBody('user_details')} 
      className={`${dateTime.time ? "hover:bg-theme-color/80" : 'cursor-not-allowed bg-theme-color/60' }
       bg-theme-color  text-white font-semibold rounded-md py-[0.5rem] px-[1rem]`}>
        Next
      </button>
      </div> 
    )}

    {body == 'user_details' && (
      <div className='mt-5'>
      <button onClick={handleSubmit(onRequestTour)} className='bg-theme-color text-white font-semibold rounded-md py-[0.5rem] px-[1rem]'>Request tour</button>
      </div> 
    )}
         
    </div>
  </div>
  <div className='fixed bottom-0 bg-white w-full border py-2'>
    <div className='flex items-center justify-center text-center space-x-5 font-[430] text-sm'>
    <div className='mr-5'>
      <h1>Homes</h1>
      <p className='font-bold'>1</p>
    </div>
    <div className='mx-5'>
      <h1>Date </h1>
      <p className='font-bold'>{format(dateTime.date,'eee, MMM dd')}</p>
    </div>
    <div className='ml-5'>
      <h1>Selected time</h1>
      <p className='font-bold'>{dateTime.time ? dateTime.time : '-'}</p>
    </div>
    </div>
  </div>
  </div>
  
  )
}

export default ScheduleTour