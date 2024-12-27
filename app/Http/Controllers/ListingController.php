<?php

namespace App\Http\Controllers;

use App\Rules\ValidationRules;
use App\Services\PropertyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ListingController extends BaseController
{
	protected $propertyService;

	public function __construct(PropertyService $propertyService)
	{
		$this->propertyService = $propertyService;
	}

	//Create new property
	public function createProperty(Request $request)
	{
		/**Validate the request data */
		$data = $this->validate($request, ValidationRules::storeProductRules());
		/**Get the current signed user */
		$currentUser = $request->user();
		$productId = $this->propertyService->create($data, $currentUser);
		return $this->sendResponse(['productId' => $productId], "Product created successfully");
	}

	public function getProperties(Request $request)
	{
		$data = $this->validate($request, ValidationRules::propertyFiltersRules());
		return $this->sendResponse($this->propertyService->getProperties($data));
	}

	public function propertyDetails(Request $request, $id)
	{
		$this->validateParams(
			["id" => $id],
			["id" => "required|uuid"]
		);

		$property = $this->propertyService->propertyDetails($id);
		return $this->sendResponse($property);
	
	}

	public function updateProperty(Request $request)
	{

		$data = $request->all();

		//logged in admin
		$user_id = auth()->user()['id'];

		$column_value = [
			'name' => $data['name'] ? $data['name'] : null,
			'address' => $data['address'] ? $data['address'] : null,
			'amount' => $data['amount'] ? $data['amount'] : null,
			'category' => $data['property_category'] ? $data['property_category'] : null,
			'description' => $data['description'] ? $data['description'] : null,
			'size' => isset($data['size']) ? $data['size'] : null,
			'property_type' => $data['property_type'] ? $data['property_type'] : null,
			'property_fact' => $data['property_fact'] ? json_encode($data['property_fact']) : null,
			'amenities' => $data['amenities'] ? json_encode($data['amenities']) : json_encode([]),
			'setup' => 1,
			'duration' => isset($data['duration']) ? $data['duration'] : null,
			'state' => isset($data['state']) ? $data['state'] : null,
			'lga' => isset($data['lga']) ? $data['lga'] : null,
			'other_category' => isset($data['other_category']) ? $data['other_category'] : null,
			'bedrooms' => isset($data['bedrooms']) ? $data['bedrooms'] : null,
			'toilets' => isset($data['toilets']) ? $data['toilets'] : null,
			'bathrooms' => isset($data['bathrooms']) ? $data['bathrooms'] : null
		];

		//update the table
		DB::table('property')
			->where(['id' => $data['property_id']])
			->update($column_value);


		return json_encode(['status' => 1]);
	}

	public function uploadPropertyImage(Request $request)
	{

		$user_id = auth()->user()['id'];
		$photoPattern = '#^(image/)[^\s\n<]+$#i';

		$file = $request->file('image');
		$property_id = $request->get('property_id');
		$filename = pathInfo($request->get('file_name'))['filename'] . ".jpg";

		$error = '';
		$status = 1;

		//directory to upload image
		$upload_dir = public_path('uploads/users/' . $user_id . '/');

		$name = $file->getClientOriginalName();
		$size = $file->getSize();
		$target = $upload_dir . $filename;


		if ((floatval($size) / 1000) > 700) {
			$error = 'file too large -- 700kb and below';
			$status = 0;
		} elseif (!preg_match($photoPattern, $file->getMimeType())) {
			$error = 'please upload only images';
			$status = 0;
		} elseif (file_exists($target)) {
			$error = 'File already exist';
			$status = 0;
		}

		if ($status == 1) {

			// upload the photo to server
			$file->move($upload_dir, $filename);

			//get the images from the property table by property_id

			$property = DB::table('property')
				->where('id', $property_id)
				->first();

			$images = $property->images ? (array)json_decode($property->images) : [];

			$images[] = $filename;

			//insert the photo to database

			$columnValue = [
				'images' => json_encode($images)
			];

			DB::table('property')
				->where('id', $property_id)
				->update($columnValue);

			return json_encode(['status' => $status, 'error' => $error, 'photos' => $images]);
		}

		return json_encode(['status' => $status, 'error' => $error]);
	}

	public function deletePropertyImage(Request $request)
	{

		$user_id = auth()->user()['id'];

		$data = $request->all();
		$property_id = $data['property_id'];

		//directory to upload image
		$upload_dir = public_path('uploads/users/' . $user_id . '/');

		$target = $upload_dir . $data['image'];


		//get the images from the property table by property_id

		$property = DB::table('property')
			->where('id', $property_id)
			->first();

		$images = json_decode($property->images);

		if (is_object($images)) {

			//convert to array
			$images = (array)$images;

			$images = array_values($images);
		}

		for ($i = 0, $len = count($images); $i <= $len; $i++) {

			if ($images[$i] == $data['image']) {

				if (unlink($target)) {

					unset($images[$i]);

					/*** reset the array index to start from 0 else when you encode the 
                        array it turns to object ({"1":"element"}) rather than "[element]"
                        as desired
					 */
					$images = array_values($images);

					//insert the photo to database

					$columnValue = [
						'images' => json_encode($images)
					];

					DB::table('property')
						->where('id', $property_id)
						->update($columnValue);


					return json_encode(
						[
							'status' => 1,
							'photos' => array_values($images)
						]
					);
				}
			}
		}

		return json_encode(
			[
				'status' => 1,
				'photos' => array_values($images)
			]
		);
	}

	// AGENT PROPERTIES CONTROLLER
	public function agentListings(Request $request)
	{
		$agent_id = $request->user()->id;

		//when requesting from admin page
		if ($request->has('agent_id')) {

			$agent_id = $request->get('agent_id');
		}

		$data = $this->validateParams(
			['agent_id' => $agent_id],
			['agent_id' => 'required|uuid|exists:users,id']
		);

		$filters = $this->validate($request, ValidationRules::propertyFiltersRules());
		$properties = $this->propertyService->getProperties($filters, false, $data['agent_id']);
		return $this->sendResponse($properties);
	}

	public function agentPropertyDetails(Request $request, $id)
	{
		$agent_id = $request->user()->id;
		$this->validateParams(
			["id" => $id],
			["id" => "required|uuid"]
		);

		$property = $this->propertyService->propertyDetails($id, false, $agent_id);
		return $this->sendResponse($property);
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

	public function publishProperty(Request $request)
	{

		$property_id = $request->input('property_id');

		$currentUser = auth()->user();

		if ($currentUser->is_admin == 0 && $currentUser->profile_complete != 1) {
			return [];
		}
		//get the property
		$property = DB::table('property')
			->where(['id' => $property_id])
			->first(['id', 'published', 'creator_id']);

		if ($currentUser->id == $property->creator_id || $currentUser->is_admin == 1) {

			if ($property->published == 0) {

				DB::table('property')
					->where(['id' => $property_id])
					->update(['published' => 1]);
			} else {

				DB::table('property')
					->where(['id' => $property_id])
					->update(['published' => 0]);
			}
		}

		// $propertyDetails = DB::table('property')
		// ->where('id',$property_id)
		// ->first('published');

		return json_encode(['status' => 1, 'data' => $property_id]);
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
