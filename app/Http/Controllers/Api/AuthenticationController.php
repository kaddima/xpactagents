<?php

namespace App\Http\Controllers\Api;

use App\Services\EmailService;
use App\Services\HelperServices;
use App\Services\UserService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use stdClass;

class AuthenticationController extends BaseController
{
	use HelperServices, EmailService;

	protected $userService;

	public function __construct(UserService $userService)
	{
		$this->userService = $userService;
	}

	public function register(Request $req)
	{
		$token = rand(100000, 999999);
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
			return $this->sendError($validator->errors());
		}

		// Determine registration type and adjust rules accordingly
		if ($req->input('reg_type') == 'user') {
			$rules['first_name'] = 'required';
			$rules['last_name'] = 'required';
			$rules['phone'] = 'required|min:11';
		}
		// Validate req
		$validator = Validator::make($formdata, $rules);
		if ($validator->fails()) {
			return $this->sendError($validator->errors());
		}

		// Prepare data for user creation
		$column_value = [
			'email' => $this->normalizeEmail($formdata['email']),
			'password' => Hash::make($formdata['password']), // Hash the password
			'activation_code' => Hash::make($token)
		];

		if ($req->input('reg_type') == 'user') {
			$column_value['first_name'] = $formdata['first_name'];
			$column_value['last_name'] = $formdata['last_name'];
			$column_value['phone'] = $formdata['phone'];
		} else {
			$column_value['is_agent'] = 1;
		}

		// Create the user
		$user = $this->userService->create($column_value);

		$mail_data = new stdClass;
		$mail_data->email = $req->email;
		$mail_data->token = $token;
		$mail_data->subject = "Email Verification";
		
		//send email
		$this->sendOTPEmailVerification($mail_data);

		return $this->sendResponse(['token' => $token],"Account created successfully");
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
			return $this->sendError($validator->errors());
		}

		$user = $this->userService->getUserByEmail(
			$this->normalizeEmail($req->get("email")));

		if ($user && Hash::check($req->input('password'), $user->password)) {
			$token = $user->createToken('api_access_token')->plainTextToken;
			return $this->sendResponse(['token' => $token,]);
		}
		return $this->sendError("Unauthorized");
	}

	/** Logout logic-- deletes user api token */
	public function logout(Request $req)
	{
		if (!$req->user()) {
			return $this->sendError("Unauthorized");
		}
		$req->user()->tokens()->delete();
		return $this->sendResponse(null,"logout successful");
	}
}
