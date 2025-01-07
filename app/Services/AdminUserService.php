<?php

namespace App\Services;

use App\Exceptions\AlreadyExistsException;
use App\Exceptions\NotFoundException;
use App\Http\Resources\IdVerificationCollection;
use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Repository\IdverifyRepository;
use App\Repository\PropertyRepository;
use App\Repository\UserRepository;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use stdClass;

class AdminUserService
{
  use EmailService;
  protected $idVerifyRepo;
  protected $userRepo;
  protected $propertyRepo;
  protected $userService;

  public function __construct(
    IdverifyRepository $idVerifyRepo,
    UserRepository $userRepo,
    PropertyRepository $propertyRepo,
    UserServices $userService
  ) {
    $this->userRepo = $userRepo;
    $this->propertyRepo = $propertyRepo;
    $this->userService = $userService;
    $this->idVerifyRepo = $idVerifyRepo;
  }

  public function userOverviewData()
  {
    $obj = $this->userRepo->userCountData();
    $obj->latestUsers = UserResource::collection($this->userRepo
      ->getQuery()
      ->where("is_admin", 0)
      ->latest("created_at")
      ->limit(6)
      ->get());

    return $obj;
  }

  public function userSearch($filters = [])
  {
    $query = $this->userRepo->getQuery();

    switch ($filters['search_type']) {
      case "agent":
        $query = $query->agent();
        break;
      case "admin":
        $query = $query->admin();
        break;

      default:
        $query = $query->user();
        break;
    }

    $query->filter($filters);

    $perPage = isset($filters['limit']) ? (int)$filters['limit'] : env("PAGINATE_NUMBER"); // Default to 25
    $userCollection = $query->paginate($perPage);

    return new UserCollection($userCollection);
  }

  public function getusers($data)
  {
    $query = $this->userRepo->getQuery();

    switch ($data['type']) {
      case "agent":
        $query = $query->agent();
        break;
      case "admin":
        $query = $query->admin();
        break;

      default:
        $query = $query->user();
        break;
    }

    $perPage = isset($filters['limit']) ? (int)$filters['limit'] : env("PAGINATE_NUMBER"); // Default to 25
    $userCollection = $query->paginate($perPage);
    return new UserCollection($userCollection);
  }

  public function userDetails($user_id)
  {
    return $this->userService->getUserDetails($user_id);
  }

  public function getAllVerificationRequests()
  {
    $verifyRequests = $this->idVerifyRepo->getQuery()
      ->where("status", 0)
      ->paginate(env("PAGINATE_NUMBER"));

    return new IdVerificationCollection($verifyRequests);
  }

  public function idVerifcationAccept($data)
  {
    try {
      $req = $this->idVerifyRepo
        ->getQuery()
        ->where(["user_id" => $data["user_id"], "status" => 0])
        ->first();
      if (!$req) {
        throw new ModelNotFoundException();
      }
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("No verification request");
    }

    try {
      $this->userRepo->update($data["user_id"], ["id_verified" => 1]);
      $req->status = 1;
      $req->save();

      $email_data = new stdClass();
      $email_data->email = $data["email"];
      $email_data->fullname = $req->fullname;

      $this->sendIdVerificationApprovalEmail($email_data);
    } catch (Exception $e) {
    }
  }

  public function idVerifcationDecline($data)
  {
    try {
      $req = $this->idVerifyRepo
        ->getQuery()
        ->where(["user_id" => $data["user_id"], "status" => 0])
        ->first();
      if (!$req) {
        throw new ModelNotFoundException();
      }
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("No verification request");
    }

    // Delete the image from storage
    if (Storage::disk('public')->exists($req->image)) {
      // Delete the image from storage
      Storage::disk('public')->delete($req->image);
    }

    $email_data = new stdClass();
    $email_data->email = $data["email"];
    $email_data->fullname = $req->fullname;
    try {
      $this->sendIdVerificationDeclineEmail($email_data);
    } catch (Exception $e) {
    }

    //delete the request
    $req->delete();
  }

  public function deleteAnyUser($type, $user_id)
  {
    switch ($type) {
      case 'agent':
        $this->deleteAgent($user_id);
        break;
      case 'user':
        $this->deleteUser($user_id);
        break;

      default:
        # code...
        break;
    }
  }
  public function deleteAgent($user_id)
  {
    try {
      $user = $this->userRepo->findById($user_id);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("User not found");
    }

    if (Storage::exists($user->id)) {
      Storage::disk('public')->deleteDirectory($user_id);
    }

    // delete conversation and messages
    $user->agentConversations->map(function ($agentConversation) {
      $agentConversation->conversation()->delete();
    });

    $user->favorites()->delete();
    $user->tours()->delete();
    $user->properties()->delete();
    $user->delete();
  }

  public function deleteUser($user_id)
  {
    try {
      $user = $this->userRepo->findById($user_id);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("User not found");
    }
    // delete conversation and messages
    $user->conversations->map(function ($conversation) {
      $conversation->delete();
    });

    $user->favorites()->delete();
    $user->delete();
  }

  public function blockUser($user_id)
  {
    try {
      $user = $this->userRepo->findById($user_id);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("User not found");
    }

    if ($user->block == 1) {
      throw new AlreadyExistsException("User is already blocked");
    }

    if ($user->is_agent == 1) {
      $user->properties()->update(["published" => 0]);
    }

    $user->block = 1;
    $user->save();
  }

  public function unblockUser($user_id)
  {
    try {
      $user = $this->userRepo->findById($user_id);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("User not found");
    }

    if ($user->block == 0) {
      throw new AlreadyExistsException("User is already unblocked");
    }

    if ($user->is_agent == 1) {
      $user->properties()->update(["published" => 1]);
    }

    $user->block = 0;
    $user->save();
  }
}
