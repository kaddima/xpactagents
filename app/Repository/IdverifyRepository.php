<?php

namespace App\Repository;

use App\Models\IdVerify;
use App\Repository\BaseRepository;

class IdverifyRepository extends BaseRepository
{
  protected $model;
  
  public function __construct(IdVerify $model)
  {
    parent::__construct($model);
    $this->model = $model;
  }
}
