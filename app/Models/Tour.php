<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tour extends Model
{
	use HasFactory;

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'tours';

	/**
	 * Indicates if the model should be timestamped.
	 *
	 * @var bool
	 */
	public $timestamps = true;

	protected $guarded = [];

	public function scopeResolved($query) {
		return $query->where("resolved", "1");
	}

	public function scopeUnresolved($query){
		return $query->where("resolved", "0");
	}
}
