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

	public function create(Request $request)
	{
		/**Validate the request data */
		$data = $this->validate($request, ValidationRules::storeProductRules());
		/**Get the current signed user */
		$currentUser = $request->user();
		$productId = $this->propertyService->create($data, $currentUser);
		return $this->sendResponse(['productId' => $productId], "Product created successfully");
	}

	public function update(Request $request, $id)
	{
		$validator = Validator::make(["id" => $id], ["id" => "required|uuid"]);
		if ($validator->fails()) {
			throw new ValidationException($validator);
		}

		$data = $this->validate($request, ValidationRules::storeProductRules(true));

		$data['id'] = $id;
		$currentUser = $request->user();
		$this->propertyService->updateProperty($data, $currentUser);
		return $this->sendResponse([], "Property updated");
	}

	public function uploadFile(Request $request)
	{
		//get the authenticated user
		$currentUser = $request->user();
		//validate the data
		$data = $this->validate($request, ValidationRules::propertyUploadValidation());
		$file = $request->file("image");

		$path = $this->propertyService->uploadFile($file, $data['property_id'], $currentUser);
		return $this->sendResponse(['path' => $path], "File uploaded successfully");
	}
}
