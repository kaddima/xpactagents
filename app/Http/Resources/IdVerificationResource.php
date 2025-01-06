<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class IdVerificationResource extends JsonResource
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
			"id" => $this->id,
			"user_id" => $this->user_id,
			"fullname" => $this->fullname,
			"doc_type" => $this->doc_type,
			"image" => Storage::url($this->image),
			"status" => $this->status,
			"created_at" => $this->created_at
		];
	}
}
