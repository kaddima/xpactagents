<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Api\TourController as ApiTourController;
use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;

class TourController extends BaseController
{
	protected $apiController;

	public function __construct(ApiTourController $apiController)
	{
		$this->apiController = $apiController;
	}

	public function addNewTour(Request $request)
	{
		return $this->apiController->addNewTour($request);
	}

	public function agentTours(Request $request)
	{
		return $this->apiController->agentTours($request);
	}

	public function resolveTour(Request $request, $tour_id)
	{
		return $this->apiController->resolveTour($request, $tour_id);
	}
}
