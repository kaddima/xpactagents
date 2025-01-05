<?php

namespace App\Services;

use App\Http\Resources\UserResource;
use App\Repository\PropertyRepository;
use App\Repository\UserRepository;

class AdminUserService
{
  protected $userRepo;
  protected $propertyRepo;

  public function __construct(
    UserRepository $userRepo,
    PropertyRepository $propertyRepo
  ) {
    $this->userRepo = $userRepo;
    $this->propertyRepo = $propertyRepo;
  }

  public function userOverviewData(){
    $obj = $this->userRepo->userCountData();
    $obj->latestUsers = UserResource::collection($this->userRepo
    ->getQuery()
    ->where("is_admin", 0)
    ->latest("created_at")
    ->limit(6)
    ->get());

    return $obj;
  }
  public function blockUser(){}
  public function deleteUser(){}

}
