<?php

namespace App\Repository;

use App\Models\PropertyImage;
use App\Repository\BaseRepository;

class PropertyImageRepo extends BaseRepository
{
  protected $model;
  
  public function __construct(PropertyImage $model){
    $this->model = $model;
    parent::__construct($model);
  }

}
