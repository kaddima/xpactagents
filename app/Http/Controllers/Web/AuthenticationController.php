<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\BaseController;
use App\Rules\ValidationRules;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthenticationController extends BaseController
{
	protected $authService;

	public function __construct(AuthService $authService)
	{
		$this->authService = $authService;
	}

	public function register(Request $req)
	{
		// Define custom messages
		$messages = [
			'reg_type.required' => 'The registration type is required. Please specify either user or agent.',
			'reg_type.in' => 'The registration type must be either user or agent.'
		];

		$data = $this->validate($req, ValidationRules::registrationRules(), $messages);

		// Determine registration type and adjust rules accordingly
		if ($req->input('reg_type') == 'user') {
			$data = $this->validate($req, ValidationRules::registrationRules(true), $messages);
		}

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
		$data = $this->validate($req, ValidationRules::loginRules());
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
		$email = $this->authService->sendPasswordResetToken($data, "web");
		return $this->sendResponse(['email' => $email], "Password reset code sent to email");
	}

	public function resetpassword(Request $request)
	{
		$data = $this->validate($request, ValidationRules::resetPasswordRules("web"));
		$this->authService->resetPassword($data,"web");
		return $this->sendResponse(null, "Password changed successfully");
	}
}
