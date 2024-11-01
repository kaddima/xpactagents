<?php

namespace App\Services;

use App\Exceptions\NotFoundException;
use App\Repository\UserRepository;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Hash;

class AuthService
{
  use HelperServices, EmailService;

  protected $userRepository;

  public function __construct(UserRepository $userRepository)
  {
    $this->userRepository = $userRepository;
  }

  public function register($data)
  {
    $token = $this->generateOTP();

    // Prepare data for user creation
    $column_value = [
      'email' => $this->normalizeEmail($data['email']),
      'password' => Hash::make($data['password']), // Hash the password
      'activation_code' => Hash::make($token)
    ];

    if ($data['reg_type'] == 'user') {
      $column_value['first_name'] = $data['first_name'];
      $column_value['last_name'] = $data['last_name'];
      $column_value['phone'] = $data['phone'];
    } else {
      $column_value['is_agent'] = 1;
    }
    // Create the user
    //$this->userRepository->create($data);

    $mail_data = new \stdClass;
    $mail_data->email = $data['email'];
    $mail_data->token = $token;
    $mail_data->subject = "Email Verification";

    //send email
    $this->sendOTPEmailVerification($mail_data);
  }

  public function resendOTPEmail($data)
  {
    $token = $this->generateOTP();

    // Check if the user exists
		$user = $this->userRepository->findByEmail($this->normalizeEmail($data["email"]));
		if (!$user) {
			throw new NotFoundException("User not found: Email not associated with an account");
		}

    $this->userRepository->updateByEmail(
			$this->normalizeEmail($data["email"]),
			['activation_code' => Hash::make($token)]
		);

    $mail_data = new \stdClass;
    $mail_data->email = $data['email'];
    $mail_data->token = $token;
    $mail_data->subject = "Email Verification";

    //send email
    $this->sendOTPEmailVerification($mail_data);
  }

  	/**
	 * Handles login functionalities for the api
	 */
	public function login($data)
	{
		$user = $this->userRepository->findByEmail(
			$this->normalizeEmail($data["email"])
		);

		if ($user && Hash::check($data['password'], $user->password)) {
			return $user->createToken('api_access_token')->plainTextToken;
		}
		throw new AuthenticationException("Invalid username or password");
	}

}
