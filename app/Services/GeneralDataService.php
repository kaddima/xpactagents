<?php

namespace App\Services;

use App\Http\Resources\UserResource;
use App\Repository\PropertyRepository;
use App\Repository\UserRepository;

class GeneralDataService
{
  protected $propertyRepo;
  protected $userRepo;

  public function __construct(PropertyRepository $propertyRepo,
  UserRepository $userRepo)
  {
    $this->propertyRepo = $propertyRepo;
    $this->userRepo = $userRepo;
  }

  public function agentOverviewData($currentUser=null,$user_id=null)
  {
    if(!$currentUser){
      $currentUser = $this->userRepo->findById($user_id);
    }
    $obj = $this->propertyRepo
      ->getPropertyCounts($currentUser->id);
    $obj->unpublishedProperty = $this->propertyRepo
      ->getUnpublishedProperties($currentUser->id);
    $obj->unpublishedPropertyCount = $this->propertyRepo
      ->getUnpublishedPropertyCount($currentUser->id);

    return [
      "profile" => new UserResource($currentUser),
      "favorites" => $currentUser->favorites,
      "propertyDetails" => $obj
    ];
  }

  public function adminOverviewData($currentUser)
  {
    $obj = $this->propertyRepo->getPropertyCounts();
    $obj->unpublishedProperty = $this->propertyRepo->getUnpublishedProperties();
    $obj->unpublishedPropertyCount = $this->propertyRepo->getUnpublishedPropertyCount();

    return [
      "profile" => new UserResource($currentUser),
      "favorites" => $currentUser->favorites,
      "propertyDetails" => $obj
    ];
  }
}
