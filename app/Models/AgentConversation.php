<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AgentConversation extends Model
{
	use HasFactory;

	protected $table = 'agent_conversation';

	protected $fillable = [
		"agent_id",
		"conversation_id",
		"property_id"
	];

	/**
	 * Define the relationship between AgentConversation and Property.
	 * Each AgentConversation belongs to one Property.
	 */
	public function propertyDetails()
	{
		return $this->belongsTo(Property::class, 'property_id', 'id'); // 'property_id' as the foreign key, 'id' as the local key
	}

	public function messages()
  {
    return $this->hasMany(Message::class, "conversation_id","conversation_id");
  }
}
