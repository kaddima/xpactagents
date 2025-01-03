<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\BaseController;
use App\Services\PropertyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ListingController extends BaseController
{
	protected $propertyService;
	protected $apiController;

	public function __construct(
		PropertyService $propertyService,
		PropertyController $apiController
	) {
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

	// AGENT PROPERTIES CONTROLLER
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

	// ====== ADMIN 
	public function adminAgentListings(Request $request, $agent_id)
	{
		return $this->apiController->agentProperties($request, $agent_id);
	}

	public function deleteProperty(Request $request, $id)
	{
		return $this->apiController->deleteProperty($request, $id);
	}

	/**
	 * This method sets and unsets the users favorite listings
	 */
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
