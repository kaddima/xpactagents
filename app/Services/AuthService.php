<?php

namespace App\Services;

use App\Exceptions\NotFoundException;
use App\Http\Resources\PropertyCollection;
use App\Http\Resources\PropertyResource;
use App\Http\Resources\UserResource;
use App\Repository\PasswordResetRepository;
use App\Repository\UserRepository;
use Carbon\Carbon;
use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use stdClass;

class AuthService
{
  use HelperServices, EmailService;

  protected $userRepository;
  protected $passwordResetRepo;

  public function __construct(
    UserRepository $userRepository,
    PasswordResetRepository $passwordResetRepo
  ) {
    $this->userRepository = $userRepository;
    $this->passwordResetRepo = $passwordResetRepo;
  }

  /**
   * Creates a new user acount
   * 
   */
  public function register($data)
  {
    $token = $this->generateOTP();

    // Prepare data for user creation
    $column_value = [
      'email' => $this->normalizeEmail($data['email']),
      'password' => Hash::make($data['password']), // Hash the password
      'activation_code' => Hash::make($token),
      'otp_expires_at' => Carbon::now()->addMinutes(env('TOKEN_EXP'))
    ];

    if ($data['reg_type'] == 'user') {
      $column_value['first_name'] = $data['first_name'];
      $column_value['last_name'] = $data['last_name'];
      $column_value['phone'] = $data['phone'];
    } else {
      $column_value['is_agent'] = 1;
    }
    // Create the user
    $this->userRepository->create($column_value);

    $mail_data = new \stdClass;
    $mail_data->email = $data['email'];
    $mail_data->token = $token;

    //send email
    $this->sendOTPEmailVerification($mail_data);
  }

  /**
   * Generates new otp for the account
   */
  public function resendOTPEmail($data)
  {
    $token = $this->generateOTP();
    $email = $this->normalizeEmail($data["email"]);

    // Check if the user exists
    $user = $this->userRepository->findByEmail($email);
    if (!$user) {
      throw new NotFoundException("User not found: Email not associated with an account");
    }

    $this->userRepository->updateByEmail(
      $email,
      [
        'activation_code' => Hash::make($token),
        "otp_expires_at" => Carbon::now()->addMinutes(env('TOKEN_EXP'))
      ]
    );

    $mail_data = new \stdClass;
    $mail_data->email = $email;
    $mail_data->token = $token;

    //send email
    $this->sendOTPEmailVerification($mail_data);
  }

  /**
   * Verifies the email using the provide token
   */
  public function verifyEmailOTP(array $data, $platform = "api")
  {
    $user = $this->userRepository->findByEmail($this->normalizeEmail($data['email']));

    if (
      !$user ||
      !Hash::check($data['otp'], $user->activation_code) ||
      Carbon::now()->greaterThan($user->otp_expires_at)
    ) {
      throw ValidationException::withMessages(["email_verification" => "Invalid or expired token."]);
    }

    $user->email_verified_at = now();
    $user->email_verify = 1; // Clear the token
    $user->otp_expires_at = null; // Clear the expiration
    $user->activation_code = null; // Clear the expiration
    $user->save();

    if ($platform == "api") {
      return $user->createToken("api_access_token")->plainTextToken;
    }

    Auth::login($user, true);
    return [
      'user' => new UserResource($user),
      'is_agent' => $user->is_agent
    ];
  }

  /**
   * Handles login functionalities for the api
   */
  public function login($data, $platform = "api", $request = null)
  {
    $email = $this->normalizeEmail($data["email"]);
    $user = $this->userRepository->findByEmail($email);

    if (!$user || !Hash::check($data['password'], $user->password)) {
      throw new AuthenticationException("Invalid username or password");
    }

    if ($user->block == 1) {
      throw new AuthenticationException("This account has been suspended.");
    }

    // Handle platform-specific login
    if ($platform == "api") {
      return $user->createToken('api_access_token')->plainTextToken;
    }

    // Handle web login
    if ($platform == "web" && Auth::attempt($data, true)) {
      // Ensure session is regenerated to prevent session fixation
      if ($request) {
        $request->session()->regenerate();
      }
      return [
        'userInfo' => Auth::user(),
        'favorites' => PropertyResource::collection($user->favorites)
      ];
    }

    // Throw an exception for unexpected platform values
    throw new AuthenticationException("Invalid login platform.");
  }

  public function webLogout($request)
  {
    Auth::logout();
    $request->session()->invalidate();
    // regenerate CSRF token
    $request->session()->regenerateToken();
  }


  public function sendPasswordResetToken($data, $platform = "api")
  {
    //get the user
    $email = $this->normalizeEmail($data["email"]);
    $user = $this->userRepository->findByEmail($email);
    if (!$user) {
      throw new NotFoundException("Invalid email address");
    }
    //generate token
    $token = $this->generateOTP();
    $hashToken = Hash::make($token);

    try {
      $email_data = new stdClass;
      $email_data->email = $user->email;
      $email_data->token = $platform == "api" ? $token : $hashToken;

      //send password reset token mail
      $this->sendPasswordResetTokenMail($email_data, $platform);

      $this->passwordResetRepo->create(
        [
          "token" => $hashToken,
          "email" => $user->email,
          "token_expires_at" => Carbon::now()->addMinutes(env('TOKEN_EXP'))
        ]
      );
    } catch (Exception $e) {
      throw $e;
    }

    return $email;
  }

  public function resetPassword($data, $platform = "api")
  {
    if ($platform === "api") {
      $this->apiPasswordReset($data);
    } else {
      $this->webPasswordReset($data);
    }
  }

  public function apiPasswordReset($data)
  {
    $email = $this->normalizeEmail($data["email"]);
    $user = $this->userRepository->findByEmail($email);
    if (!$user) {
      throw new NotFoundException("Invalid email address");
    }

    $passwordReset = $this->passwordResetRepo->findByEmail($user->email);

    if (
      !$passwordReset ||
      !Hash::check($data['token'], $passwordReset->token) ||
      Carbon::now()->greaterThan($passwordReset->token_expires_at)
    ) {
      throw ValidationException::withMessages(["Password_reset" => "Invalid or expired token."]);
    }

    $passwordReset->delete();

    $user->password = $data['password'];
    $user->save();
  }

  public function webPasswordReset($data)
  {
    $passwordReset = $this->passwordResetRepo->getQuery()->where("token", $data["token"])->first();

    if (
      !$passwordReset ||
      $data['token'] !== $passwordReset->token ||
      Carbon::now()->greaterThan($passwordReset->token_expires_at)
    ) {
      throw ValidationException::withMessages(["Password_reset" => "Invalid or expired token."]);
    }

    $email = $this->normalizeEmail($passwordReset->email);
    $user = $this->userRepository->findByEmail($email);
    if (!$user) {
      throw new NotFoundException("Invalid email address");
    }

    $passwordReset->delete();

    $user->password = $data['password'];
    $user->save();
  }

  /**
   * Helps to verify if the user is signed in
   */
  public function verifyAuthentication()
  {
    $currentUser = Auth::user();
    if (Auth::check() && Auth::viaRemember()) {
      if ($currentUser->is_agent == 1) {
        return ['redirect' => true];
      } else {
        return [
          "userInfo" => $currentUser ?? [],
          "favorites" => $currentUser ? PropertyResource::collection($currentUser->favorites) : []
        ];
      }
    }

    if (Auth::check()) {
      if ($currentUser->is_agent == 1) {
        return ['redirect' => true];
      } else {
        return [
          "userInfo" => $currentUser ?? [],
          "favorites" => $currentUser ? PropertyResource::collection($currentUser->favorites) : []
        ];
      }
    }

    return [
      "userInfo" => [],
      "favorites" => []
    ];
  }
}
