<?php

namespace App\Repository;

use App\Models\Conversation;
use App\Repository\BaseRepository;

class ConversationRepository extends BaseRepository
{
  protected $model;
  public function __construct(Conversation $model)
  {
    parent::__construct($model);
    $this->model = $model;
  }
}
