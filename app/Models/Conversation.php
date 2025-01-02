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

  protected static function boot()
  {
    parent::boot();

    static::creating(function ($model) {
      $model->id = (string) Str::uuid(); // Generate a UUID
    });

    // Deleting the conversation
    static::deleting(function ($model) {
      // Delete all associated messages
      $model->messages()->delete(); // This will delete all associated messages
    });
  }

  public function propertyDetails()
  {
    return $this->belongsTo(Property::class, "property_id");
  }

  public function user()
  {
    return $this->belongsTo(User::class, 'created_by');
  }

  public function messages()
  {
    return $this->hasMany(Message::class);
  }

  public function lastMessage()
  {
    return $this->hasOne(Message::class)->latest(); // Get the latest message
  }
}
