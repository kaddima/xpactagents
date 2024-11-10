<?php

namespace App\Services;

use App\Exceptions\NotFoundException;
use App\Http\Resources\PropertyCollection;
use App\Repository\PropertyImageRepo;
use App\Repository\PropertyRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\UploadedFile;

class PropertyService
{
  protected $propertyRepo;
  protected $propertyImageRepo;
  public function __construct(PropertyRepository $propertyRepo,
   PropertyImageRepo $propertyImageRepo)
  {
    $this->propertyRepo = $propertyRepo;
    $this->propertyImageRepo = $propertyImageRepo;
  }

  public function create(array $data, $currentUser)
  {
    $data['creator_id'] = $currentUser->id;
    $model = $this->propertyRepo->create($data);
    return $model->id;
  }

  public function getProperties($filters = [], $includeUnpublished = false, $agentId = null)
  {
    //create a query builder for the propertyModel
    $query = $this->propertyRepo->getQuery();

    /**
     * Use the model Local scope (scopeFilter, scopePublished, 
     * scopeagentLitings) for query filtering 
     */
    if ($includeUnpublished) {
      $query = $query->filter($filters);
    } else {
      $query = $query->published()->filter($filters);
    }

    if ($agentId) {
      $query = $query->agentProperty($agentId);
    }
    // Handle pagination
    $perPage = isset($filters['limit']) ? (int)$filters['limit'] : 25; // Default to 25
    $page = isset($filters['page']) ? (int)$filters['page'] : 1; // Default to page 1

    return new PropertyCollection($query->paginate($perPage, ['*'], 'page', $page));
  }

  public function updateProperty($data, $currentUser)
  {
    try {
      // The findById method will automatically throw an exception if the property is not found
      $property = $this->propertyRepo->findById($data["id"]);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("Property not found");
    }
    if ($property->creator_id !== $currentUser->id) {
      throw new AuthorizationException("You are not authorized to update this property");
    }
    $property->update($data);

    return $property;
  }

  public function uploadFile(UploadedFile $file, $property_id, $currentUser)
  {
    try {
      // The findById method will automatically throw an exception if the property is not found
      $property = $this->propertyRepo->findById($property_id);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("Property not found");
    }
    if ($property->creator_id !== $currentUser->id) {
      throw new AuthorizationException("You are not authorized to update this property");
    }

    $path = $file->store("{$currentUser->id}/{$property->id}");

    //save the path to the database
    $this->propertyImageRepo->create(['property_id'=>$property_id, "image_path"=>$path]);
    return $path;
  }
}
