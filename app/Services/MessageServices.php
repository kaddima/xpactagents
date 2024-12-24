<?php

namespace App\Services;

use App\Exceptions\NotFoundException;
use App\Http\Resources\ConversationCollection;
use App\Http\Resources\MessageCollection;
use App\Http\Resources\MessageResource;
use App\Repository\AgentConversationRepository;
use App\Repository\ConversationRepository;
use App\Repository\MessageRepository;
use App\Repository\PropertyRepository;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
      // add the user conversation
      $conversation = $this->conversationRepo->create([
        'property_id' => $data['property_id'],
        'created_by' => $currentUser->id
      ]);

      //add the agent conversation
      $this->agentConversationRepo->create([
        "agent_id" => $property->creator_id,
        "conversation_id" => $conversation->id
      ]);
    }

    //add the first message to the conversation
    $message =  $this->messageRepo->create([
      'conversation_id' => $conversation->id,
      'sender_id' => $conversation->created_by,
      'body' => $data['message']
    ]);

    return new MessageResource($message);
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

    $property = $conversation->propertyDetails;

    if ($currentUser->id !== $conversation->created_by && $currentUser->id !== $property->creator_id) {
      throw new AuthorizationException("Account not part of the conversation");
    }

    //add the first message to the conversation
    $message =  $this->messageRepo->create([
      'conversation_id' => $data['conversation_id'],
      'sender_id' => $currentUser->id,
      'body' => $data['message']
    ]);

    return new MessageResource($message);
  }

  public function getUserconversations($currentUser)
  {
    $conversations = $currentUser->conversations()
      ->withCount(['messages' => function ($query) use ($currentUser) {
        $query->where("sender_id", "!=", $currentUser->id);
        $query->where("read", "=", 0);
      }])
      ->latest()
      ->paginate(env("PAGINATE_NUMBER"));

    return new ConversationCollection($conversations);
  }
  /**
   * this methods gets the properties users are interested in
   * the once they send a message of enquiry for
   */
  public function getAgentPoi($currentUser, $agent_id = null)
  {
    $poi = $currentUser->agentConversations()
      ->latest()
      ->paginate(env("PAGINATE_NUMBER"));

    return new ConversationCollection($poi);
  }

  public function getpropertyConversations($property_id)
  {
    $currentUser = Auth::user();
    try {
      $property = $this->propertyRepo->findById($property_id);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException();
    }

    $conversations = $property->conversations()
      ->withCount(['messages' => function ($query) use ($currentUser) {
        $query->where("sender_id", "!=", $currentUser->id);
        $query->where("read", "=", 0);
      }])
      ->latest()
      ->paginate(env("PAGINATE_NUMBER"));

    return new ConversationCollection($conversations);
  }

  public function getMessages($conversation_id, $currentUser)
  {
    try {
      $conversation = $this->conversationRepo->findById($conversation_id);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("Invalid conversation id");
    }

    if (
      $conversation->created_by !== $currentUser->id
      && $conversation->propertyDetails->creator_id !== $currentUser->id
    ) {
      throw new AuthorizationException("Unauthorized: Account not associated with conversation");
    }

    $messages = $conversation->messages()
      ->latest()
      ->paginate(env("PAGINATE_NUMBER"));

    return new MessageCollection($messages);
  }

  public function markMessagesRead($conversation_id, $currentUser)
  {
    try {
      $conversation = $this->conversationRepo->findById($conversation_id);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("Invalid conversation id");
    }

    if (
      $conversation->created_by !== $currentUser->id
      && $conversation->propertyDetails->creator_id !== $currentUser->id
    ) {
      throw new AuthorizationException("Unauthorized: Account not associated with conversation");
    }

    $this->messageRepo->getQuery()
      ->where("conversation_id", "=", $conversation->id)
      ->where("sender_id", "!=", $currentUser->id)
      ->update(["read" => 1]);
  }

  public function resolveConversation($conversation_id, $currentUser)
  {
    try {
      $conversation = $this->conversationRepo->findById($conversation_id);
    } catch (ModelNotFoundException $e) {
      throw new NotFoundException("Invalid conversation id");
    }

    if (
      $conversation->propertyDetails->creator_id !== $currentUser->id
    ) {
      throw new AuthorizationException("Unauthorized: Account not associated with conversation");
    }

    DB::transaction(function () use ($conversation, $currentUser) {

      $this->agentConversationRepo->getQuery()
        ->where("conversation_id", "=", $conversation->id)
        ->delete();

      $conversation->delete();
    });
  }
}
