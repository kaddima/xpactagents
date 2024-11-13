<?php

namespace App\Http\Controllers\Api;

use App\Rules\ValidationRules;
use App\Services\PropertyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

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
		$this->validateParams(["id" => $id], ["id" => "required|uuid"]);
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
		$this->validateParams(["id" => $id], ["id" => "required|uuid"]);

		$data = $this->validate($request, ValidationRules::storeProductRules(true));

		$id;
		$currentUser = $request->user();
		$this->propertyService->updateProperty($data, $id, $currentUser);
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
		$this->validateParams(["id" => $id], ["id" => "required|uuid"]);

		$this->propertyService->deleteProperty($id, $request->user());
		return $this->sendResponse(null, "Property deleted");
	}

	public function addFavorite(Request $request, $id)
	{
		$this->validateParams(["id" => $id], ["id" => "required|uuid"]);

		$this->propertyService->addFavoriteProperty($id, $request->user());
		return $this->sendResponse(null, "Property added to favorite");
	}

	public function removeFavorite(Request $request, $id)
	{
		$this->validateParams(["id" => $id], ["id" => "required|uuid"]);

		$this->propertyService->removeFavoriteProperty($id, $request->user());
		return $this->sendResponse(null, "Property deleted from favorite");
	}

	public function publishedStatus(Request $request, $id, $published)
	{
		$data = ["id" => $id, 'published' => $published];
		$this->validateParams(
			$data,
			["id" => "required|uuid", "published" => "required|string|in:true,false"],
			["in" => "Only true or false is accepted"]
		);

		$this->propertyService->updateProperty(['published' => ($published == 'true') ? 1 : 0], $id, $request->user());
		return $this->sendResponse(["published" => $published], "Published status changed");
	}

	public function agentProperties(Request $request, $agent_id)
	{
		$currentAgent = $request->user();
		$data = $this->validateParams(
			['agent_id' => $agent_id, 'current_agent_id' => $currentAgent->id],
			['agent_id' => 'required|uuid', 'current_agent_id' => 'same:agent_id'],
			['same' => "Invalid session user id"]
		);

		$filters = $this->validate($request, ValidationRules::propertyFiltersRules());
		$properties = $this->propertyService->getProperties($filters, false, $data['agent_id']);
		return $this->sendResponse($properties);
	}

	public function agentPropertyDetails(Request $request, $agent_id, $id)
	{
		$this->validateParams(
			["id" => $id, 'agent_id' => $agent_id],
			["id" => "required|uuid","agent_id"=>"required|uuid|exists:users,id"]
		);

		$property = $this->propertyService->propertyDetails($id, false, $agent_id);
		return $this->sendResponse($property);
	}

	public function adminAgentProperties(Request $request, $agent_id)
	{
		$data = $this->validateParams(
			['agent_id' => $agent_id,],
			['agent_id' => 'required|uuid|exists:users,id',],
			['exists' => "Invalid agentId: Agent account not found"]
		);

		$filters = $this->validate($request, ValidationRules::propertyFiltersRules());
		$properties = $this->propertyService->getProperties($filters, false, $data['agent_id']);
		return $this->sendResponse($properties);
	}
}
