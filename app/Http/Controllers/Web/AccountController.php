<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\BaseController;
use App\Models\User;
use App\Services\AuthService;
use App\Services\GeneralDataService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountController extends BaseController
{
	protected $generalDataService;
	protected $apiController;
	protected $authService;

	public function __construct(
		GeneralDataService $service,
		UserController $apiController,
		AuthService $authService
	) {
		$this->generalDataService = $service;
		$this->apiController = $apiController;
		$this->authService = $authService;
	}

	public function getUserAccount(Request $request)
	{
		$user_id = auth()->user()->id;
		if ($request->has('user_id')) {
			$user_id = $request->get('user_id');
		}
		return $this->apiController->getuserDetails($request, $user_id);
	}

	public function agentOverviewData(Request $request)
	{
		$data = $this->generalDataService->agentOverviewData($request->user());
		return $this->sendResponse($data);
	}

	public function changePassword(Request $request){
		return $this->apiController->changePassword($request);
	}

	public function updateLastSeen()
	{
		$currentUser = auth()->user();
		$date = date('Y-m-d H:i:s');
		$currentUser->last_seen = $date;

		DB::table('users')
			->where('id', $currentUser->id)
			->update(['last_seen' => $date]);

		return json_encode(['data' => $currentUser]);
	}

	public function verifyAuthentication(Request $request){
		$data = $this->authService->verifyAuthentication();
		return $this->sendResponse($data);
	}

	public function adminUsersOverview()
	{

		if (Auth::check() && Auth::user()->is_admin == 1) {

			//get the current User
			$currentUser = Auth::user();

			if ($currentUser->is_admin == 1) {

				$obj = new \stdClass();

				//get count for rent,land,house for sell,short-let
				$usersCount  = DB::table('users')
					->count();

				$agentsCount  = DB::table('users')
					->where(['is_agent' => '1',])
					->count();

				$adminsCount = DB::table('users')
					->where(['is_admin' => '1',])
					->count();

				$regularUsersCount = DB::table('users')
					->where(['is_agent' => '0',])
					->count();

				$recentUsers = DB::table('users')
					->orderBy('created_at', 'desc')
					->limit(6)
					->get();

				$obj->usersCount  = $usersCount;
				$obj->agentsCount = $agentsCount;
				$obj->adminsCount = $adminsCount;
				$obj->regularUsersCount = $regularUsersCount;
				$obj->recentUsers = $recentUsers;


				return json_encode(['data' => $obj]);
			}
		}
	}

}
