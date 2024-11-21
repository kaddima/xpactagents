<?php

namespace App\Http\Controllers\Api;

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

	public function getAgentConversations(Request $request)
	{
		//$this->validateParams(['agent_id'=>$agent_id],['agent_id'=>"required|uuid"]);
		$conversations = $this->messageServices->getAgentConversations($request->user());
		return $this->sendResponse($conversations);
	}

	public function getPropertyConversations(Request $request, $id)
	{
		$data = $this->validateParams(["id" => $id], ["id" => "required|uuid"]);
		$conversations = $this->messageServices->getPropertyConversations($id);
		return $this->sendResponse($conversations);
	}
}
