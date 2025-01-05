<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Str;

class User extends Authenticatable
{
	use HasApiTokens, HasFactory, Notifiable;

	/**
	 * Indicates if the model's ID is auto-incrementing.
	 *
	 * @var bool
	 */
	public $incrementing = false;

	/**
	 * The data type of the primary key ID.
	 *
	 * @var string
	 */
	protected $keyType = 'string';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array<int, string>
	 */
	protected $fillable = [
		'first_name',
		'last_name',
		'phone',
		'email',
		'password',
		'is_agent',
		'activation_code',
		'creator_id',
		'otp_expires_at'
	];

	protected $table = 'users';

	/**
	 * The attributes that should be hidden for serialization.
	 *
	 * @var array<int, string>
	 */
	protected $hidden = [
		'password',
		'remember_token',
	];

	/**
	 * Indicates if the model should be timestamped.
	 *
	 * @var bool
	 */
	public $timestamps = true;

	/**
	 * The attributes that should be cast.
	 *
	 * @var array<string, string>
	 */
	protected $casts = [
		'email_verified_at' => 'datetime',
	];

	public function setPasswordAttribute($password)
	{
		$this->attributes['password'] = bcrypt($password);
	}

	protected static function boot()
	{
		parent::boot();

		static::creating(function ($model) {
			$model->id = (string) Str::uuid(); // Generate a UUID
		});
	}

	public function scopeUser($query){
		return $query->where("is_agent", "0");
	}

	public function scopeAgent($query) {
		return $query->where("is_agent", 1);
	}

	public function scopeAdmin($query){
		return $query->where("is_admin", 1);
	}

	public function scopeFilter($query, $filters)
	{
		$column_value = [];

		foreach ($filters as $key => $value) {
			if($key == "search_type"){
				continue;
			}
			if($key == "name"){
				$name = explode(" ", $value);
				/**
				 * if searching by first name and last name a WHERE AND clause
				 * is used in the query and if only a single name is provided
				 * check for matches in first_name or last_name column
				 * */
				if(count($name) > 1){
					$column_value[] = ["first_name", "Like", "%{$name[0]}%"];
					$column_value[] = ["last_name", "Like", "%{$name[1]}%"];
				}else{
					$query->where("first_name", "LIKE", "%{$name[0]}%")
					->orWhere("last_name", "LIKE", "%{$name[0]}%");
				}
				continue;
			}
			// Other filters can be added here
			$column_value[$key] = is_string($value) && !is_numeric($value) ? strtolower($value) : $value;
		}
		// Apply the dynamic conditions to the query
		foreach ($column_value as $key => $condition) {
			if (is_array($condition)) {
				$query->where(...$condition);
			} else {
				$query->where($key, $condition);
			}
		}
		return $query->orderBy('created_at', 'desc');
	}

	public function properties()
	{
		return $this->hasMany(Property::class, "creator_id");
	}

	public function favorites()
	{
		return $this->belongsToMany(Property::class, 'favorites');
	}

	public function conversations()
	{
		return $this->hasMany(Conversation::class, 'created_by');
	}

	public function agentConversations()
	{
		return $this->hasMany(AgentConversation::class, 'agent_id', "id");
	}

	public function messages()
	{
		return $this->hasMany(Message::class, "sender_id");
	}
}
