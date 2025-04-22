import { useSelector, useDispatch } from "react-redux"
import { toast } from "react-toastify"
import Modal from './Modal'
import { useCallback, useState } from "react"
import { forgotPasswordModalOpen, loginModalClose, registerModalOpen } from "../../store/mainSlice"
import { useForm } from "react-hook-form"
import Input from "../input/Input"
import Checkbox from "../input/Checkbox"
import { useNavigate } from "react-router-dom"
import { loginValidation } from "../../validation/userValidation"
import { yupResolver } from "@hookform/resolvers/yup"
import { updateFavorites, updateUserInfo } from "../../store/userSlice"
import Axios from "../../../utility/axios"
import Button from "../Button"
import { hideLoading, showLoading } from "../../../utility/loading"
import errorHandler from "../../../utility/errorHandler"
import { getPropertyOfInterest } from "../../store/messageSlice"

const Login = () => {

	const dispatch = useDispatch()
	const navigate = useNavigate()

	const loginModal = useSelector((state) => state.main.modal.loginModal)
	//const {userInfo} = useSelector(state=>state.user)

	const { register, handleSubmit, formState: { errors } } = useForm(
		{
			defaultValues: {
				email: '',
				password: ''
			},

			resolver: yupResolver(loginValidation)

		})

	const [isLoading, setIsLoading] = useState(false)

	const toggle = useCallback(() => {
		dispatch(loginModalClose())
		dispatch(registerModalOpen())
	}, [dispatch])


	const onSubmit = async (formdata) => {
		setIsLoading(true)
		showLoading()
		try {
			const { data } = await Axios.post('/login', formdata)
			toast(`Login Successful`, { type: "success" })

			if (data.data.userInfo.is_agent == 1 && data.data.userInfo.is_admin != 1) {
				location.href = '/dashboard'
				return
			} if (data.data.userInfo.is_admin == 1) {
				location.href = '/admins/dashboard'
				return
			}

			dispatch(loginModalClose())
			dispatch(updateUserInfo(data.data.userInfo))
			dispatch(updateFavorites(data.data.favorites))
			//log the users conversations
			dispatch(getPropertyOfInterest())

		} catch (error) {
			errorHandler(error)
		} finally {
			setIsLoading(false)
			hideLoading()
		}

	}

	const body = (
		<div className="space-y-4">
			<div>
				<Input register={register} id={'email'} errors={errors}
					label={'Email'} disabled={isLoading} className={'bg-transparent border'} />
				{errors.email && (
					<p className="text-red-400 text-sm">{errors.email.message}</p>
				)}
			</div>

			<div>
				<Input register={register} id={'password'} type={'password'} errors={errors}
					label={'Password'} disabled={isLoading} className={'bg-transparent border'} />

				{errors.password && (
					<p className="text-red-400 text-sm">{errors.password.message}</p>
				)}
			</div>

			<div className="">
				<Button label={'Sign in'} onClick={handleSubmit(onSubmit)} />
			</div>
			<div className="" onClick={() => { dispatch(forgotPasswordModalOpen()); dispatch(loginModalClose()) }}>
				<p className="text-blue-800 font-semibold text-sm text-center py-2 cursor-pointer hover:underline">Forgot your password?</p>
			</div>


		</div>
	)


	const footer = (

		<div className="w-full relative space-y-8">
			<div className="flex space-x-1 items-center">
				<Checkbox />
				<p>Remember me</p>
			</div>

			<div>
				<h2 className="text-sm">New to XpactAgent? <div onClick={toggle} className="cursor-pointer font-semibold inline-block">Sign up now</div></h2>
			</div>
		</div>
	)

	return (
		<Modal
			isOpen={loginModal.isOpen}
			title={"Sign in"}
			onClose={() => dispatch(loginModalClose())}
			body={body}
			onSubmit={handleSubmit(onSubmit)}
			footer={footer}
			disabled={isLoading} />
	)
}

export default Login