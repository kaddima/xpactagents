<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Api\MessageController as ApiMessageController;
use App\Http\Controllers\BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends BaseController
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

	public function agentsPropertyOfInterest(Request $request, $agent_id=null)
	{
		return $this->apiController->getAgentPoi($request,$agent_id);
	}

	public function getUserConversations(Request $request)
	{
		return $this->apiController->getUserConversations($request);
	}

	public function getPropertyConversations(Request $request, $id)
	{
		return $this->apiController->getPropertyConversations($request, $id);
	}

	public function getAgentPropertyConversations(Request $request, $agent_id, $id)
	{
		return $this->apiController->getPropertyConversations($request, $id, $agent_id);
	}

	public function getMessages(Request $request, $id){
		return $this->apiController->getMessages($request,$id);
	}
	/**
	 * gets the messages for an agent using their id and conversation_id
	 */
	public function getAgentMessages(Request $request, $agent_id, $id){
		return $this->apiController->getMessages($request,$id,$agent_id);
	}

	public function resolveConversation(Request $request)
	{
		return $this->apiController->resolveConversation($request);
	}

	/**
	 * Marks messages as read using the conversation_id and the user_id 
	 * of the sender
	 */
	public function markMessagesRead(Request $request,$conversation_id)
	{
		return $this->apiController->markMessagesRead($request,$conversation_id);
	}
}
