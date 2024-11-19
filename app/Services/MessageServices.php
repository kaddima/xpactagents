<?php

namespace App\Services;

use App\Exceptions\NotFoundException;
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

  public function __construct(
    MessageRepository $messageRepo,
    PropertyRepository $propertyRepo,
    ConversationRepository $conversationRepo

  ) {
    $this->messageRepo = $messageRepo;
    $this->conversationRepo = $conversationRepo;
    $this->propertyRepo = $propertyRepo;
  }

  public function createConversation($data, $currentUser)
  {
    try{
      $property = $this->propertyRepo->findById($data['property_id']);
    }catch(ModelNotFoundException $e){
      throw new NotFoundException("Property does not exist");
    }

    if($property->creator_id == $currentUser->id){
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

    //add the first message to the conversation
    return $this->messageRepo->create([
      'conversation_id'=>$conversation->id,
      'sender_id'=>$conversation->created_by,
      'body'=>$data['message']
    ]);

  }


}
