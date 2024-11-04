import React from 'react'
import { MdVerified } from 'react-icons/md'
import { useSelector,useDispatch } from 'react-redux'
import {useForm} from "react-hook-form"
import { hideLoading, showLoading } from '../../../utility/loading'
import Axios from '../../../utility/axios'
import { toast } from 'react-toastify'
import { updateProfile } from '../../store/userSlice'
import { BsCheck } from 'react-icons/bs'
import { Link } from 'react-router-dom'

const IdVerification = () => {
    const userData = useSelector(state=>state.user)
    const dispatch = useDispatch()
    const userDetails = userData.profile
    const {register,handleSubmit,reset,formState:{errors}} = useForm()

    const onSubmit = (data)=>{

        showLoading()

        let formdata = new FormData()
        formdata.append('image',data.doc_img[0])
        formdata.append('doc_type',data.document_type)
        formdata.append('fullname',`${userDetails?.first_name} ${userDetails?.last_name}`)

        Axios({
			method:'post',
			url:'/users/id-verification',
            data:formdata,
			headers:{'Content-Type':'multipart/form-data'}
        }).then(data=>{

            if(data.data.status != 1){
                toast(data.data.error, {type:'error'})
                return false
            }

            toast('Verification request sent', {type:'success'})

            let newUserDetails = {...userDetails, id_verified:2}

            dispatch(updateProfile(newUserDetails))
           
        }).catch(e=>{
            console.log(e.response)
        }).finally(()=>{
            hideLoading()

        })
    }

    if(userDetails.profile_complete != 1){

        return  <div className='h-full text-sm md:w-3/5 md:pl-5 px-2 md:px-0 pb-5 relative'>
            <h1 className='font-bold mb-2 text-2xl'>Please complete your registration first</h1>
            <Link to="/dashboard/account/complete-registration" className='text-sky-600 underline'>Complete registration</Link>
    </div>
    }

  return (
    <div className='h-full text-sm md:w-3/5 md:pl-5 px-2 md:px-0 pb-5 relative'>
        <h1 className='font-bold mb-5 text-2xl'>Request verification</h1>
        <div className='mt-5'>
            <div className='space-y-5'>
                <div>
                    <h1 className='text-lg font-semibold'>Apply for Xpactagents verification</h1>
                    <p>Verified account have checkmarks <MdVerified className="inline-block pr-[2px]" /> 
                    next to their names to show Xpactagents has confirmed they're the real presence of an agent or home owner.</p>
                </div>
                {userDetails.id_verified == 2 ? <div className='py-5 px-5 bg-orange-800 rounded-lg'>
                    <div className='flex items-center space-x-1 md:text-lg'>
                        <div className='flex items-center justify-center bg-green-800 h-6 w-6 rounded-full text-white'><BsCheck size={22}/></div>
                        <h1 className='font-semibold'>Verification request submitted</h1>
                    </div>
                    
                    <p className='text-sm'>We'll let you know once we've reviewed your request for a verified badge.</p>
                </div> : null}

                {userDetails.id_verified == 1 ? <div className='py-5 px-5 bg-green-800 rounded-lg'>
                    <div className='flex items-center space-x-1 md:text-lg'>
                        <div className='flex items-center justify-center bg-green-600 h-6 w-6 rounded-full text-white'><BsCheck size={22}/></div>
                        <h1 className='font-semibold'>Verification Accepted</h1>
                    </div>
                    
                    <p className='text-sm'>Your account was verified, you'll now see a verified badge next to your name.</p>
                </div> : null}

                <div>
                    <h1 className='text-lg font-semibold'>Your profile photo</h1>
                    <div>
                        <img src={`/uploads/users/${userDetails?.id}/profile-photo/${userDetails?.photo}`} alt="" className='h-[10rem] w-[10rem] object-cover rounded-full'/>
                    </div>
                </div> 
                <div>
                    <h1 className='text-lg font-semibold'>Your full name</h1>
                    <div className='border py-3 pl-3 dark:border-slate-500'>
                        <p>{`${userDetails?.first_name} ${userDetails?.last_name}` }</p>
                    </div>
                </div> 

                <div>
                    <form onSubmit={handleSubmit(onSubmit)} action="" className='space-y-5'>

                        <div>
                            <label htmlFor="" className='text-lg font-semibold block'>Document type</label>
                            <select name="" id="" {...register('document_type', {required:true})} className='form-select bg-transparent w-full'>
                                <option value="driver_license">Driver's license</option>
                                <option value="passport">Passport</option>
                                <option value="ni_card">National identification card</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="" className='text-lg font-semibold block'>Add documet image</label>
                            <input type="file" {...register('doc_img',{required:"Provide the doc image to proceed"})} className='form-input bg-transparent w-full'/>
                            {errors.doc_img && (
                                <p className="text-red-400 text-xs">{errors.doc_img.message}</p>
                            )}
                            <span className='text-xs block'>The image in your document must match your profile photo</span>

                        </div>
                        {userDetails.id_verified == 0 ? <div>
                            <button className='bg-sky-800 w-full text-white py-2'>Submit</button>
                            <span className='text-xs block'>We'll only use the information you submit to determine if your account meets our verification criteria</span>
                        </div> : null}
                        
                    </form>
                   
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default IdVerification