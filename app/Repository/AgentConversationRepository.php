<?php

namespace App\Repository;

use App\Models\AgentConversation;
use App\Repository\BaseRepository;

class AgentConversationRepository extends BaseRepository
{
  protected $model;

  public function __construct(AgentConversation $model)
  {
    parent::__construct($model);
    $this->model = $model;
  }
}
