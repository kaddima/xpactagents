<?php

namespace App\Repository;

use App\Models\Property;
use App\Repository\BaseRepository;
use stdClass;

class PropertyRepository extends BaseRepository
{
  protected $model;

  public function __construct(Property $model)
  {
    $this->model = $model;
    parent::__construct($model);
  }

  public function getPropertyCounts($agent_id = null)
  {
    $obj = new stdClass();
    $query = $this->getQuery();

    if ($agent_id) {
      $query->where("creator_id", $agent_id);
    }
    $obj->forSellCount = $query->where("category", "sell");
    $obj->rentCount = $query->where("category", "rent");
    $obj->landCount = $query->where("category", "land");
    $obj->shortLetCount = $query->where("category", "short_let");
    $obj->propertyCount = $query->count();

    return $obj;
  }

  public function getUnpublishedPropertyCount($agent_id = null)
  {
    $query = $this->getQuery();

    if ($agent_id) {
      $query->where("creator_id", $agent_id);
    }

    return $query->where("published", "0")->count();
  }

  public function getpublishedPropertyCount($agent_id = null)
  {
    $query = $this->getQuery();

    if ($agent_id) {
      $query->where("creator_id", $agent_id);
    }

    return $query->where("published", "1")->count();
  }

  public function getUnpublishedProperties($agent_id = null, int $limit = 3)
  {
    $query = $this->getQuery();

    if ($agent_id) {
      $query->where("creator_id", $agent_id);
    }

    return $query->where('published', 0)
      ->limit($limit)
      ->get();
  }
}
