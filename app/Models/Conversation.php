<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Conversation extends Model
{
  use HasFactory;

  /**
	 * Indicates if the model's ID is auto-incrementing.
	 *
	 * @var bool
	 */
	public $incrementing = false;

  protected $fillable = ['property_id', 'created_by'];

  protected static function boot(){
    parent::boot();
    static::creating(function($model){
      $model->id = (string) Str::uuid(); // Generate a UUID
    });
  }

  public function property()
  {
    return $this->belongsTo(Property::class);
  }

  public function user()
  {
    return $this->belongsTo(User::class, 'created_by');
  }

  public function messages()
  {
    return $this->hasMany(Message::class);
  }
}
