<?php

namespace App\Http\Controllers\Api;

use App\Services\AuthService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

use Illuminate\Validation\ValidationException;

class AuthenticationController extends BaseController
{
	protected $authService;

	public function __construct(AuthService $authService)
	{
		$this->authService = $authService;
	}

	public function register(Request $req)
	{
		// Define validation rules
		$rules = [
			'email' => 'required|email|unique:users',
			'password' => 'required|min:6',
			'confirm_password' => 'required|same:password',
			'reg_type' => 'required|in:user,agent'
		];

		// Define custom messages
		$messages = [
			'reg_type.required' => 'The registration type is required. Please specify either user or agent.',
			'reg_type.in' => 'The registration type must be either user or agent.'
		];

		$data = $this->validate($req, $rules, $messages);

		// Determine registration type and adjust rules accordingly
		if ($req->input('reg_type') == 'user') {
			$rules['first_name'] = 'required';
			$rules['last_name'] = 'required';
			$rules['phone'] = 'required|min:11|regex:/^[0-9]+$/';
		}
		$data = $this->validate($req, $rules, $messages);

		$this->authService->register($data);

		return $this->sendResponse(null, "Account created successfully");
	}


	public function resendOTPEmail(Request $request)
	{
		$data = $this->validate($request, ['email' => 'required|email']);
		$this->authService->resendOTPEmail($data);

		return $this->sendResponse(null, "OTP resent successfully");
	}

	public function verifyEmail(Request $request)
	{

		$data = $this->validate(
			$request,
			["email" => "required|email", "otp" => "required|digits:6"]
		);

		$token = $this->authService->verifyEmailOTP($data);
		return $this->sendResponse(["token" => $token], "email verified successfully");
	}

	/**
	 * Handles login functionalities for the api
	 */
	public function login(Request $req)
	{
		$data = $this->validate($req, [
			'email' => 'required|email',
			'password' => 'required',

		]);
		$token = $this->authService->login($data);
		return $this->sendResponse(['token' => $token]);
	}

	/** Logout logic-- deletes user api token */
	public function logout(Request $req)
	{
		$req->user()->tokens()->delete();
		return $this->sendResponse(null, "logout successful");
	}

	public function sendPasswordResetToken(Request $request)
	{
		$data = $this->validate($request, ["email" => "required|email"]);
		$email = $this->authService->sendPasswordResetToken($data);

		return $this->sendResponse(['email'=>$email],"Password reset code sent to email");

	}

	public function resetpassword(Request $request){
		$rules = ["email"=>"required|email",
		"token"=>"required|digits:6",
		"password"=>"required|min:6",
		"confirm_password"=>"required|same:password"];

		$data = $this->validate($request, $rules);
		$this->authService->resetPassword($data);
		return $this->sendResponse(null, "Password changed successfully");
	}
	
}
