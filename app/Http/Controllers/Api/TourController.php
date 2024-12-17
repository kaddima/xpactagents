<?php

namespace App\Http\Controllers\Api;

use App\Rules\ValidationRules;
use App\Services\TourService;
use Illuminate\Http\Request;

class TourController extends BaseController
{
	protected $tourService;

	public function __construct(TourService $tourService)
	{
		$this->tourService = $tourService;
	}

	public function addNewTour(Request $request){
		$data = $this->validate($request, ValidationRules::newTourRules());
		$this->tourService->storeNewTour($data);
		return $this->sendResponse(null, "Tour request completed");
	}

	public function agentTours(Request $request){
		$data = $this->validate($request, ValidationRules::toursFilterRules());
		$tours = $this->tourService->getAgentTours($request->user()->id, $data);
		return $this->sendResponse($tours);
	}

	public function resolveTour(Request $request, $tour_id){
		$data = $this->validateParams(["id"=>$tour_id], ["id"=>"required", "numeric"]);
		$this->tourService->resolveTour($tour_id, $request->user());
		return $this->sendResponse(null, "Tour resolved");
	}
}
