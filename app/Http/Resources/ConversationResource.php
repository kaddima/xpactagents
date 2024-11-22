<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
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
			"created_by"=>$this->created_by,
			"unread_messages_count"=>$this->messages_count,
			"property_details"=> new PropertyResource($this->propertyDetails)
		];
	}
}
