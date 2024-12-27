import React from 'react'
import {useForm,FormProvider} from 'react-hook-form'
import $ from 'jquery'
import UserDetails from './UserDetails'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { hideLoading, showLoading } from '../../../utility/loading'
import Axios from '../../../utility/axios'
import { FaRegCheckCircle } from 'react-icons/fa'
import { MdVerified } from 'react-icons/md'

const Question = ({propertyDetails}) => {

    const methods = useForm()
    const [showDetailsForm,setShowDetailsForm] = useState(false)
    const currentUser = useSelector(state=>state.user.userInfo)
    const property_id = useParams().id

    let msgClick = (e)=>{

        let text = $(e.currentTarget).text()
        
        methods.setValue('message',text)

    }

    const onSubmit = (formdata)=>{

        if(currentUser?.first_name){
            methods.reset()
            showLoading()
            Axios.post('/question/send-messge', {...formdata,agent_id:propertyDetails.creator_id,property_id}).then((data)=>{
                
                if(data.data.status == 0){

                    toast(data.data.error, {type:error})
                    return
                }
                
                $('#q-submitted').removeClass('translate-x-[2000px]')

            })
            .catch(e=>{
                console.log(e)
            })   
            .finally(()=>{
                hideLoading()
            })

            return

        }

        //console.log(formValue)
        setShowDetailsForm(true)
    }

  return (
    <div>
        <div className='mt-5 relative'>  
            <div className='absolute z-[10] inset-0   transition translate-x-[2000px]' id='q-submitted'>
                <div className='flex flex-col justify-center h-full w-full px-5'>
                    <div>
                        <FaRegCheckCircle size={34} className='text-green-600'/>
                        <h1 className='text-lg font-semibold mt-3 mb-1'>Message Submitted</h1>
                        <p>We'll get in touch soon</p>
                    </div>
                </div>
            </div>

            <div className='flex items-center space-x-5'>
                <div className='w-24 h-24 rounded-full border overflow-hidden'>
                    <img src={propertyDetails?.agentDetails.photo} alt="" className='w-24 h-24 object-cover'/>
                </div>

                <div className='text-sm'>
                    <div className='flex items-center space-x-2'>
                    <h1 className='font-semibold text-sky-800 text-lg'>{propertyDetails?.agentDetails.first_name} {propertyDetails?.agentDetails.last_name}</h1>
                        {propertyDetails?.agentDetails.id_verified == 1 ? <MdVerified size={24} className='text-sky-600'/> : null}
                    </div>  
                    
                    <p>{propertyDetails?.agentDetails.state} Xpactagent</p>
                    <span>{propertyDetails?.agentDetails.first} typically replies in <span className='font-semibold text-sky-800'>few minutes</span></span>
                </div>
            </div>

            <div className='mt-5'>
                <div >
                    <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} action="" className='relative'>

                        {showDetailsForm && <UserDetails agentId={propertyDetails.creator_id} isOpen={showDetailsForm} setShowDetailsForm={setShowDetailsForm}/>}
                        
                        <div className='border border-black dark:border-slate-800 min-h-[200px] pb-4'>
                            <textarea name="" id="" cols="30" {...methods.register('message',{required:true})} rows="6" className='form-textarea w-full border-0 dark:bg-transparent' placeholder='Write a message...' >

                            </textarea>
                            {!methods.watch('message')?.length && (<div className='flex flex-wrap mt-2 gap-5 px-5'>
                                <button type='button' onClick={msgClick}  className='border border-sky-800 rounded text-sky-800 font-semibold md:px-3 md:py-2'>
                                    I'd like more home details
                                </button>
                                <button type='button' onClick={msgClick}  className='border border-sky-800 rounded text-sky-800 font-semibold md:px-3 md:py-2'>
                                    I'm interested in buying
                                </button >
                                <button type='button' onClick={msgClick}  className='border border-sky-800 rounded text-sky-800 font-semibold md:px-3 md:py-2'>
                                    Is this home still available
                                </button >
                            </div>

                            )}
                            

                        </div>
                        

                        <div className='mt-4 flex items-center gap-5'>
                            <button className='rounded px-5 py-2 bg-black dark:bg-slate-800 text-white font-semibold'>
                                Ask a question
                            </button>

                            <p className='text-lg'>Text or call <span className='text-sky-800 font-semibold'>{propertyDetails?.agentDetails.phone}</span></p>

                        </div>
                    </form>
                    </FormProvider> 
                </div>
            </div>
            
           
        </div>
    </div>
  )
}

export default Question