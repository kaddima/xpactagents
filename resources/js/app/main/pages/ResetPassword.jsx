import React from "react";
import { useForm } from "react-hook-form";
import Input from "../components/input/Input";
import Button from "../components/Button";
import { BsPatchCheckFill } from "react-icons/bs";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { hideLoading, showLoading } from "../../utility/loading";
import { toast } from "react-toastify";
import $ from "jquery";
import Axios from "../../utility/axios";
import errorHandler from "../../utility/errorHandler";

const ResetPassword = () => {
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = useForm();
	const [params] = useSearchParams();
	const token = params.get("token")
	const onSubmit = async (formData) => {
		showLoading();
		let submitData = { ...formData, token };
		
		Axios.post("/password/reset", submitData).then(response => {
			$("#reset-success").slideDown();
			reset();
		}).catch(e => {
			errorHandler(e.response.data)
		}).finally(() => {
			hideLoading();
		})
	};

	return (
		<div className="h-full md:flex items-center justify-center px-3 md:px-0">
			<div className="max-w-[450px] mx-auto md:mx-0">
				<div className="text-center mb-5">
					<h1 className="text-xl md:text-2xl font-bold">Password Reset</h1>
					<p className="text-sm">
						Your new password should be different from your old password
					</p>
					<div
						id="reset-success"
						className="hidden my-3 text-green-700 font-semibold"
					>
						<BsPatchCheckFill size={32} className="mx-auto " />
						<h1>Password Reset successful</h1>
					</div>
				</div>
				<div>
					<form action="" className="space-y-4">
						<div>
							<Input
								type={"password"}
								register={register}
								id={"password"}
								errors={errors}
								valObj={{
									required: "please enter password",
									minLength: { value: 6, message: "Password too short" },
								}}
								label={"New Password"}
								className={"bg-transparent border"}
							/>
							{errors.password && (
								<p className="text-red-400 text-sm">
									{errors.password.message}
								</p>
							)}
						</div>
						<div>
							<Input
								type={"password"}
								register={register}
								id={"confirm_password"}
								errors={errors}
								valObj={{
									required: "Please enter confirm password",
									minLength: { value: 6, message: "Password too short" },
									validate: (val) => {
										if (watch("password") != val) {
											return "Your passwords do no match";
										}
									},
								}}
								label={"Confirm Password"}
								className={"bg-transparent border"}
							/>
							{errors.c_password && (
								<p className="text-red-400 text-sm">
									{errors.c_password.message}
								</p>
							)}
						</div>

						<div className="">
							<Button label={"Send"} onClick={handleSubmit(onSubmit)} />
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
