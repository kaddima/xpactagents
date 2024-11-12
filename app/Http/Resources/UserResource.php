<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

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
			"first_name" => $this->first_name,
			"middle_name" => $this->middle_name,
			"last_name" => $this->last_name,
			"email" => $this->email,
			"phone" => $this->phone,
			"whatsapp" => $this->whatsapp,
			"state" => $this->state,
			"lga" => $this->lga,
			"address" => $this->address,
			"photo" => $this->photo,
			"id_verified" => $this->id_verified,
			"last_seen" => $this->last_seen,

		];
	}
}
