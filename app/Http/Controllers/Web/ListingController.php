<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\BaseController;
use App\Rules\ValidationRules;
use App\Services\GeneralDataService;
use App\Services\PropertyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use stdClass;

class ListingController extends BaseController
{
	protected $propertyService;
	protected $apiController;
	protected $generalDataService;

	public function __construct(
		PropertyService $propertyService,
		PropertyController $apiController,
		GeneralDataService $generalDataService
	) {
		$this->propertyService = $propertyService;
		$this->apiController = $apiController;
		$this->generalDataService = $generalDataService;
	}
	
	// ===== GENERAL CONTROLLER
	public function getProperties(Request $request)
	{
		return $this->apiController->getProperties($request);
	}

	public function propertyDetails(Request $request, $id)
	{
		return $this->apiController->getPropertyDetails($request, $id);
	}

	public function addFavorite(Request $request, $id)
	{
		return $this->apiController->addFavorite($request, $id);
	}

	public function removeFavorite(Request $request, $id)
	{
		return $this->apiController->removeFavorite($request, $id);
	}

	public function getFavorites(Request $request)
	{
		return $this->apiController->getFavoriteProperties($request);
	}

	//===== AGENT CONTROLLER
	public function createProperty(Request $request)
	{
		return $this->apiController->create($request);
	}

	public function updateProperty(Request $request, $id)
	{
		return $this->apiController->updateProperty($request, $id);
	}

	public function agentListings(Request $request)
	{
		$agent_id = $request->user()->id;
		return $this->apiController->agentProperties($request, $agent_id);
	}

	public function agentPropertyDetails(Request $request, $id)
	{
		$agent_id = $request->user()->id;
		return $this->apiController->agentPropertyDetails($request, $agent_id, $id);
	}

	public function agentSearchProperty(Request $request)
	{
		return $this->apiController->searchAgentProperties($request, $request->user()->id);
	}

	public function publishProperty(Request $request, $id, $status)
	{
		return $this->apiController->publishedStatus($request, $id, $status);
	}

	public function uploadPropertyImage(Request $request)
	{
		return $this->apiController->uploadFile($request);
	}

	public function deletePropertyImage(Request $request)
	{
		return $this->apiController->deletePropertyImages($request);
	}

	// ====== ADMIN 
	public function adminAgentListings(Request $request, $agent_id)
	{
		return $this->apiController->agentProperties($request, $agent_id);
	}

	public function deleteProperty(Request $request, $id)
	{
		return $this->apiController->deleteProperty($request, $id);
	}

	// ===== ADMIN PROPERTY CONTROLLER
	public function adminOverviewData(Request $request)
	{
		return $this->sendResponse(
			$this->generalDataService->adminOverviewData($request->user())
		);
	}

	public function adminAllListings(Request $request)
	{
		$data = $this->validate($request, ValidationRules::propertyFiltersRules());
		return $this->sendResponse($this->propertyService->getProperties($data, false));
	}

	public function adminPropertyDetails(Request $request, $id){
		$details = $this->propertyService->propertyDetails($id, false);
		return $this->sendResponse($details);
	}

	public function adminAgentOverview(Request $request,$agent_id){
		$data = $this->validateParams(["agent_id"=>$agent_id], 
		["agent_id"=>"required|uuid|exists:users,id"]);
		return $this->sendResponse($this->generalDataService->agentOverviewData(null,$data["agent_id"]));
	}
}
