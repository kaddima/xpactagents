<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\BaseController;
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
}
