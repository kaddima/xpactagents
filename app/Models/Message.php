<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Message extends Model
{
	use HasFactory;

	/**
	 * The table associated with the model.
	 *
	 * @var string
	 */
	protected $table = 'messages';

	/**
	 * Indicates if the model's ID is auto-incrementing.
	 *
	 * @var bool
	 */
	public $incrementing = false;

	/**
	 * Indicates if the model should be timestamped.
	 *
	 * @var bool
	 */
	public $timestamps = true;

	protected $fillable = ['conversation_id', 'sender_id', 'body'];

	protected static function boot()
	{
		parent::boot();
		static::creating(function ($model) {
			$model->id = (string) Str::uuid(); // Generate a UUID
		});
	}

	public function conversation()
	{
		return $this->belongsTo(Conversation::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class);
	}
}
