<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Property extends Model
{
	use HasFactory;

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'property';

	/**
	 * The data type of the primary key ID.
	 *
	 * @var string
	 */
	protected $keyType = 'string';

	/**
	 * Indicates if the model's ID is auto-incrementing.
	 *
	 * @var bool
	 */
	public $incrementing = false;

	/**
	 * The attributes that aren't mass assignable.
	 * all attribute are mass assignable if array is empty
	 *
	 * @var array
	 */
	protected $guarded = [];

	protected static function boot()
	{
		parent::boot();

		static::creating(function ($model) {
			$model->id = (string) Str::uuid(); // Generate a UUID
		});
	}

	// Scope for published properties
	public function scopePublished($query)
	{
		return $query->where('published', 1);
	}

	// Scope for unpublished properties
	public function scopeUnpublished($query)
	{
		return $query->where('published', 0);
	}

	/**
	 * Scope a query to only include properties for a specific agent.
	 */
	public function scopeAgentProperty($query, $agentId)
	{
		return $query->where('agent_id', $agentId); // Adjust 'agent_id' to your actual column name
	}

	// Scope for filtering by criteria
	public function scopeFilter($query, $filters)
	{
		// Prepare an array to hold dynamic conditions
		$column_value = [];

		foreach ($filters as $key => $value) {
			if (isset($key)) {
				if ($key === 'baths') {
					if (strtolower($value) === 'any') {
						$column_value[] = ['bathrooms', '>=', 1];
					} elseif ($value < 5) {
						$column_value['bathrooms'] = $value;
					} else {
						$column_value[] = ['bathrooms', '>=', $value];
					}
					continue;
				} elseif ($key === 'beds') {
					if (strtolower($value) === 'any') {
						$column_value[] = ['bedrooms', '>=', 1];
					} elseif ($value < 5) {
						$column_value['bedrooms'] = $value;
					} else {
						$column_value[] = ['bedrooms', '>=', $value];
					}
					continue;
				} elseif ($key === 'min_price') {
					$column_value[] = ['price', '>=', $value];
					continue;
				} elseif ($key === 'max_price') {
					$column_value[] = ['price', '<=', $value];
					continue;
				} elseif ($key === 'page' || $key == "limit") {
					continue; // Ignore page in filters
				}

				// Other filters can be added here
				$column_value[$key] = $value;
			}
		}

		// Apply the dynamic conditions to the query
		foreach ($column_value as $key => $condition) {
			if (is_array($condition)) {
				$query->where(...$condition);
			} else {
				$query->where($key, $condition);
			}
		}

		return $query;
	}
}
