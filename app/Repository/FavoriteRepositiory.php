<?php

namespace App\Repository;

use App\Models\Favorite;
use App\Repository\BaseRepository;

class FavoriteRepositiory extends BaseRepository
{
  protected $model;

  public function __construct(Favorite $model)
  {
    parent::__construct($model);
    $this->model = $model;
  }
}
