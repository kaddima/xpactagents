<?php

namespace App\Http\Controllers\Api;

use App\Rules\ValidationRules;
use App\Services\UserServices;
use Illuminate\Http\Request;

class UserController extends BaseController
{
	protected $userServices;

	public function __construct(UserServices $userServices)
	{
		$this->userServices = $userServices;
	}

	public function getuserDetails(Request $request, $user_id)
	{
		$currentUser = null;

		if (!($request->user()->is_admin == 1)) {
			$this->validateParams(
				['user_id' => $user_id, 'current_user_id' => $request->user()->id],
				["user_id" => "required|uuid|same:current_user_id"],
				['same' => "Unathorized: user id mismatch"]
			);

			$currentUser = $request->user();
		}

		$userDetails = $this->userServices->getuserDetails($user_id, $currentUser);
		return $this->sendResponse($userDetails, $request->user()->password);
	}

	public function changePassword(Request $request){
		$data = $this->validate($request, ValidationRules::changePasswordRules());
		$this->userServices->changePassword($data, $request->user());
		return $this->sendResponse(null, "Password changed successfully");
	}
}
