<?php

namespace App\Services;

trait HelperServices
{
  /**
   * Normalize email address for consistent storage
   * trims,remove www. 
   */
  public function normalizeEmail($email){
    $email = strtolower(trim($email));

    //remove variation of www
    $email = preg_replace('/^(w{1,4}\.)/i','',$email);

    //handle gmail specifics
    if(strpos($email, "@gmail.com")){
      list($username,$domain) = explode("@", $email);
      //remove the dot in the username ada.b@gmail.com
      $username = str_replace('.','',$username);
      //ignore anything after a plus sign
      $username = explode('+', $username)[0];
      $email = $username.'@'. $domain;
    }

    return $email;
  }

  public function generateOTP(){
    return rand(100000, 999999);
  }
}
