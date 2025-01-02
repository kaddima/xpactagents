<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\MessageController as ApiMessageController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

require __DIR__ . '/../../../Business/mailer.php';

use Business\Mailer;

class MessageController extends Controller
{
	protected $apiController;

	public function __construct(ApiMessageController $apiController)
	{
		$this->apiController = $apiController;
	}

	public function createConversation(Request $request)
	{
		return $this->apiController->createConversation($request);
	}

	public function sendMessage(Request $request){
		return $this->apiController->sendMessage($request);
	}

	public function agentsPropertyOfInterest(Request $request)
	{
		return $this->apiController->getAgentPoi($request);
	}

	public function usersPropertyOfInterest(Request $request)
	{

		$currentUser = auth()->user();

		/**
		 * Arrange the data so every property are associated to the agents key
		 * ['1'=>[[],[]]]
		 */
		$agent_assoc_property = [];

		//get the agents property conversations

		$property_of_interest = DB::table('property_interestors')
			->join('property', 'property_interestors.property_id', '=', 'property.id')
			->where('property_interestors.user_id', $currentUser->id)
			->get();

		foreach ($property_of_interest as $property) {

			$property->conversation_id = DB::table('conversations')
				->where([
					'user_id' => $currentUser->id,
					'agent_id' => $property->creator_id,
					'property_id' => $property->id
				])
				->first('id')->id;

			$property->creatorInfo = DB::table('users')
				->where('id', $property->creator_id)
				->first();
		}

		$data = [
			'property_of_interest' => $property_of_interest
		];

		return json_encode(['data' => $data]);
	}

	public function getPropertyConversations(Request $request, $id)
	{
		return $this->apiController->getPropertyConversations($request, $id);
	}

	public function getMessages(Request $request, $id){
		return $this->apiController->getMessages($request,$id);
	}

	public function agentsUserMessages(Request $request)
	{

		$conversation_id = $request->get('conversation_id');
		$property_of_interest = $request->get('property_of_interest');

		$messages = DB::table('messages')
			->where(['property_of_interest_id' => $property_of_interest, 'conversation_id' => $conversation_id])
			->orderBy('created_at', 'desc')
			->limit(20)
			->get();

		return json_encode(['data' => $messages]);
	}

	public function userMessages(Request $request)
	{

		$conversation_id = $request->get('conversation_id');
		$property_of_interest = $request->get('property_of_interest');

		$messages = DB::table('messages')
			->where(['property_of_interest_id' => $property_of_interest, 'conversation_id' => $conversation_id])
			->orderBy('created_at', 'desc')
			->limit(20)
			->get();

		return json_encode(['data' => $messages]);
	}

	public function saveMessage(Request $request)
	{

		$currentUser = auth()->user();

		$formData = $request->all();

		//store the message
		DB::table('messages')->insert([
			'conversation_id' => $formData['conversation_id'],
			'property_of_interest_id' => $formData['property_of_interest_id'],
			'sender_id' => $currentUser->id,
			'body' => $formData['message'],
			'created_at' => date('Y-m-d H:i:s')

		]);

		$messages = DB::table('messages')
			->where([
				'conversation_id' => $formData['conversation_id'],
				'property_of_interest_id' => $formData['property_of_interest_id'],
			])
			->orderBy('created_at', 'desc')
			->get();

		/**If the user is not online at the time of the message email the user */
		if ($formData['last_seen'] == 0) {

			$subject = 'Message notification from Xpactagents';

			$link = "xpactagents.com/app/q-r";

			if ($currentUser->is_agent == 0) {
				$link = "xpactagents.com/dashboard/q-r";
			}

			$message = <<<EMAIL
            <div style="font-family:Verdana, Geneva, Tahoma, sans-serif">
                <p style="font-size: 13px;">{$formData['message']}</p>
                <a href="$link" style="text-decoration: none;
                color:white;background-color:blue;border-radius:10px; padding:5px; font-size:11px;font-family:'Courier New', Courier">Reply in our messenger</a>
                <div style="margin-top: 15px;font-size:10px">
                    <p style="margin: 0;padding:0">Message from $currentUser->first_name</p>
                    <p style="margin: 0;padding:0">you may need to sign in again</p>
                </div>
            </div>
EMAIL;

			Mailer::sendMail($formData['user_email'], $message, $subject);
		}

		return json_encode(['data' => $messages]);
	}

	public function resolveMessage(Request $request)
	{

		$user_id = $request->get('user_id');
		$property_of_interest = $request->get('poi');
		$conversation_id = $request->get('conversation_id');

		if (is_numeric($user_id) && is_numeric($property_of_interest) && is_numeric($conversation_id)) {

			try {

				DB::beginTransaction();

				//get the number of interested users

				$property_interestors = DB::table('property_interestors')
					->where('property_id', $property_of_interest)
					->get();

				if (count($property_interestors) == 1) {
					DB::table('property_of_interest')
						->where('property_id', $property_of_interest)
						->delete();
				}

				//delete the messages
				DB::table('messages')
					->where('conversation_id', $conversation_id)
					->delete();

				//delete users from property interestor table

				DB::table('property_interestors')
					->where(['user_id' => $user_id, 'property_id' => $property_of_interest])
					->delete();

				//delete the coversation
				DB::table('conversations')
					->where('id', $conversation_id)
					->delete();

				DB::commit();
			} catch (\Exception $e) {
				DB::rollBack();
				$error = 'Connection Failed! ' . $e->getMessage() . ' FILE: ' .
					$e->getFile() . ' on LINE: ' . $e->getLine();
				trigger_error($error, E_USER_ERROR);
				//throw $th;
			}

			return json_encode(['status' => 1]);
		}
	}

	/**
	 * Marks messages as read using the conversation_id and the user_id 
	 * of the sender
	 */
	public function readMessage(Request $req)
	{
		$user_id = $req->get('user_id');
		$conversation_id = $req->get('conversation_id');

		DB::table('messages')
			->where(['sender_id' => $user_id, 'conversation_id' => $conversation_id])
			->update(['read' => 1]);

		return json_encode(['status' => 1]);
	}
}
