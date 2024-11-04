import {useSelector,useDispatch} from "react-redux"
import {toast} from "react-toastify"
import Modal from './Modal'
import { useCallback, useState } from "react"
import { forgotPasswordModalClose,loginModalOpen } from "../../store/mainSlice"
import {useForm} from "react-hook-form"
import Input from "../input/Input"
import Axios from "../../../utility/axios"
import Button from "../Button"
import { hideLoading, showLoading } from "../../../utility/loading"

const SentEmail = ({email})=>{
    return <div className="text-center text-sm md:text-lg mb-5 space-y-3">
        <h1 className="text-xl md:text-2xl font-semibold">Your forgot password email was sent!</h1>
        <p className="leading-none">If the email address has an account, an email will be sent with a link to reset your password.</p>
        <p>Email sent to: <span className="text-blue-600">{email}</span></p>
    </div>
}

const ForgotForm = ({stateFn})=>{

    const {register, handleSubmit,watch,formState:{errors}} = useForm()
    const onSubmit = async (formdata)=>{
        showLoading()

        try{
            
            Axios.post('/forgot-password', formdata)

            stateFn(prev=>{

                return {...prev, state:1,email:watch('email')}
            })

        }catch(error){
           console.log(error)
        }finally{
            
            hideLoading()
        }

    }

    return (
        <div>
            <div className="text-center text-sm md:text-lg mb-5 space-y-3">
                <h1 className="text-xl md:text-2xl font-semibold">Forgotten your password?</h1>
                <p className="leading-none">Enter your email address and we'll send you a link to set your password.</p>
            </div>
            
            <div className="space-y-4">
                <div>
                    <Input register={register} id={'email'} errors={errors}
                    label={'Email'} className={'bg-transparent border'}/>
                    {errors.email && (
                        <p className="text-red-400 text-sm">{errors.email.message}</p>
                    )}
                </div>

                <div className="">
                    <Button label={'Send'} onClick={handleSubmit(onSubmit)} />
                </div>
                
            </div>
        </div>)
}

const ForgotPassword = () => {

    const dispatch = useDispatch()
    const forgotPasswordModal = useSelector((state)=>state.main.modal.forgotPasswordModal)
    const [forgetState,setForgetState] = useState({state:0,email:null})
  
    const toggle = useCallback(()=>{
        dispatch(forgotPasswordModalClose())
        dispatch(loginModalOpen())
        
    },[])

  
    const body = (
        <>
            {forgetState?.state == 0 ? <ForgotForm stateFn={setForgetState}/> : <SentEmail email={forgetState.email}/>}
        </>     
    )


    const footer = (

        <div className="w-full relative">
            <div>
                <h2 className="text-sm">Know your password? <div onClick={toggle} className="cursor-pointer font-semibold inline-block">Sign in</div></h2>
            </div>
        </div>
    )
  
    return (
    <Modal 
        isOpen={forgotPasswordModal.isOpen}     
        onClose={()=>dispatch(forgotPasswordModalClose())}
        body={body} 
        footer={footer} 
        />
  )
}

export default ForgotPassword