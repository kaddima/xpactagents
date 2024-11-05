<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PropertyService;
use App\Validation\AnyOrInteger;
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
		$data = $this->validate($request, [
			'beds' => ["nullable", new AnyOrInteger()],
			'baths' => ["nullable", new AnyOrInteger()],
			'toilets' => 'nullable|integer|min:1|max:10',
			'category' => 'nullable|string|max:255',
			'property_type'=>'nullable|string',
			'amount' => 'nullable|numeric',
			'lga' => 'nullable|string|max:255',
			'state' => 'nullable|string|max:255',
			'page' => 'nullable|integer|min:1',
			'limit' => 'nullable|integer|min:1',
		]);

		return $this->sendResponse($this->propertyService->getProperties($data,true));
	}
}
