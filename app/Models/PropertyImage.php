<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyImage extends Model
{
	use HasFactory;
	protected $table = 'property_images';
	/**
	 * prevent automatic timestamps management
	 */
	public $timestamps = false;

	protected $fillable = ['image_path', 'property_id'];

	protected static function boot()
	{
		parent::boot();

		static::creating(function ($model) {
			$model->created_at = now(); // Generate a UUID
		});

	}

		/**
	 * Get the property that owns the images.
	 */
	public function property()
	{
		return $this->belongsTo(Property::class);
	}
}
