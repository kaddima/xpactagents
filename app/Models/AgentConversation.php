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
		"conversation_id"
	];

	// Define the relationship with the agent through the pivot table
	public function agents()
	{
			return $this->belongsToMany(User::class, 'agent_conversation', 'agent_id', 'conversation_id')
					->withTimestamps();
	}
}
