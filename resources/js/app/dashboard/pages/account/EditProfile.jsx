import React from 'react'
import { useEffect } from 'react'
import {useForm} from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import States from '../../components/PropertySearch/States'
import { BsTelephonePlus, BsWhatsapp } from 'react-icons/bs'
import { toast } from 'react-toastify'
import { hideLoading, showLoading } from '../../../utility/loading'
import { updateProfile } from '../../store/userSlice'
import Axios from '../../../utility/axios'
import EmptyState from '../../components/EmptyState'

const EditProfile = () => {
    const {register,reset,watch,handleSubmit,formState:{errors}} = useForm()
    const userProfile = useSelector(state=>state.user.profile)
    const dispatch = useDispatch()

    const dob = watch('dob')

    const onSubmitForm = (formData)=>{
        
        showLoading()

        Axios.post('/users/update', formData).then((data)=>{
            toast("Update successful", {type:'success'})
            dispatch(updateProfile(formData))
            //console.log(data.data.data)
        }).catch(e=>{

            console.log(e)
        }).then(()=>{

            hideLoading()
        })
    }

    useEffect(()=>{
        reset(userProfile)
    },[userProfile])

  return (
    <div className='p-5'>
         <div className="text-center mb-3">
            <h1 className="text-slate-500 font-bold text-2xl">Edit profile</h1>
            <p className="text-sm">Use the input fields to personalize your data</p>
        </div>


        {userProfile?.profile_complete == 1 ? ( <form onSubmit={handleSubmit(onSubmitForm)} method="POST" className="space-y-6 text-slate-500 text-xs md:text-sm font-semibold">
                <div className="flex flex-col md:flex-row mx-2 justify-between gap-5">
                    <div className="flex-1 space-y-5">
                        <div className="flex items-center gap-2">
                            <div className="space-y-1 flex-1">
                                <label htmlFor="">First name <span className='inline-block'>*</span></label>
                                <input type="text" name="firstname" {...register('first_name', {required:"Please enter first name"})}  placeholder="Enter first name"
                                        className="block border w-full pl-4 rounded-xl form-input dark:bg-transparent dark:border-slate-800"/>
                                {errors.first_name && (
                                <p className="text-red-400 text-xs">{errors.first_name.message}</p>
                                )}
                            </div>
                            <div className="space-y-1 flex-1">
                                <label htmlFor="">Middle name (Optional)</label>
                                <input type="text" name="middlename" {...register('middle_name')}  placeholder="Enter middle name"
                                        className="block dark:bg-transparent dark:border-slate-800 border w-full pl-4 rounded-xl form-input"/>
                            </div>

                        </div>
                        <div className="space-y-1">
                            <label htmlFor="">Last name <span className='inline-block'>*</span></label>
                            <input type="text" name="lastname" {...register('last_name', {required:"Please enter last name"})} placeholder="Enter last name"
                                    className="block border dark:bg-transparent dark:border-slate-800 w-full pl-4 rounded-xl form-input"/>
                                {errors.last_name && (
                                <p className="text-red-400 text-xs">{errors.last_name.message}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <p>Gender <span className='inline-block'>*</span></p>
                            
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="flex gap-2 items-center">
                                    <input type="radio" name="gender" {...register('gender', {required:"Please choose a gender"})} value="male" id="male"
                                            className="dark:bg-transparent dark:border-slate-800 block border form-radio w-5 h-5"/>
                                    <label htmlFor="male" className="cursor-pointer">Male</label>
                                </div>
                                <div className="flex items-center">
                                    <input type="radio" name="gender" {...register('gender', {required:"Please choose a gender"})} value="female" id="female"
                                            className="dark:bg-transparent dark:border-slate-800 block border form-radio w-5 h-5" />
                                    <label htmlFor="female" className="cursor-pointer">Female</label>
                                </div>
                            </div>
                            {errors.gender && (
                                <p className="text-red-400 text-xs">{errors.gender.message}</p>
                            )}
                            
                        </div>
                        <div className="space-y-1 flex-1">
                            <label htmlFor="">Date of birth (Optional)</label>
                            <input type="date" name="dob"  {...register('dob')}
                                    className="dark:bg-transparent dark:border-slate-800 block border w-full pl-4 rounded-xl form-input"/>
                            
                        </div>
                    </div>

                    <div className="flex-1 space-y-5">
                        <div className="space-y-1">
                            <p>States/Lgas <span className='inline-block'>*</span></p>
                            <States require={true} rounded={'rounded-xl'} register={register} optState={watch('state')}/>
                            {errors.state && (
                                <p className="text-red-400 text-xs">{errors.state.message}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor=""><BsTelephonePlus className='inline-block'/>Phone <span className='inline-block'>*</span></label>
                            <input type="tel" name="phone" {...register('phone',{required:"Phone must be filled", minLength:{value:10,message:"Phone too short"}})}  placeholder="Enter phone"
                                    className="dark:bg-transparent dark:border-slate-800 block border w-full pl-4 rounded-xl form-input"/>
                            {errors.phone && (
                                <p className="text-red-400 text-xs">{errors.phone.message}</p>
                            )}
                            <p className='text-sm pt-3'>By providing your number users may reach you for more enquiries on your listings</p>
                        </div>
                        <div className="space-y-1 pt-2">
                            <label htmlFor=""><BsWhatsapp className='inline-block'/> Whatsapp (Optional)</label>
                            <input type="tel" name="phone" {...register('whatsapp',{minLength:{value:10,message:"Length too short"}})}  placeholder="Enter phone"
                                    className="dark:bg-transparent dark:border-slate-800 block border w-full pl-4 rounded-xl form-input"/>
                                {errors.phone && (
                                <p className="text-red-400 text-xs">{errors.whatsapp.message}</p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="">Address <span className='inline-block'>*</span></label>
                            <input type="text" name="address" {...register('address',{required:"Please enter address"})}  placeholder="Enter your address"
                                    className="dark:bg-transparent dark:border-slate-800 block border w-full pl-4 rounded-xl form-input"/>
                        </div>
                    </div>             
                </div>
                <div>
                    <button className="w-full text-center rounded-3xl h-12 bg-slate-200 hover:bg-slate-300 text-lg font-bold">Continue</button>
                </div>
        </form>) :

        <EmptyState title='Complete Registration' subtitle='We want to know more about you, please complete your registration to view your profile' 
            showReset={false}
            link={'/dashboard/account/complete-registration'} linkTitle='Complete registration'/>
        }
    </div>
  )
}

export default EditProfile