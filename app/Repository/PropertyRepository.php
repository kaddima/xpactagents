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
      $query = $query->where("creator_id", $agent_id);
    }
    // Use a single query to get counts for all categories
    $counts = $query
      ->selectRaw('
            COUNT(CASE WHEN category = "sell" THEN 1 END) as forSellCount,
            COUNT(CASE WHEN category = "rent" THEN 1 END) as rentCount,
            COUNT(CASE WHEN category = "land" THEN 1 END) as landCount,
            COUNT(CASE WHEN category = "short_let" THEN 1 END) as shortLetCount,
            COUNT(*) as propertyCount
        ')
      ->first();

    $obj->forSellCount = $counts->forSellCount;
    $obj->rentCount = $counts->rentCount;
    $obj->landCount = $counts->landCount;
    $obj->shortLetCount = $counts->shortLetCount;
    $obj->propertyCount = $counts->propertyCount;

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
