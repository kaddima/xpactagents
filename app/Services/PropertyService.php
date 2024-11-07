<?php

namespace App\Services;

use App\Http\Resources\PropertyCollection;
use App\Repository\PropertyRepository;
use Illuminate\Support\Facades\Log;

class PropertyService
{
  protected $propertyRepo;
  public function __construct(PropertyRepository $propertyRepo)
  {
    $this->propertyRepo = $propertyRepo;
  }

  public function getProperties($filters=[],$includeUnpublished=false,$agentId=null)
  {
    //create a query builder for the propertyModel
    $query = $this->propertyRepo->getQuery();
    
    /**
     * Use the model Local scope (scopeFilter, scopePublished, 
     * scopeagentLitings) for query filtering 
     */
    if($includeUnpublished){
      $query = $query->filter($filters);
    }else{
      $query = $query->published()->filter($filters);
    }

    if($agentId){
      $query = $query->agentProperty($agentId);
    }
    // Handle pagination
    $perPage = isset($filters['limit']) ? (int)$filters['limit'] : 25; // Default to 25
    $page = isset($filters['page']) ? (int)$filters['page'] : 1; // Default to page 1
    
    return new PropertyCollection($query->paginate($perPage, ['*'], 'page', $page));
  }

  public function create(array $data, $currentUser){
    $data['creator_id'] = $currentUser->id;
    $model = $this->propertyRepo->create($data);
    return $model->id;
  }
}
