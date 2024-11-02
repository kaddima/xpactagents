<?php

namespace App\Services;

use App\Mail\OTPEmailVerification;
use App\Mail\PasswordResetMail;
use Illuminate\Support\Facades\Mail;

trait EmailService
{
  public function sendOTPEmailVerification($email_data){
    Mail::to($email_data->email)->send(new OTPEmailVerification($email_data));
  }

  public function sendPasswordResetTokenMail($email_data){
    Mail::to($email_data->email)->send(new PasswordResetMail($email_data));
  }
  
}
