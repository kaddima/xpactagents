<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\UserController;
use App\Models\User;
use App\Services\GeneralDataService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AccountController extends BaseController
{
	protected $generalDataService;
	protected $apiController;

	public function __construct(
		GeneralDataService $service,
		UserController $apiController
	) {
		$this->generalDataService = $service;
		$this->apiController = $apiController;
	}

	public function getUserAccount(Request $request)
	{
		$user_id = auth()->user()->id;
		if ($request->has('user_id')) {
			$user_id = $request->get('user_id');
		}
		return $this->apiController->getuserDetails($request, $user_id);
	}

	public function generalAgentData(Request $request)
	{
		$data = $this->generalDataService->agentOverviewData($request->user());
		return $this->sendResponse($data);
	}

	public function createAccount(Request $request)
	{

		$data = [];
		$errors = [];
		$status = 1;

		$data = $request->all();

		$email = strtolower($data['email']);
		$email = preg_replace('/(^wwww\.|^www\.|^ww\.)/', '', $email);


		if ($data['accountType'] == 'admin') {

			//check if email is already registered
			$result = DB::table('users')
				->where(['email' => $email])
				->first();


			if (isset($result)) {
				$status = 0;
				$errors[] = 'Email address is already registered';
			}

			$password = $data['password'];
			$c_password = $data['confirm_password'];

			if ($password !== $c_password) {
				$status = 0;
				$errors[] = 'Password does not match';
			}

			if ($status) {

				//hash password
				$password = password_hash($data['password'], PASSWORD_DEFAULT);

				$columName_values = [
					'first_name' => $data['first_name'],
					'last_name' => $data['last_name'],
					'email' => $email,
					'password' => $password,

				];

				//insert the user data into user database
				$last_id = DB::table('users')
					->insertGetId($columName_values);

				//get all users
				$users = DB::table('users')
					->get();

				return json_encode([
					'status' => $status,
					'data' => $users

				]);
			}

			return json_encode([
				'status' => $status,
				'errors' => $errors
			]);
		} else {

			$columName_values = [
				'first_name' => $data['first_name'],
				'last_name' => $data['last_name'],
				'email' => $email,
				'phone' => $data['phone'],
				'whatsapp_number' => $data['whatsapp']

			];

			DB::table('agents')
				->insert($columName_values);

			$agents = DB::table('agents')
				->get();

			return json_encode([
				'status' => $status,
				'data' => $agents
			]);
		}
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

	public function adminUsersRegular()
	{

		if (Auth::check() && Auth::user()->is_admin == 1) {

			$users = User::where('is_agent', 0)
				->paginate(20);

			return json_encode(['data' => $users]);
		}
	}

	public function verificationRequest()
	{

		if (Auth::check() && Auth::user()->is_admin == 1) {

			$requests = DB::table('id_verify')->where('status', 0)
				->paginate(12);

			return json_encode(['data' => $requests]);
		}
	}

	public function verificationResponse(Request $req)
	{

		$currentUser = Auth::user();
		$email = $req->get('email');
		$type = $req->get('type');
		$user_id = $req->get('user_id');
		$img = $req->get('doc_img');

		$message = '';
		$subject = '';

		if (Auth::check() && Auth::user()->is_admin == 1) {

			if (strtolower($type) == 'verify') {

				DB::table('users')
					->where('id', $user_id)
					->update(['id_verified' => 1]);

				DB::table('id_verify')
					->where('user_id', $user_id)
					->update(['status' => 1]);

				$subject = 'Verification Request Approved';
				$message = <<<EMAIL
                <div style="margin-top:10px">
                <p>Dear user, your account has been reviewed and found to comply with our community
                guidelines.Your verification request was approved successfully. A verification badge will now appear next 
                to your name as a verified agent.</p>
                
            </div>
EMAIL;
			} else if (strtolower($type) == 'deny') {

				//directory to upload image
				$upload_dir = public_path('uploads/users/' . $user_id . '/profile-photo/' . $img);

				if (file_exists($upload_dir)) {
					//delete the doc img uploaded
					unlink($upload_dir);
				}

				DB::table('users')
					->where('id', $user_id)
					->update(['id_verified' => 0]);

				DB::table('id_verify')
					->where('user_id', $user_id)
					->delete();

				$subject = 'Verification Request Approved';
				$message = <<<EMAIL
                <div style="margin-top:10px">
                <p>Dear user, we are sorry to inform you that your account wasn't verified because 
                it doesn't meet the criteria for verification</p>
            </div>
EMAIL;
			}

			//Mailer::sendMail($email,$message,$subject,true);

			return json_encode(['status' => 1]);
		}
	}


	public function adminUsersAgent()
	{

		if (Auth::check() && Auth::user()->is_admin == 1) {

			$users = User::where('is_agent', 1)
				->paginate(20);

			return json_encode(['data' => $users]);
		}
	}

	public function searchUser(Request $request)
	{

		$search_type = $request->get('search_type');
		$q = $request->get('q');

		$q = explode(' ', trim($q));

		if (count($q) > 1) {

			if ($search_type == 'agent') {

				$users = DB::table('users')
					->where(['is_agent' => 1, 'first_name' => $q[0], 'last_name' => $q[1]])
					->paginate(20);
			} else if ($search_type == 'admin') {
				$users = DB::table('users')
					->where(['is_admin' => 1, 'first_name' => $q[0], 'last_name' => $q[1]])
					->paginate(20);
			} else if ($search_type == 'all') {
				$users = DB::table('users')
					->where(['first_name' => $q[0], 'last_name' => $q[1]])
					->paginate(20);
			} else {
				$users = DB::table('users')
					->where(['is_agent' => 0, 'first_name' => $q[0], 'last_name' => $q[1]])
					->paginate(20);
			}
		} else {

			if ($search_type == 'agent') {

				$users = DB::table('users')
					->where('is_agent', 1)
					->where(function (Builder $query) use ($q) {
						$query->where('first_name', 'LIKE', "%{$q[0]}%")
							->orWhere('last_name', 'LIKE', "%{$q[0]}%");
					})->paginate(20);
			} else if ($search_type == 'admin') {

				$users = DB::table('users')
					->where('is_admin', 1)
					->where(function (Builder $query) use ($q) {
						$query->where('first_name', 'LIKE', "%{$q[0]}%")
							->orWhere('last_name', 'LIKE', "%{$q[0]}%");
					})->paginate(20);
			} else if ($search_type == 'all') {

				$users = DB::table('users')
					->where(function (Builder $query) use ($q) {
						$query->where('first_name', 'LIKE', "%{$q[0]}%")
							->orWhere('last_name', 'LIKE', "%{$q[0]}%");
					})->paginate(20);
			} else {

				$users = DB::table('users')
					->where('is_agent', 0)
					->where(function (Builder $query) use ($q) {
						$query->where('first_name', 'LIKE', "%{$q[0]}%")
							->orWhere('last_name', 'LIKE', "%{$q[0]}%");
					})
					->paginate(20);
			}
		}

		return json_encode(['data' => $users]);
	}
}
