<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\PropertyController;
use App\Rules\ValidationRules;
use App\Services\PropertyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ListingController extends BaseController
{
	protected $propertyService;
	protected $apiController;

	public function __construct(PropertyService $propertyService, PropertyController $apiController)
	{
		$this->propertyService = $propertyService;
		$this->apiController = $apiController;
	}

	//Create new property
	public function createProperty(Request $request)
	{
		return $this->apiController->create($request);
	}

	public function getProperties(Request $request)
	{
		return $this->apiController->getProperties($request);
	}

	public function propertyDetails(Request $request, $id)
	{
		return $this->apiController->getPropertyDetails($request, $id);
	}

	public function updateProperty(Request $request, $id)
	{
		return $this->apiController->updateProperty($request, $id);
	}

	public function publishProperty(Request $request, $id, $status)
	{
		return $this->apiController->publishedStatus($request,$id,$status);
	}

	public function uploadPropertyImage(Request $request) {
		return $this->apiController->uploadFile($request);
	}

	public function deletePropertyImage(Request $request)
	{
		return $this->apiController->deletePropertyImages($request);
	}

	// AGENT PROPERTIES CONTROLLER
	public function agentListings(Request $request)
	{
		$agent_id = $request->user()->id;
		return $this->apiController->agentProperties($request, $agent_id);
	}

	public function agentPropertyDetails(Request $request, $id)
	{
		$agent_id = $request->user()->id;
		return $this->apiController->agentPropertyDetails($request,$agent_id,$id);
	}

	public function adminAgentListings(Request $request)
	{

		$currentUser = auth()->user();

		$searchTerms = $request->all();

		$column_value = ['creator_id' => $request->get('agent_id')];


		foreach ($searchTerms as $key => $value) {

			if (isset($key)) {

				if ($key == 'baths') {
					if (strtolower($value) == 'any') {
						$column_value[] = ['bathrooms', '>=', 1];
						continue;
					}
					if ($value < 5) {
						$column_value['bathrooms'] = $value;
					} else {
						$column_value[] = ['bathrooms', '>=', $value];
					}
					continue;
				} else if ($key == 'beds') {

					if (strtolower($value) == 'any') {
						$column_value[] = ['bedrooms', '>=', 1];
						continue;
					}

					if ($value < 5) {
						$column_value['bedrooms'] = $value;
					} else {
						$column_value[] = ['bedrooms', '>=', $value];
					}
					continue;
				} else if ($key == 'min_price') {
					$column_value[] = ['amount', '>=', $value];
					continue;
				} else if ($key == 'max_price') {
					$column_value[] = ['amount', '<=', $value];
					continue;
				} else if ($key == 'other-category') {
					if (strtolower($value) == 'any') {
						continue;
					}
					$column_value['other_category'] = $value;
					continue;
				} else if ($key == 'page' || $key == 'list-type' || $key == 'agent_id') {
					continue;
				}

				$column_value[$key] = $value;
			}
		}

		$listings = DB::table('property')
			->where($column_value)
			->orderBy('created_at', 'desc')
			->paginate(20);

		return json_encode(['data' => $listings]);
	}

	public function latestProperty()
	{

		//get land for sell
		$properties = DB::table('property')
			->where('setup', 1)
			->orderBy('created_at', 'desc')
			->limit(6)
			->get();

		$properties = $this->GetImage($properties);

		return json_encode(['data' => $properties]);
	}

	public function PropertyByCategory(Request $request)
	{

		$category = $request->get('category');

		//get land for sell
		$properties = DB::table('property')
			->where('category', $category)
			->orderBy('created_at', 'desc')
			->paginate(12);

		$properties = $this->GetImage($properties);

		return json_encode(['data' => $properties]);
	}

	/**Append image names to the properties */
	public function GetImage($obj)
	{

		foreach ($obj as $key => $value) {

			//get the first image name of that property and append to the obj
			$image = DB::table('photos')
				->where('property_id', $value->id)
				->first();

			//check if image is empty
			if (empty($image)) {
				unset($obj[$key]);
				continue;
			}

			$value->image = $image->name;


			# code...
		}

		return $obj;
	}

	public function deleteProperty(Request $request)
	{

		$property_id = $request->input('property_id');
		$currentUser = auth()->user();

		$property = DB::table('property')
			->where(['id' => $property_id])
			->first();

		//directory to upload image
		$upload_dir = public_path('uploads/users/' . $currentUser->id . '/');

		//deleting from admin's page
		if ($request->has('creator_id')) {
			//directory to upload image
			$upload_dir = public_path('uploads/users/' . $request->get('creator_id') . '/');
		}

		if (($property->creator_id == $currentUser->id) || $currentUser->is_admin == 1) {
			//check if the property has images and has been setup
			$propertyPhotos = json_decode($property->images);

			if (is_object($propertyPhotos)) {

				//convert to array
				$propertyPhotos = (array)$propertyPhotos;

				$propertyPhotos = array_values($propertyPhotos);
			}

			if (count($propertyPhotos) > 0) {
				for ($i = 0, $len = count($propertyPhotos); $i < $len; $i++) {

					$target = $upload_dir . $propertyPhotos[$i];

					unlink($target);
				}
			}

			DB::table('property')
				->where('id', $property_id)
				->delete();

			//delete the property from favorites table
			DB::table('favorites')
				->where('property_id', $property_id)
				->delete();

			return json_encode(['status' => 1]);
		}

		return json_encode(['status' => 0]);
	}


	/**
	 * This method sets and unsets the users favorite listings
	 */
	public function favorite(Request $request)
	{

		$property_id = $request->get('property_id');
		$currentUser = auth()->user();


		//get the favorite from the users table

		$userFavorites = DB::table('favorites')
			->where('user_id', $currentUser->id)
			->get();


		for ($i = 0, $len = count($userFavorites); $i < $len; $i++) {

			if ($userFavorites[$i]->property_id == $property_id) {


				//save the current favorites
				DB::table('favorites')
					->where(['user_id' => $currentUser->id, 'property_id' => $property_id])
					->delete();

				$userFavorites = DB::table('favorites')
					->where('user_id', $currentUser->id)
					->get();

				return json_encode(['data' => $userFavorites]);
			}
		}


		$column_value = ['user_id' => $currentUser->id, 'property_id' => $property_id];
		//save the current favorites
		DB::table('favorites')
			->insert($column_value);

		$userFavorites = DB::table('favorites')
			->where('user_id', $currentUser->id)
			->get();

		return json_encode(['data' => $userFavorites, 'status' => 'got on']);
	}

	public function getFavorites(Request $request)
	{

		//get the user
		$currentUser = auth()->user();

		$favorite_properties = [];

		$favorites =  DB::table('favorites')
			->where('user_id', $currentUser->id)
			->get();


		for ($i = 0, $len = count($favorites); $i < $len; $i++) {

			$property = DB::table('property')
				->where('id', $favorites[$i]->property_id)
				->first();

			array_push($favorite_properties, $property);
		}

		return json_encode(['data' => $favorite_properties, 'user' => $currentUser]);
	}

	public function searchProperty(Request $request)
	{

		$searchTerms = $request->all();
		$column_value = [];

		foreach ($searchTerms as $key => $value) {

			if (isset($key)) {

				if ($key == 'baths') {
					if (strtolower($value) == 'any') {
						$column_value[] = ['bathrooms', '>=', 1];
						continue;
					}
					if ($value < 5) {
						$column_value['bathrooms'] = $value;
					} else {
						$column_value[] = ['bathrooms', '>=', $value];
					}
					continue;
				} else if ($key == 'beds') {

					if (strtolower($value) == 'any') {
						$column_value[] = ['bedrooms', '>=', 1];
						continue;
					}

					if ($value < 5) {
						$column_value['bedrooms'] = $value;
					} else {
						$column_value[] = ['bedrooms', '>=', $value];
					}
					continue;
				} else if ($key == 'min_price') {
					$column_value[] = ['amount', '>=', $value];
					continue;
				} else if ($key == 'max_price') {
					$column_value[] = ['amount', '<=', $value];
					continue;
				} else if ($key == 'page') {
					continue;
				}

				$column_value[$key] = $value;
			}
		}

		$properties = DB::table('property')
			->where($column_value)
			->where('published', 1)
			->paginate(20);

		return json_encode(['data' => $properties]);
	}

	public function agentSearchProperty(Request $request)
	{

		$currentUser = auth()->user();

		$searchTerms = $request->all();
		$column_value = ['creator_id' => $currentUser->id];

		foreach ($searchTerms as $key => $value) {

			if (isset($key)) {

				if ($key == 'baths') {
					if (strtolower($value) == 'any') {
						$column_value[] = ['bathrooms', '>=', 1];
						continue;
					}
					if ($value < 5) {
						$column_value['bathrooms'] = $value;
					} else {
						$column_value[] = ['bathrooms', '>=', $value];
					}
					continue;
				} else if ($key == 'beds') {

					if (strtolower($value) == 'any') {
						$column_value[] = ['bedrooms', '>=', 1];
						continue;
					}

					if ($value < 5) {
						$column_value['bedrooms'] = $value;
					} else {
						$column_value[] = ['bedrooms', '>=', $value];
					}
					continue;
				} else if ($key == 'min_price') {
					$column_value[] = ['amount', '>=', $value];
					continue;
				} else if ($key == 'max_price') {
					$column_value[] = ['amount', '<=', $value];
					continue;
				} else if ($key == 'page') {
					continue;
				}

				$column_value[$key] = $value;
			}
		}

		$properties = DB::table('property')
			->where($column_value)
			->where('published', 1)
			->paginate(20);

		return json_encode(['data' => $properties]);
	}

	public function adminPropertiesOverview()
	{

		if (auth()->check()) {

			$obj = new \stdClass();

			//get count for rent,land,house for sell,short-let
			$forSellCount  = DB::table('property')
				->where(['category' => 'sell'])
				->count();

			$rentCount  = DB::table('property')
				->where(['category' => 'rent',])
				->count();

			$landCount  = DB::table('property')
				->where(['category' => 'land',])
				->count();

			$short_letCount  = DB::table('property')
				->where(['category' => 'short_let',])
				->count();

			$propertyCount  = DB::table('property')
				->count();
			$unpublishedPropertyCount  = DB::table('property')
				->where(['published' => 0])
				->count();

			$unpublishedProperty = DB::table('property')
				->where(['published' => 0])
				->limit(3)
				->get();

			$obj->forSellCount = $forSellCount;
			$obj->rentCount = $rentCount;
			$obj->landCount = $landCount;
			$obj->shortLetCount = $short_letCount;
			$obj->propertyCount = $propertyCount;
			$obj->unpublishedProperty = $unpublishedProperty;
			$obj->unpublishedPropertyCount = $unpublishedPropertyCount;

			return json_encode([
				'status' => 1,
				'data' => [
					'propertyDetails' => $obj

				]
			]);
		}
	}

	public function adminAllListings(Request $request)
	{

		$currentUser = auth()->user();

		$searchTerms = $request->all();

		$column_value = [];

		if ($request->has('list-type') && $request->get('list-type') == 'currentuser') {

			$column_value = ['creator_id' => $currentUser->id];
		}

		foreach ($searchTerms as $key => $value) {

			if (isset($key)) {

				if ($key == 'baths') {
					if (strtolower($value) == 'any') {
						$column_value[] = ['bathrooms', '>=', 1];
						continue;
					}
					if ($value < 5) {
						$column_value['bathrooms'] = $value;
					} else {
						$column_value[] = ['bathrooms', '>=', $value];
					}
					continue;
				} else if ($key == 'beds') {

					if (strtolower($value) == 'any') {
						$column_value[] = ['bedrooms', '>=', 1];
						continue;
					}

					if ($value < 5) {
						$column_value['bedrooms'] = $value;
					} else {
						$column_value[] = ['bedrooms', '>=', $value];
					}
					continue;
				} else if ($key == 'min_price') {
					$column_value[] = ['amount', '>=', $value];
					continue;
				} else if ($key == 'max_price') {
					$column_value[] = ['amount', '<=', $value];
					continue;
				} else if ($key == 'other-category') {
					if (strtolower($value) == 'any') {
						continue;
					}
					$column_value['other_category'] = $value;
					continue;
				} else if ($key == 'page' || $key == 'list-type') {
					continue;
				}

				$column_value[$key] = $value;
			}
		}


		$listings = DB::table('property')
			->where($column_value)
			->orderBy('id', 'desc')
			->paginate(20);

		return json_encode(['data' => $listings]);
	}
}
