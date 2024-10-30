<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\HelperServices;
use App\Services\UserService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthenticationController extends Controller
{
	use HelperServices;
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
			return response()->json(['errors' => $validator->errors()], 401);
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
			return response()->json(['errors' => $validator->errors()], 401);
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

		// Prepare email message
		$subject = 'Email Verification';
		$message = <<<EMAIL
					<div style="margin-top:10px">
							<h1 style="font-size:18px; font-weight:bold;">Confirm your registration</h1>
							<div style="margin-top:10px;">
									<p style="margin: 0;padding:0;">Welcome to Xpact Agent</p>
									<p style="margin: 0;padding:0;">Here is your account activation code</p>
							</div>
							<h1>$token</h1>
							<div>
									<h4>Security tips</h4>
									<ul style="padding-left: 20px;">
											<li>Never give your password to anyone</li>
											<li>Never call any phone number or personal details for anyone claiming to be XpactAgent support.</li>
									</ul>
							</div>
							<p style="font-size:13px;">This step is to ensure that your email address is not used without your consent. You can ignore this email if this was not triggered by you</p>
							<div style="color: rgb(129, 122, 122);">
									<p style="margin: 0;padding:0;">XpactAgent Team</p>
									<span>This is an automated message please do not reply</span>
							</div>
					</div>
EMAIL;

		// Mailer::sendMail($formdata['email'], $message, $subject, true);

		return response()->json(['data' => $column_value, 'token' => $token]);
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
			return response()->json(['errors' => $validator->errors()]);
		}

		$user = $this->userService->getUserByEmail(
			$this->normalizeEmail($req->get("email")));

		if ($user && Hash::check($req->input('password'), $user->password)) {
			$token = $user->createToken('api_access_token')->plainTextToken;
			return response()->json(['token' => $token,]);
		}
		return response()->json(['error' => "Unauthorized"], 401);
	}

	/** Logout logic-- deletes user api token */
	public function logout(Request $req)
	{
		if (!$req->user()) {
			return response()->json(["message" => "Unauthoriedddd"], 401);
		}
		$req->user()->tokens()->delete();
		return response()->json(['message' => "logout successful"]);
	}
}
