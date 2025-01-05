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

	public function getUsers(Request $request){
		$data = $this->validate($request,ValidationRules::getUsersRules());
		return $this->sendResponse($this->adminUserService->getUsers($data));
	}
}
