<?php

namespace App\Repository;

use App\Models\Message;
use App\Repository\BaseRepository;

class MessageRepository extends BaseRepository
{
  protected $model;
  public function __construct(Message $model)
  {
    parent::__construct($model);
    $this->model = $model;
  }
}
