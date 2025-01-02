<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
{
	/**
	 * Transform the resource into an array.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
	 */
	public function toArray($request)
	{
		return [
			"id"=>$this->id,
			"first_name" => $this->first_name,
			"middle_name" => $this->middle_name,
			"last_name" => $this->last_name,
			"email" => $this->email,
			"phone" => $this->phone,
			"gender" => $this->gender,
			"dob" => $this->dob,
			"whatsapp" => $this->whatsapp,
			"state" => $this->state,
			"lga" => $this->lga,
			"address" => $this->address,
			"photo" => Storage::url($this->photo),
			"id_verified" => $this->id_verified,
			"last_seen" => $this->last_seen,
			"is_agent" => $this->is_agent,
			"profile_complete" => $this->profile_complete,
			"created_at" => $this->created_at
		];
	}
}
