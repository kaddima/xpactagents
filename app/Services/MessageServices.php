<?php

namespace App\Services;

use App\Exceptions\NotFoundException;
use App\Http\Resources\ConversationCollection;
use App\Http\Resources\ConversationResource;
use App\Repository\AgentConversationRepository;
use App\Repository\ConversationRepository;
use App\Repository\MessageRepository;
use App\Repository\PropertyRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MessageServices
{
  protected $messageRepo;
  protected $propertyRepo;
  protected $conversationRepo;
  protected $agentConversationRepo;

  public function __construct(
    MessageRepository $messageRepo,
    PropertyRepository $propertyRepo,
    ConversationRepository $conversationRepo,
    AgentConversationRepository $agentConversationRepo

  ) {
    $this->messageRepo = $messageRepo;
    $this->conversationRepo = $conversationRepo;
    $this->propertyRepo = $propertyRepo;
    $this->agentConversationRepo = $agentConversationRepo;
  }

  public function createConversation($data, $currentUser)
  {
    try {
      $property = $this->propertyRepo->findById($data['property_id']);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("Property does not exist");
    }

    if ($property->creator_id == $currentUser->id) {
      throw new AuthorizationException("You can't initiate conversation on your own properties");
    }

    //store the conversation
    $conversation = $this->conversationRepo->getQuery()->where([
      'property_id' => $data['property_id'],
      'created_by' => $currentUser->id
    ])->first();


    if (!$conversation) {
      $conversation = $this->conversationRepo->create([
        'property_id' => $data['property_id'],
        'created_by' => $currentUser->id
      ]);
    }

    //add the agent conversation
    $this->agentConversationRepo->create([
      "agent_id"=>$property->creator_id,
      "conversation_id"=>$conversation->id
    ]);

    //add the first message to the conversation
    return $this->messageRepo->create([
      'conversation_id' => $conversation->id,
      'sender_id' => $conversation->created_by,
      'body' => $data['message']
    ]);
  }

  public function sendMessage($data, $currentUser)
  {

    try {
      $conversation = $this->conversationRepo->findById($data['conversation_id']);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("conversation does not exist");
    }

    /**
     * Make sure the user is either the one who created the conversation
     * or the property creator
     */

     $property = $conversation->property;

     if($currentUser->id !== $conversation->created_by && $currentUser->id !== $property->creator_id){
      throw new AuthorizationException("Account not part of the conversation");
     }

    //add the first message to the conversation
    return $this->messageRepo->create([
      'conversation_id' => $data['conversation_id'],
      'sender_id' => $currentUser->id,
      'body' => $data['message']
    ]);
  }

  public function getUserconversations($currentUser){
    $conversations = $currentUser->conversations()
    ->latest()
    ->paginate(env("PAGINATE_NUMBER"));

    return new ConversationCollection($conversations);
  }

  public function getAgentConversations($currentUser, $agent_id=null){
    $conversations = $currentUser->agentConversations()
    ->with('propertyDetails')
    ->latest()
    ->paginate(env("PAGINATE_NUMBER"));

    return new ConversationCollection($conversations);
  }
}
