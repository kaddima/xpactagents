<?php

namespace App\Services;

use App\Exceptions\NotFoundException;
use App\Http\Resources\ImageResource;
use App\Http\Resources\PropertyCollection;
use App\Http\Resources\PropertyResource;
use App\Repository\FavoriteRepositiory;
use App\Repository\PropertyImageRepo;
use App\Repository\PropertyRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;


class PropertyService
{
  protected $propertyRepo;
  protected $propertyImageRepo;
  protected $favoriteRepo;

  public function __construct(
    PropertyRepository $propertyRepo,
    PropertyImageRepo $propertyImageRepo,
    FavoriteRepositiory $favoriteRepo
  ) {
    $this->propertyRepo = $propertyRepo;
    $this->propertyImageRepo = $propertyImageRepo;
    $this->favoriteRepo = $favoriteRepo;
  }

  /**
   * Check if the property exists and if the current user is authorized to access it.
   *
   * @param string $propertyId
   * @param object $currentUser
   * @throws NotFoundException
   * @throws AuthorizationException
   */
  private function checkPropertyOwnership($propertyId, $currentUser)
  {
    try {
      // Try to find the property by ID
      $property = $this->propertyRepo->findById($propertyId);
    } catch (ModelNotFoundException $e) {
      // Property not found, throw NotFoundException
      throw new NotFoundException("Property not found");
    }
    // Check if the current user is the creator of the property or the user is an admin
    if ($property->creator_id !== $currentUser->id && $currentUser->is_admin != 1) {
      throw new AuthorizationException("You are not authorized to perform this action on this property");
    }

    return $property;
  }

  public function create(array $data, $currentUser)
  {
    $data['creator_id'] = $currentUser->id;
    $model = $this->propertyRepo->create($data);
    return $model->id;
  }

  public function getProperties($filters = [], $onlyPublishedProperty = true, $agentId = null)
  {
    //create a query builder for the propertyModel
    $query = $this->propertyRepo->getQuery();

    /**
     * Use the model Local scope (scopeFilter, scopePublished, 
     * scopeagentLitings) for query filtering 
     */
    if ($onlyPublishedProperty) {
      $query = $query->published()->filter($filters);
    } else {
      $query = $query->filter($filters);
    }

    if ($agentId) {
      $query = $query->agentProperty($agentId);
    }
    // Handle pagination
    $perPage = isset($filters['limit']) ? (int)$filters['limit'] : env("PAGINATE_NUMBER"); // Default to 25
    $page = isset($filters['page']) ? (int)$filters['page'] : 1; // Default to page 1

    $dataCollection = $query->paginate($perPage, ['*'], 'page', $page);
    return new PropertyCollection($dataCollection);
  }

  public function propertyDetails($property_id, $onlyPublishedProperty = true, $agentId = null)
  {
    $query = $this->propertyRepo->getQuery();

    if ($onlyPublishedProperty) {
      $query = $query->published();
    }

    if ($agentId) {
      $query = $query->agentProperty($agentId);
    }

    try {
      $property = $query->findOrFail($property_id);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("Property not found");
    }

    return new PropertyResource($property);
  }

  public function updateProperty($data, $property_id, $currentUser)
  {
    $property = $this->checkPropertyOwnership($property_id, $currentUser);
    $property->update($data);

    return $property;
  }

  public function uploadFile(UploadedFile $file, $property_id, $currentUser)
  {
    $property = $this->checkPropertyOwnership($property_id, $currentUser);

    $path = $file->store("{$currentUser->id}/{$property->id}");

    //save the path to the database
    $image = $this->propertyImageRepo->create(['property_id' => $property_id, "image_path" => $path]);
    return new ImageResource($image);
  }

  public function deletePropertyImage($data, $currentUser)
  {
    $this->checkPropertyOwnership($data['property_id'], $currentUser);

    $images = $this->propertyImageRepo->whereIn("id", $data['image_ids']);

    DB::transaction(function () use ($images) {
      foreach ($images as $image) {
        // Delete the image from storage
        Storage::disk('public')->delete($image->image_path);
        // Delete the image record from the database
        $image->delete();
      }
    });
  }

  public function addFavoriteProperty($property_id, $currentUser)
  {
    try {
      // Try to find the property by ID
      $property = $this->propertyRepo->findById($property_id);
    } catch (ModelNotFoundException $e) {
      // Property not found, throw NotFoundException
      throw new NotFoundException("Property not found");
    }

    if ($property->published == 0) {
      throw new AuthorizationException("Property is not published");
    }
    // Check if the property is already favorited by the current user
    if ($currentUser->favorites->contains($property)) {
      throw new AuthorizationException("This property is already in your favorites");
    }

    // Attach the property to the user's favorites list
    $currentUser->favorites()->attach($property_id);

    // Reload the favorites to ensure up-to-date data
    $currentUser->load('favorites'); // Reload the favorites relationship
    return $currentUser->favorites; // Return the fresh favorites collection
  }

  public function removeFavoriteProperty($property_id, $currentUser)
  {
    try {
      // Try to find the property by ID
      $property = $this->propertyRepo->findById($property_id);
    } catch (ModelNotFoundException $e) {
      // Property not found, throw NotFoundException
      throw new NotFoundException("Property not found");
    }

    // Check if the property is already favorited by the current user
    if (!$currentUser->favorites->contains($property)) {
      throw new AuthorizationException("This property is not in your favorites");
    }

    // detach the property from the user's favorites list
    $currentUser->favorites()->detach($property_id);

    // Reload the favorites to ensure up-to-date data
    $currentUser->load('favorites'); // Reload the favorites relationship
    return $currentUser->favorites; // Return the fresh favorites collection
  }

  public function getFavoriteProperties($currentUser, $filters = [])
  {
    $perPage = isset($filters['limit']) ? (int)$filters['limit'] : env("PAGINATE_NUMBER"); // Default to 25
    $page = isset($filters['page']) ? (int)$filters['page'] : 1; // Default to page 1

    $properties = $currentUser->favorites()->paginate($perPage);
    return new PropertyCollection($properties);
  }

  public function deleteProperty($property_id, $currentUser)
  {
    $property = $this->checkPropertyOwnership($property_id, $currentUser);

    foreach ($property->propertyImages as $image) {

      if (Storage::exists($image->image_path)) {
        Storage::disk('public')->delete($image->image_path);
      }
      $image->delete();
    }

    $property->favorites()->detach();
    $property->conversations->map(function($conversation){
     $conversation->delete();
    });
    $property->agentConversations()->delete();

    $property->delete();
  }

  public function getPropertyImages($property_id)
  {
    try {
      $property = $this->propertyRepo->findById($property_id);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException('Invalid property ID: Property not found');
    }

    return ImageResource::collection($property->propertyImages);
  }
}
