<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Log;

class PropertyResource extends JsonResource
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
			'id'=>$this->id,
			'creator_id'=>$this->creator_id,
			'name'=>$this->name,
			'description'=>$this->description,
			'bedrooms'=>$this->bedrooms,
			'bathrooms'=>$this->bathrooms,
			'toilets'=>$this->toilets,
			'amount'=>$this->amount,
			'property_type'=>$this->property_type,
			'category'=>$this->category,
			'location'=>$this->location,
			'duration'=>$this->duration,
			'size'=>$this->size,
			'published'=>$this->published,
			'images'=>$this->images,
			'property_fact'=>$this->property_fact,
			'amenities'=> $this->amenities
		];
	}
}
