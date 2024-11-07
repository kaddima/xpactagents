<?php

namespace App\Http\Controllers\Api;

use App\Rules\ValidationRules;
use App\Services\PropertyService;
use Illuminate\Http\Request;

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

	public function create(Request $request){
		/**Validate the request data */
		$data = $this->validate($request, ValidationRules::storeProductRules());
		/**Get the current signed user */
		$currentUser = $request->user();
		$productId = $this->propertyService->create($data, $currentUser);
		return $this->sendResponse(['productId'=>$productId], "Product created successfully");
	}
}
