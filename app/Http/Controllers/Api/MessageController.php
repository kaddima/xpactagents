<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Rules\ValidationRules;
use App\Services\MessageServices;
use Illuminate\Http\Request;

class MessageController extends BaseController
{
	protected $messageServices;

	public function __construct(MessageServices $messageServices)
	{
		$this->messageServices = $messageServices;
	}

	public function createConversation(Request $request)
	{
		$data = $this->validate($request, ValidationRules::createConversationRules());
		$message = $this->messageServices->createConversation($data, $request->user());
		return $this->sendResponse($message, "Message sent");
	}

	public function sendMessage(Request $request)
	{
		$data = $this->validate($request, ValidationRules::sendMessageRules());
		$message = $this->messageServices->sendMessage($data, $request->user());
		return $this->sendResponse($message, "message sent");
	}

	public function getUserConversations(Request $request)
	{
		$conversations = $this->messageServices->getUserConversations($request->user());
		return $this->sendResponse($conversations);
	}

	public function getAgentPoi(Request $request)
	{
		//$this->validateParams(['agent_id'=>$agent_id],['agent_id'=>"required|uuid"]);
		$poi = $this->messageServices->getAgentPoi($request->user());
		return $this->sendResponse($poi);
	}

	public function getPropertyConversations(Request $request, $id)
	{
		$data = $this->validateParams(["id" => $id], ["id" => "required|uuid"]);
		$conversations = $this->messageServices->getPropertyConversations($id);
		return $this->sendResponse($conversations);
	}

	public function getMessages(Request $request, $id)
	{
		$this->validateParams(
			['id' => $id],
			['id' => "required|uuid"]
		);

		$messages = $this->messageServices->getMessages($id, $request->user());
		return $this->sendResponse($messages);
	}

	public function markMessagesRead(Request $request, $id)
	{
		$data = $this->validateParams(["id" => $id], ["id" => "required|uuid"]);
		$this->messageServices->markMessagesRead($id,$request->user());
		return $this->sendResponse(null, "messages marked as read");
	}

	public function resolveMessage(Request $request){
		$data = $this->validate($request,ValidationRules::conversationValidationRule());
		$this->messageServices->resolveMessage($data['conversation_id'], $request->user());
		return $this->sendResponse(null, 'message resolved');
	}
}
