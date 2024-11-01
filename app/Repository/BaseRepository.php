<?php

namespace App\Repository;

use App\Repository\RepositoryInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

class BaseRepository implements RepositoryInterface
{

  protected $model;

  public function __construct(Model $model)
  {
    $this->model = $model;
  }

  public function create(array $data): Model
  {
    return $this->model->create($data);
  }

  /**
   * returns paginated records for model collection
   */
  public function getAll(int $num_of_records = 25): LengthAwarePaginator
  {
    return $this->model->paginate($num_of_records);
  }

  public function findById($id): ?Model
  {
    return $this->model->find($id);
  }

  /**
   * Updates records by there id
   */
  public function update($id, array $data): bool
  {
    return $this->model->where('id',$id)->update($data);
  }

  /**
   * deletes records by their id
   */
  public function delete($id): bool
  {
    return $this->model->destroy($id);
  }
}
