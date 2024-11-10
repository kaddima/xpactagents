<?php

namespace App\Repository;

use App\Repository\RepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
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
  public function getAll(array $column_value, int $num_of_records = 25): LengthAwarePaginator
  {
    return $this->model->where($column_value)->paginate($num_of_records);
  }

  public function findById($id): ?Model
  {
    return $this->model->findorFail($id);
  }

  /**
   * Updates records by there id
   */
  public function update($id, array $data): bool
  {
    return $this->model->where('id', $id)->update($data);
  }

  /**
   * deletes records by their id
   */
  public function delete($id): bool
  {
    return $this->model->destroy($id);
  }

  public function whereIn($column, array $data):Collection{
    return $this->model->whereIn($column, $data)->get();
  }

  /**
   * Returns a new query builder instance for the model.
   */
  public function getQuery()
  {
    return $this->model->newQuery();
  }
}
