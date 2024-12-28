<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use Illuminate\Support\Facades\File;

class UserActionController extends Controller
{
	protected $apiController;

	public function __construct(UserController $apiController)
	{
		$this->apiController = $apiController;
	}

	public function updateUser(Request $request)
	{
		return $this->apiController->updateUserdetails($request);
	}

	public function uploadPhoto(Request $request)
	{
		return $this->apiController->uploadUserimage($request);
	}

	public function blockUser(Request $request)
	{

		$user_id = $request->get('user_id');

		$user = DB::table('users')
			->where(['id' => $user_id])
			->first(['id', 'block', 'is_agent']);

		if ($user->is_agent == 1) {

			if ($user->block == 0) {
				DB::table('users')
					->where(['id' => $user_id])
					->update(['block' => 1]);
				//unpublish agent property
				DB::table('property')
					->where('creator_id', $user_id)
					->update(['published' => 0]);
			} else {

				DB::table('users')
					->where(['id' => $user_id])
					->update(['block' => 0]);

				//publish agents properties    
				DB::table('property')
					->where('creator_id', $user_id)
					->update(['published' => 1]);
			}
		} else {

			if ($user->block == 0) {
				DB::table('users')
					->where(['id' => $user_id])
					->update(['block' => 1]);
			} else {

				DB::table('users')
					->where(['id' => $user_id])
					->update(['block' => 0]);
			}
		}

		return json_encode(['status' => 1]);
	}

	public function deleteUser(Request $request)
	{

		$user_id = $request->get('user_id');

		$user = DB::table('users')
			->where(['id' => $user_id])
			->first(['id', 'block', 'is_agent']);

		if ($user->is_agent == 1) {

			try {
				//directory to upload image
				$upload_dir = public_path('uploads/users/' . $user_id . '/');
				//delete all agent folder containing property images
				File::deleteDirectory($upload_dir);

				//delete the agents messages
				//start with property of interest poi
				$pois = DB::table('property_of_interest')
					->where('agent_id', $user_id)
					->get();

				// delete the agents tours
				DB::table('tours')
					->where('agent_id', $user_id)
					->delete();

				//delete the agents favorite
				DB::table('favorites')
					->where('user_id', $user_id)
					->delete();

				// delete the agents properties
				$properties = DB::table('property')
					->where('creator_id', $user_id)
					->delete();

				foreach ($pois as $poi) {


					DB::beginTransaction();
					// DB::transaction(function () {
					//delete the property from property interestorss table
					DB::table('property_interestors')
						->where('property_id', $poi->property_id)
						->delete();

					//get the conversation id for this property
					$conversation_id = DB::table('conversations')
						->where('property_id', $poi->property_id)
						->first('id');

					//delete messages with the conversation id
					DB::table('messages')
						->where('conversation_id', $conversation_id->id)
						->delete();

					//delete the conversation with property
					DB::table('conversations')
						->where('property_id', $poi->property_id)
						->delete();

					// });


				}

				DB::table('property_of_interest')
					->where('agent_id', $user_id)
					->delete();

				//delete users
				DB::table('users')
					->where(['id' => $user_id])
					->delete();

				DB::commit();
			} catch (\Exception $e) {

				$error = 'Connection Failed! ' . $e->getMessage() . ' FILE: ' .
					$e->getFile() . ' on LINE: ' . $e->getLine();
				trigger_error($error, E_USER_ERROR);

				DB::rollBack();
			}
		} else {

			//delete users
			DB::table('users')
				->where(['id' => $user_id])
				->delete();
		}



		return json_encode(['status' => 1]);
	}

	public function updateAgent($data)
	{

		$column_value = [
			'first_name' => $data['first_name'],
			'last_name' => $data['last_name'],
			'phone' => $data['phone'],
			'email' => $data['email'],
			'whatsapp_number' => $data['whatsapp_number']
		];

		DB::table('agents')
			->where(['id' => $data['agent_id']])
			->update($column_value);

		//return all agents
		$agents = DB::table('agents')
			->get();

		return json_encode(['status' => 1, 'data' => $agents]);
	}

	public function deleteAgent($data)
	{

		DB::table('agents')
			->where(['id' => $data['agent_id']])
			->delete();

		//return all agents
		$agents = DB::table('agents')
			->get();

		return json_encode(['status' => 1, 'data' => $agents]);
	}

	public function deleteStatement($data)
	{

		DB::table('transaction')
			->where(['id' => $data['id']])
			->delete();

		//return all quqestions
		$statements = DB::table('transaction')
			->where(['user_id' => $data['user_id'], 'creator_id' => auth()->user()->id])
			->get();

		return json_encode(['status' => 1, 'data' => $statements]);
	}

	public function resolveAppointments(Request $request)
	{

		$appointment_id = $request->get('appointment_id');

		DB::table('appointments')
			->where('id', $appointment_id)
			->update(['resolved' => 1]);

		$appointments = DB::table('appointments')
			->where('resolved', 0)
			->get();

		return json_encode(['data' => $appointments]);
	}

	public function idVerifyRequest(Request $request)
	{
		return $this->apiController->IdVerificationRequest($request);
	}
}
