<?php

namespace App\Http\Controllers\Api;

use App\Services\EmailService;
use App\Services\HelperServices;
use App\Repository\UserRepository;
use App\Services\AuthService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use stdClass;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AuthenticationController extends BaseController
{
	protected $authService;

	public function __construct(AuthService $authService)
	{
		$this->authService = $authService;
	}

	public function register(Request $req)
	{
		$formdata = $req->all();

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

		// Validate the request
		$validator = Validator::make($formdata, $rules, $messages);
		if ($validator->fails()) {
			throw new ValidationException($validator);
		}

		// Determine registration type and adjust rules accordingly
		if ($req->input('reg_type') == 'user') {
			$rules['first_name'] = 'required';
			$rules['last_name'] = 'required';
			$rules['phone'] = 'required|min:11|regex:/^[0-9]+$/';
		}
		// Validate req
		$validator = Validator::make($formdata, $rules);
		if ($validator->fails()) {
			throw new ValidationException($validator);
		}
		$this->authService->register($validator->validated());

		return $this->sendResponse(null, "Account created successfully");
	}

	public function resendOTPEmail(Request $request)
	{
		$formdata = $request->all();
		$validator = Validator::make($formdata, ['email' => 'required|email']);

		if ($validator->fails()) {
			throw new ValidationException($validator);
		}
		$this->authService->resendOTPEmail($validator->validated());
		return $this->sendResponse(null, "OTP resent successfully");
	}


	/**
	 * Handles login functionalities for the api
	 */
	public function login(Request $req)
	{
		$validator = Validator::make($req->all(), [
			'email' => 'required|email',
			'password' => 'required',

		]);

		if ($validator->fails()) {
			Log::warning('Validation failed: ' . json_encode($validator->errors()));
			throw new ValidationException($validator);
		}
		$token = $this->authService->login($validator->validated());
		return $this->sendResponse(['token' => $token]);
	}

	/** Logout logic-- deletes user api token */
	public function logout(Request $req)
	{
		$req->user()->tokens()->delete();
		return $this->sendResponse(null, "logout successful");
	}
}
