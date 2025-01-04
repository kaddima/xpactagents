<?php

namespace App\Services;

use App\Http\Resources\UserResource;
use App\Repository\PropertyRepository;

class GeneralDataService
{
  protected $propertyRepo;

  public function __construct(PropertyRepository $propertyRepo)
  {
    $this->propertyRepo = $propertyRepo;
  }

  public function agentOverviewData($currentUser)
  {
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
