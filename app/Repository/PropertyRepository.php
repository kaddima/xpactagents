<?php

namespace App\Repository;

use App\Models\Property;
use App\Repository\BaseRepository;

class PropertyRepository extends BaseRepository
{
  protected $model;
  
  public function __construct(Property $model){
    $this->model = $model;
    parent::__construct($model);
  }
  
}
