<?php

namespace App\Repository;

use App\Models\User;
use App\Repository\BaseRepository;

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
}
