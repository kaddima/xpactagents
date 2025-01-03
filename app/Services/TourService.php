<?php

namespace App\Services;

use App\Exceptions\AlreadyExistsException;
use App\Exceptions\NotFoundException;
use App\Http\Resources\TourCollection;
use App\Mail\TourCreationMail;
use App\Repository\PropertyRepository;
use App\Repository\TourRepository;
use Exception;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TourService
{
  use EmailService;

  protected $propertyRepo;
  protected $tourRepo;

  public function __construct(
    PropertyRepository $propertyRepo,
    TourRepository $tourRepo
  ) {
    $this->propertyRepo = $propertyRepo;
    $this->tourRepo = $tourRepo;
  }

  public function checkTourOwnership($tour_id, $currentUser)
  {
    try {
      $tour = $this->tourRepo->findById($tour_id);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("Tour not found");
    }

    //true if current user is admin or is the agent associated 
    //with the tour

    if ($tour->agent_id != $currentUser->id && $currentUser->is_admin != 1) {
      throw new AuthorizationException("Authorization error: Cannot access this tour");
    }

    return $tour;
  }

  public function storeNewTour($data)
  {
    try{
      $property = $this->propertyRepo->findById($data['property_id']);
    }catch(ModelNotFoundException $e){
      throw new NotFoundException("invalid property id");
    }

    if($property->published != 1){
      throw new AuthorizationException("Property not published");
    }

    $tour = $this->tourRepo->getQuery()
      ->where([
        ['email', '=', $data['email']],
        ['property_id', '=', $data['property_id']]
      ])
      ->first();

    //if a tour exists that hasn't been resolve throw exception
    if ($tour && $tour->resolved == 0) {
      throw new AlreadyExistsException("Tour already exist for this property");
    }

    //add the agent id
    $data["agent_id"] = $property->creator_id;
    $tour = $this->tourRepo->create($data);

    try{
      $this->sendTourCreationEmail($tour);
    }catch(Exception $e){
    }
    
  }

  public function getAgentTours($agent_id, $filter = [])
  {
    $query = $this->tourRepo->getQuery();
    if (isset($filter['type']) && $filter['type'] == 'resolved') {
      $query = $query->resolved();
    }

    if (isset($filter['type']) && $filter['type'] == 'unresolved') {
      $query = $query->unresolved();
    }

    // Handle pagination
    $perPage = isset($filters['limit']) ? (int)$filters['limit'] : env("PAGINATE_NUMBER"); // Default to 25
    $page = isset($filters['page']) ? (int)$filters['page'] : 1; // Default to page 1

    $tours = $query->where("agent_id", $agent_id)
      ->paginate($perPage, ["*"], "page", $page);

    return new TourCollection($tours);
  }

  public function resolveTour($tour_id, $currentUser)
  {
    $tour = $this->checkTourOwnership($tour_id, $currentUser);
    $tour->resolved = 1;
    $tour->save();
  }
}
