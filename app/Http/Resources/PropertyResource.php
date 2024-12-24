<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PropertyResource extends JsonResource
{

	private $isCollection;

	public function __construct($data, bool $isCollection = false)
	{
		parent::__construct($data);
		$this->isCollection = $isCollection;
	}

	protected function transformPropertyData()
	{
		return [
			'id' => $this->id,
			'creator_id' => $this->creator_id,
			'name' => $this->name,
			'description' => $this->description,
			'bedrooms' => $this->bedrooms,
			'bathrooms' => $this->bathrooms,
			'toilets' => $this->toilets,
			'amount' => $this->amount,
			'property_type' => $this->property_type,
			'category' => $this->category,
			'location' => $this->location,
			'duration' => $this->duration,
			'size' => $this->size,
			'published' => $this->published,
			'property_fact' => $this->property_fact,
			'amenities' => $this->amenities,
		];
	}

	/**
	 * Transform the resource into an array.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
	 */
	public function toArray($request)
	{
		$images = $this->propertyImages;
		
		// Common property data
		$propertyData = $this->transformPropertyData();

		// Handle images differently depending on collection or single property
		if ($this->isCollection) {
			// In a collection, return only the first image (if available)
			$propertyData['images'] = isset($images) && $images->isNotEmpty() ? Storage::url($images->first()->image_path) : null;
		} else {
			// For a single property, return all images
			$propertyData['images'] = ImageResource::collection($images);
			$propertyData['author'] = new UserResource($this->author);
		}

		return $propertyData;
	}
}
