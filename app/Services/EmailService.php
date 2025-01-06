<?php

namespace App\Services;

use App\Mail\IdVerifcationAcceptanceMail;
use App\Mail\IdVerifcationDeclineMail;
use App\Mail\OTPEmailVerification;
use App\Mail\PasswordResetMail;
use App\Mail\TourCreationMail;
use Illuminate\Support\Facades\Mail;

trait EmailService
{
  public function sendOTPEmailVerification($email_data){
    Mail::to($email_data->email)->send(new OTPEmailVerification($email_data));
  }

  public function sendPasswordResetTokenMail($email_data, $platform = 'api'){
    Mail::to($email_data->email)->send(new PasswordResetMail($email_data, $platform));
  }

  public function sendTourCreationEmail($email_data){
    Mail::to($email_data->email)->send(new TourCreationMail($email_data));
  }

  public function sendIdVerificationApprovalEmail($email_data){
    Mail::to($email_data->email)->send(new IdVerifcationAcceptanceMail($email_data));
  }

  public function sendIdVerificationDeclineEmail($email_data){
    Mail::to($email_data->email)->send(new IdVerifcationDeclineMail($email_data));
  }
  
}
