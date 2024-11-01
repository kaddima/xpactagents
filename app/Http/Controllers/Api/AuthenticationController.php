<?php

namespace App\Http\Controllers\Api;

use App\Services\EmailService;
use App\Services\HelperServices;
use App\Repository\UserRepository;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use stdClass;

class AuthenticationController extends BaseController
{
	use HelperServices, EmailService;

	protected $userRepository;

	public function __construct(UserRepository $userRepository)
	{
		$this->userRepository = $userRepository;
	}

	public function register(Request $req)
	{
		$token = $this->generateOTP();
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
			$rules['phone'] = 'required|min:11|regex:/^[0-9]+$/';
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
		$this->userRepository->create($column_value);

		$mail_data = new stdClass;
		$mail_data->email = $req->email;
		$mail_data->token = $token;
		$mail_data->subject = "Email Verification";

		//send email
		$this->sendOTPEmailVerification($mail_data);

		return $this->sendResponse(['token' => $token], "Account created successfully");
	}

	public function resendOTPEmail(Request $request)
	{
		$token = $this->generateOTP();

		$formdata = $request->all();
		$validator = Validator::make($formdata, ['email' => 'required|email']);

		if ($validator->fails()) {
			return $this->sendError($validator->errors());
		}

		// Check if the user exists
		$user = $this->userRepository->findByEmail($this->normalizeEmail($formdata["email"]));
		if (!$user) {
			return $this->sendError(['email' => 'No account found with this email address.'], 404);
		}


		$this->userRepository->updateByEmail(
			$this->normalizeEmail($formdata["email"]),
			['activation_code' => Hash::make($token)]
		);

		$mail_data = new stdClass;
		$mail_data->email = $request->email;
		$mail_data->token = $token;
		$mail_data->subject = "Email Verification";

		// Send email and handle exceptions
		try {
			$this->sendOTPEmailVerification($mail_data);
		} catch (\Exception $e) {
			return $this->sendError(['email' => 'Failed to send verification email. Please try again.'], 500);
		}

		return $this->sendResponse(['token' => $token], "OTP resent successfully");
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

		$user = $this->userRepository->findByEmail(
			$this->normalizeEmail($req->get("email"))
		);

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
		return $this->sendResponse(null, "logout successful");
	}
}
