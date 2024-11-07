<?php

namespace App\Services;

use App\Exceptions\NotFoundException;
use App\Http\Resources\PropertyCollection;
use App\Repository\PropertyRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Log;

class PropertyService
{
  protected $propertyRepo;
  public function __construct(PropertyRepository $propertyRepo)
  {
    $this->propertyRepo = $propertyRepo;
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
}
