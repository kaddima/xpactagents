<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
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
		return $this->sendResponse($userDetails);
	}

	public function updateUserdetails(Request $request){
		$data = $this->validate($request, ValidationRules::updateUserDetailsRules());
		$this->userServices->updateUserDetails($data, $request->user());
		return $this->sendResponse(null, "user info updated");
	}

	public function changePassword(Request $request){
		$data = $this->validate($request, ValidationRules::changePasswordRules());
		$this->userServices->changePassword($data, $request->user());
		return $this->sendResponse(null, "Password changed successfully");
	}

	public function uploadUserimage(Request $request){
		$data = $this->validate($request, ValidationRules::userImageRule());
		$file = $request->file("image");

		$imagePath = $this->userServices->uploadUserimage($file,$request->user());
		return $this->sendResponse($imagePath, "Image uploaded successfully");
	}

	public function IdVerificationRequest(Request $request){
		$data = $this->validate($request, ValidationRules::idVerificationRequestRules());
		$this->userServices->IdVerificationRequest($data, $request->file('image'), $request->user());
		return $this->sendResponse(null, "Id verification in progress");
	}

	public function updateUserLastSeen(Request $request){
		$this->userServices->updateUserLastSeen($request->user());
		return $this->sendResponse(null, "Last seen updated");
	}
}
