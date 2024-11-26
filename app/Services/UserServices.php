<?php

namespace App\Services;

use App\Exceptions\NotFoundException;
use App\Http\Resources\UserResource;
use App\Repository\UserRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserServices
{
  protected $userRepository;

  public function __construct(UserRepository $userRepository)
  {
    $this->userRepository = $userRepository;
  }

  public function getuserDetails($user_id, $currentUser = null)
  {
    if ($currentUser) {
      return new UserResource($currentUser);
    }

    try {
      $userDetails = $this->userRepository->findById($user_id);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("User not found");
    }

    return new UserResource($userDetails);
  }

  public function changePassword($data, $currentUser)
  {
    //check if old password is correct
    if (!Hash::check($data['old_password'], $currentUser->password)) {
      throw new AuthorizationException("Old password is wrong");
    }

    $this->userRepository->update(
      $currentUser->id,
      ['password' => Hash::make($data['new_password'])]
    );
  }

  public function uploadUserImage(UploadedFile $file, $currentUser)
  {
    //check if the user already has an image uploaded
    if (
      $currentUser->photo &&
      Storage::disk('public')->exists($currentUser->photo)
    ) {
      Storage::disk("public")->delete($currentUser->photo);
    }

    $path = $file->store("{$currentUser->id}/profile");
    $currentUser->photo = $path;

    $currentUser->save();
    // if uploaded delete that image and upload a new one
  }
}
