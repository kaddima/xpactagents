import { useDispatch,useSelector } from "react-redux"
import {useForm} from "react-hook-form"

import {useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import {toast} from "react-toastify"

import { MdPermDeviceInformation } from "react-icons/md"

import Input from "../../components/input/Input"

import { hideLoading, showLoading } from "../../../utility/loading"
import Axios from "../../../utility/axios"

const UserForm = ({register,reset,errors,watch})=>{

    useEffect(()=>{

        reset()

    },[])

    return <div className="space-y-4">
        <div className="flex gap-2">
            <div className="flex-1">
                <input type="hidden" {...register('reg_type')} value={'user'}/>
                <Input register={register} id={'first_name'} errors={errors}
                label={'First name'} className={'bg-transparent border'}/>
                {errors.first_name && (
                    <p className="text-red-400 text-sm">{errors.first_name.message}</p>
                )}
            </div>
            <div className="flex-1">
                <Input register={register} id={'last_name'} errors={errors}
                label={'Last name'} className={'bg-transparent border'}/>
                {errors.last_name && (
                    <p className="text-red-400 text-sm">{errors.last_name.message}</p>
                )}
            </div>
        </div>
        
        <div>
            <Input register={register} id={'email'} errors={errors}
            label={'Email'}  className={'bg-transparent border'}/>
            {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}
        </div>
        <div>
            <Input register={register} type={'number'} id={'phone'} errors={errors}
            label={'phone'}  className={'bg-transparent border'}/>
            {errors.phone && (
                <p className="text-red-400 text-sm">{errors.phone.message}</p>
            )}
        </div>
        
        <div>
            <Input 
            register={register} 
            id={'password'} 
            valObj={{
                required:"please enter password", 
                minLength:{value:6,message:"Password too short"}}} 
            type={'password'} errors={errors} 
            label={'Password'}  className={'bg-transparent border'}/>

            {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
            )}
        </div>
        <div>
            <Input 
            register={register} 
            id={'c_password'} 
            valObj={{
                required: "Please enter confirm password",
                minLength:{value:6,message:"Password too short"},
                validate: (val) => {
                    if (watch('password') != val) {
                    return "Your passwords do no match";
                    }
                },
            }} 
            type={'password'} errors={errors} 
            label={'Confirm Password'}  className={'bg-transparent border'}/>

            {errors.c_password && (
                <p className="text-red-400 text-sm">{errors.c_password.message}</p>
            )}
        </div>

    </div>
} 

const AgentForm = ({register,reset,errors,watch})=>{


    useEffect(()=>{
        reset()
    },[])

    return  <div className="space-y-4">
    <div>
        <input type="hidden" {...register('reg_type')} value={'agent'}/>
        <Input register={register} id={'email'} errors={errors}
        label={'Email'}  className={'bg-transparent border'}/>
        {errors.email && (
            <p className="text-red-400 text-sm">{errors.email.message}</p>
        )}
    </div>
    
    <div>
        <Input 
        register={register} 
        id={'password'} 
        valObj={{
            required:"please enter password", 
            minLength:{value:6,message:"Password too short"}}} 
        type={'password'} errors={errors} 
        label={'Password'}  className={'bg-transparent border'}/>

        {errors.password && (
            <p className="text-red-400 text-sm">{errors.password.message}</p>
        )}
    </div>
    <div>
        <Input 
        register={register} 
        id={'c_password'} 
        valObj={{
            required: "Please enter confirm password",
            minLength:{value:6,message:"Password too short"},
            validate: (val) => {
                if (watch('password') != val) {
                return "Your passwords do no match";
                }
            },
        }} 
        type={'password'} errors={errors} 
        label={'Confirm Password'}  className={'bg-transparent border'}/>

        {errors.c_password && (
            <p className="text-red-400 text-sm">{errors.c_password.message}</p>
        )}
    </div>
</div>
}

const CreateAdmin = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)
    const [signas, setSignas] = useState('user')

    const {register,reset,setError, handleSubmit,watch,formState:{errors}} = useForm(
    {
        defaultValues:{
        email:'',
        password:''
    },

   
    })


    const onSubmit = (formData)=>{
            showLoading()
            Axios.post('/create-account', formData).then(data=>{
                console.log(data.data)
                let status = data.data.status
                if(status == 0){

                    let errors = data.data.errors
                    Object.keys(errors).forEach((k,i)=>{
                        let name = k
                        let type = 'manual'
                        let message = errors[k][0]

                        setError(name,{type,message})
                    })

                    return
                }

                navigate(`/app/register/verify-email?email=${formData.email}`)
                dispatch(registerModalClose())
                
            }).catch(e=>{

                console.log(e)
            }).finally(()=>{
                hideLoading()
            })


    }

    const body = (

        <div className="mt-[-1.5em]">
            <form onSubmit={handleSubmit(onSubmit)} action="">
                <div className="mb-5">
                    <div className="flex items-center gap-5 text-sm mb-3">
                        <button type="button" className={`py-2 ${signas == 'user' && 'border-b-[2px] text-bold border-b-neutral-400'}`} onClick={()=>setSignas('user')}>User</button>
                        <button type="button" className={`px-1 py-2 ${signas == 'agent' && 'border-b-[2px] border-b-neutral-400'}`} onClick={()=>setSignas('agent')}>Agent</button>     
                    </div>
                    <div className="">
                        {signas == 'user' && <div className="flex bg-sky-50 p-2 text-sky-800"><MdPermDeviceInformation className="text-xl md:text-2xl"/><p className="text-sm leading-none"> You are registering an account as a regular user seeking to find properties or listings adequate for your needs.</p></div>}
                        {signas == 'agent' && <div className="flex bg-sky-50 p-2 text-sky-800"><MdPermDeviceInformation className="text-xl md:text-2xl"/><p className="text-sm leading-none"> Opening an agent account with us provides you with an incredible dashboard to upload and manage your properties.</p></div>}
                    </div>
                </div>

                {signas == 'agent' ? <AgentForm register={register} watch={watch} reset={reset} errors={errors}/> : <UserForm register={register} watch={watch} reset={reset} errors={errors}/>}
            
                <div className="mt-5">
                    <button type="submit" className="bg-sky-600 rounded py-2 px-5 text-white font-semibold">Sign up</button>
                </div>
            </form>
           
        </div>

    )

  return body
}

export default  CreateAdmin