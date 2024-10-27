import React, { useState } from 'react'
import { FaEnvelope } from 'react-icons/fa'
import Passcode from '../components/Passcode/Passcode'
import $ from 'jquery'
import Axios from '../../utility/axios'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { hideLoading, showLoading } from '../../utility/loading'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { updateUserInfo } from '../store/userSlice'

const VerifyEmail = () => {

    const [params,setParams] = useSearchParams()
    const [token,setToken] = useState([])
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const onResend = ()=>{

        countDown()

        //disable the resend button and countdown
        $('#resend-email-btn').attr('disabled',true)
        $('#resend-email-btn').text('Sending...')

        Axios.post('/resend-verification-email', {email:params.get('email')}).then(data=>{
                
        $('#resend-email-btn').text('Sent')
        //notify email sent success
        $('#sent-success').fadeIn()

        }).catch(e=>{

        console.log(e)
        })

    }

    const countDown = ()=>{
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
            let htmlMSG = 'Resend verification link in '+minutes +'m '+seconds+"s"

            if (distance < 1){
                // show the send eTCC btn
                $('#resend-msg').html('')
                $('#resend-email-btn').attr('disabled',false)
                $('#resend-email-btn').text('Resend email')
                clearInterval(t)
                return
            }

            $('#resend-msg').html(htmlMSG)

        }, 1000)
    }

    const onVerify = ()=>{

        showLoading()

        Axios.post('/verify-email-token', {email:params.get('email'),token:token.join('')}).then(data=>{

            let status = data.data.status
            if(status != 1){
                toast(data.data.error,{type:'error'})
                return
            }

            if(data.data.is_agent == 1){
                location.href = '/dashboard'
            }else{
                dispatch(updateUserInfo(data.data.user))
                toast('Access granted',{type:'success'})
                navigate('/');

            }

        }).catch(e=>{
            console.log(e)
        }).finally(()=>{

            hideLoading()
        })

    }

  return (
    <div className='w-full h-full'>

        <div className='max-w-[400px] mx-auto px-3 md:px-0'>
            <div className='w-full'>
                <div id="sent-success" className="bg-sky-600 rounded px-4 py-2 hidden">
                    <h1 className="text-white text-center">Email sent successfully</h1>
                </div>
                <div className='py-3 border-b text-center mb-5'>
                    <FaEnvelope className='mx-auto text-sky-600'/>
                    <h1 className='uppercase text-xl font-bold'>Verify your email address</h1>
                </div>

                <p className='mb-5 text-center text-sm'>A verification code has been sent to <span className='text-blue-800 font-semibold'>{params.get('email')}</span></p>
             
                <p className='text-sm'>Please check your inbox and enter the verification code below to verify your email address</p>

                <div className='mt-5 flex justify-center'>
                    <div className='w-auto'>
                        <Passcode getValue={setToken}/>
                    </div>
                    
                </div>
                

                <button onClick={()=>onVerify()} className='w-full bg-sky-600 text-white font-semibold text-sm py-3 rounded mt-5'>Verify</button>

                <div className='mt-2'>
                    <button onClick={onResend} id='resend-email-btn' className='text-sky-700 font-semibold'>Resend code</button>
                    <p className="text-xs mt-3" id="resend-msg"></p>
                </div>
            </div>
        </div>
       
    </div>
  )
}

export default VerifyEmail