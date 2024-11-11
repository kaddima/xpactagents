<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Favorite extends Model
{
	use HasFactory;

	public $timestamps = false;

	protected $guarded = [];

	/**
	 * Get the user that owns the favorite.
	 */
	public function properties()
	{
		return $this->belongsToMany(Property::class, 'favorites');
	}
}
