<?php

namespace App\Services;

use App\Http\Resources\UserCollection;
use App\Http\Resources\UserResource;
use App\Repository\PropertyRepository;
use App\Repository\UserRepository;

class AdminUserService
{
  protected $userRepo;
  protected $propertyRepo;
  protected $userService;

  public function __construct(
    UserRepository $userRepo,
    PropertyRepository $propertyRepo,
    UserServices $userService
  ) {
    $this->userRepo = $userRepo;
    $this->propertyRepo = $propertyRepo;
    $this->userService = $userService;
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

  public function userDetails($user_id){
    return $this->userService->getUserDetails($user_id);
  }

  public function blockUser() {}
  public function deleteUser() {}
}
