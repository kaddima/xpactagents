<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Api\AuthenticationController as ApiAuthenticationController;
use App\Http\Controllers\BaseController;
use App\Rules\ValidationRules;
use App\Services\AuthService;
use Illuminate\Http\Request;

class AuthenticationController extends BaseController
{
	protected $authService;
	protected $apiController;

	public function __construct(AuthService $authService, 
	ApiAuthenticationController $apiController)
	{
		$this->authService = $authService;
		$this->apiController = $apiController;
	}

	public function register(Request $request)
	{
		return $this->apiController->register($request);
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

		$data = $this->authService->verifyEmailOTP($data, "web");
		return $this->sendResponse($data, "email verified successfully");
	}

	/**
	 * Handles login functionalities for the api
	 */
	public function login(Request $request)
	{
		$data = $this->validate($request, ValidationRules::loginRules());
		$result = $this->authService->login($data,"web", $request);
		return $this->sendResponse($result);
	}

	/** Logout logic-- deletes user api token */
	public function logout(Request $request)
	{
		$this->authService->webLogout($request);
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
		return $this->sendResponse(null, "Password Reset successful");
	}
}
