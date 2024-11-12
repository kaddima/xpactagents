<?php

namespace App\Http\Controllers\Api;

use App\Rules\ValidationRules;
use App\Services\PropertyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class PropertyController extends BaseController
{
	protected $propertyService;
	public function __construct(PropertyService $propertyService)
	{
		$this->propertyService = $propertyService;
	}

	public function getProperties(Request $request)
	{
		$data = $this->validate($request, ValidationRules::propertyFiltersRules());
		return $this->sendResponse($this->propertyService->getProperties($data));
	}

	public function getPropertyDetails(Request $request, $id)
	{
		$validator = Validator::make(["id" => $id], ["id" => "required|uuid"]);
		if ($validator->fails()) {
			throw new ValidationException($validator);
		}
		return $this->sendResponse($this->propertyService->propertyDetails($id));
	}

	public function create(Request $request)
	{
		/**Validate the request data */
		$data = $this->validate($request, ValidationRules::storeProductRules());
		/**Get the current signed user */
		$currentUser = $request->user();
		$productId = $this->propertyService->create($data, $currentUser);
		return $this->sendResponse(['productId' => $productId], "Product created successfully");
	}

	public function updateProperty(Request $request, $id)
	{
		$validator = Validator::make(["id" => $id], ["id" => "required|uuid"]);
		if ($validator->fails()) {
			throw new ValidationException($validator);
		}

		$data = $this->validate($request, ValidationRules::storeProductRules(true));

		$data['property_id'] = $id;
		$currentUser = $request->user();
		$this->propertyService->updateProperty($data, $currentUser);
		return $this->sendResponse([], "Property updated");
	}

	public function uploadFile(Request $request)
	{
		//get the authenticated user
		$currentUser = $request->user();
		//validate the data
		$data = $this->validate($request, ValidationRules::uploadPropertyImageRules());
		$file = $request->file("image");

		$path = $this->propertyService->uploadFile($file, $data['property_id'], $currentUser);
		return $this->sendResponse(['path' => $path], "File uploaded successfully");
	}

	public function deletePropertyImages(Request $request)
	{
		//get the authenticated user
		$currentUser = $request->user();
		//validate the data
		$data = $this->validate($request, ValidationRules::deletePropertyImageRules($request->input('property_id')));

		$this->propertyService->deletePropertyImage($data, $currentUser);
		return $this->sendResponse(null, "File deleted");
	}

	public function deleteProperty(Request $request, $id)
	{
		$validator = Validator::make(["id" => $id], ["id" => "required|uuid"]);
		if ($validator->fails()) {
			throw new ValidationException($validator);
		}
		$this->propertyService->deleteProperty($id, $request->user());
		return $this->sendResponse(null, "Property deleted");
	}

	public function addFavorite(Request $request, $id)
	{
		$validator = Validator::make(["id" => $id], ["id" => "required|uuid"]);
		if ($validator->fails()) {
			throw new ValidationException($validator);
		}

		$this->propertyService->addFavoriteProperty($id, $request->user());
		return $this->sendResponse(null, "Property added to favorite");
	}

	public function removeFavorite(Request $request, $id)
	{
		$validator = Validator::make(["id" => $id], ["id" => "required|uuid"]);
		if ($validator->fails()) {
			throw new ValidationException($validator);
		}

		$this->propertyService->removeFavoriteProperty($id, $request->user());
		return $this->sendResponse(null, "Property deleted from favorite");
	}
}
