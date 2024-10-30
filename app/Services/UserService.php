<?php

namespace App\Services;

use App\Models\User;

class UserService
{
  // Define your methods here
  public function getAllUsers($num_of_users=25){
    $users = User::all();
    return $users;
  }

  public function getUserByEmail($email){
    return User::where("email", $email)->first();
  }
}
