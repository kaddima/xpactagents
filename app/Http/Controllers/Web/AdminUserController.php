<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\BaseController;
use App\Rules\ValidationRules;
use App\Services\AdminUserService;
use Illuminate\Http\Request;

class AdminUserController extends BaseController
{
	protected $adminUserService;

	public function __construct(AdminUserService $adminUserService)
	{
		$this->adminUserService = $adminUserService;
	}

	public function adminUsersOverview(Request $request){
		return $this->sendResponse($this->adminUserService->userOverviewData());
	}

	public function searchUsers(Request $request){
		$data = $this->validate($request, ValidationRules::userSearchRules());
		return $this->sendResponse($this->adminUserService->userSearch($data));
	}

	/**
	 * gets users by filters, eg admin,agents,and users
	 */
	public function getUsers(Request $request){
		$data = $this->validate($request,ValidationRules::getUsersRules());
		return $this->sendResponse($this->adminUserService->getUsers($data));
	}

	public function getUserDetails(Request $request, $user_id){
		$data = $this->validateParams(["user_id"=>$user_id],
		["user_id"=>"required|uuid|exists:users,id"]);
		return $this->sendResponse($this->adminUserService->userDetails($data['user_id']));	
	}
}
