<?php

namespace App\Repository;

use App\Models\PasswordReset;
use App\Repository\BaseRepository;

class PasswordResetRepository extends BaseRepository
{
  protected $model;
  public function __construct(PasswordReset $model)
  {
    parent::__construct($model);
    $this->model = $model;
  }

  public function findByEmail($email){
    return $this->model->where('email', $email)->first();
  }
}
