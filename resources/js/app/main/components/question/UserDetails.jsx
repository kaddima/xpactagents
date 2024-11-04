import React from 'react'
import Modal from '../modals/Modal'
import { useState } from 'react'
import {useFormContext} from "react-hook-form"
import Button from '../Button'
import $ from 'jquery'
import Axios from '../../../utility/axios'
import { toast } from 'react-toastify'
import { hideLoading, showLoading } from '../../../utility/loading'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { updateUserInfo } from '../../store/userSlice'
import { useDispatch } from 'react-redux'

const UserDetails = ({agentId,isOpen=false,setShowDetailsForm}) => {
    const [openModal,setOpenModal] = useState(isOpen)
    const {register,handleSubmit,reset} = useFormContext()
    const dispatch = useDispatch()
    const property_id = useParams().id
    const agent_id = agentId


    const onSubmit = (formdata)=>{
        showLoading()
        
        Axios.post('/question/send-messge', {...formdata,agent_id,property_id}).then((data)=>{
            
            if(data.data.status == 0){

                toast(data.data.error, {type:'error'})
                return
            }

            $('#q-submitted').removeClass('translate-x-[2000px]')
            setShowDetailsForm(false)
            //update the user info to show they are logged in
            dispatch(updateUserInfo(data.data.data))

            console.log(data)
        })
        .catch(e=>{
            console.log(error)
        })   
        .finally(()=>{
            hideLoading()
        })

    }

    const body = (

        <div className={``}>
            
                <div className='space-y-5'>
                    <div className='flex items-center w-full gap-3'>
                        <div className='flex-1'> 
                            <label htmlFor="" className='block' >First name</label>
                            <input type="text" {...register('first_name',{required:"Please Enter first name"})} className='form-input w-full rounded dark:bg-transparent' placeholder='First name '/>
                        </div>
                        <div className='flex-1'>
                            <label htmlFor="" className='block'>Last name</label>
                            <input type="text" {...register('last_name',{required:"Please Enter last name"})} className='form-input w-full rounded dark:bg-transparent' placeholder='Last name'/>
                        </div>
                    </div>
                    <div className='flex items-center w-full gap-3'>
                        <div className='flex-1'> 
                            <label htmlFor="" className='block'>Email</label>
                            <input type="text" {...register('email',{required:"Please Enter email address"})} className='form-input w-full rounded dark:bg-transparent' placeholder='Email address'/>
                        </div>
                        <div className='flex-1'>
                            <label htmlFor="" className='block'>Phone</label>
                            <input type="text" {...register('phone',{required:"Please Enter phone"})} className='form-input w-full rounded dark:bg-transparent' placeholder='phone'/>
                        </div>
                    </div>
                </div>

                <p className='text-xs my-2'>You are creating an Xpactagent account and agree to our <a href="#">Terms of Use</a> and <a href="#">Privacy Policy</a></p>
                <div className="">
                    <Button label={'Send message'}  onClick={handleSubmit(onSubmit)} />
                </div>

        </div>
    )

    useEffect(()=>{
        setOpenModal(isOpen)
    },[isOpen])

    if(!isOpen){

        return null
    }

  return (
    
    <Modal isOpen={openModal} title={'How can we get back to you'}
        body={body}
        onClose={()=>{setOpenModal(false);setShowDetailsForm(false)}
        }
        btnLabel='Send message'
        onSubmit={handleSubmit(onSubmit)}/>
    
  )
}

export default UserDetails