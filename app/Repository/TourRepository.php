<?php

namespace App\Repository;

use App\Models\Tour;
use App\Repository\BaseRepository;

class TourRepository extends BaseRepository
{
  public function __construct(Tour $model)
  {
    parent::__construct($model);
  }
}
