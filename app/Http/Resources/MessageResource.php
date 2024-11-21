<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
	 */
	public function toArray($request) {
		return [
			"id"=>$this->id,
			"conversation_id"=>$this->conversation_id,
			"sender_id"=>$this->sender_id,
			"body"=>$this->body,
			"read"=>$this->read,
			"created_at"=>$this->created_at
		];
	}
}
