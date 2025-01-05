<?php

namespace App\Repository;

use App\Models\User;
use App\Repository\BaseRepository;
use stdClass;

class UserRepository extends BaseRepository
{
  public function __construct(User $model)
  {
    parent::__construct($model);
  }

  public function findByEmail(string $email): ?User
  {
    return $this->model->where('email', $email)->first();
  }

  public function updateByEmail(string $email, $data)
  {
    return $this->model->where('email', $email)->update($data);
  }

  public function userCountData(){
    $obj = new stdClass();
    $query = $this->getQuery();

    // Use a single query to get counts for all categories
    $counts = $query
      ->selectRaw('
            COUNT(CASE WHEN is_agent = "1" THEN 1 END) as agentCount,
            COUNT(CASE WHEN is_agent = "0" THEN 1 END) as userCount,
            COUNT(CASE WHEN is_admin = "1" THEN 1 END) as adminCount,
            COUNT(*) as totalUserCount
        ')
      ->first();

    $obj->usersCount = $counts->userCount;
    $obj->agentsCount = $counts->agentCount;
    $obj->adminsCount = $counts->adminCount;
    $obj->totalUsersCount = $counts->totalUserCount;
    return $obj;
  }
}
