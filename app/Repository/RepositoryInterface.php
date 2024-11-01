<?php

namespace App\Repository;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\LengthAwarePaginator;

interface RepositoryInterface
{
    public function create(array $data): Model;
    public function getAll(int $num_of_records = 25): LengthAwarePaginator;
    public function findById($id): ?Model;
    public function update($id, array $data): bool;
    public function delete($id): bool;
}