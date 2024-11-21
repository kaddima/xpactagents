<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class MessageCollection extends ResourceCollection
{
	/**
	 * Transform the resource collection into an array.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
	 */
	public function toArray($request)
	{
		return [
			'data' => $this->collection->map(function ($msg) {
				return new MessageResource($msg); // Wrap each property with PropertyResource
			}),

			"meta" => [
				'total' => $this->total(),
				'currentPage' => $this->currentPage(),
				'lastPage' => $this->lastPage(),
				'perPage' => $this->perPage(),
				'hasMorePage' => $this->hasMorePages(),
				'nextPageUrl' => $this->nextPageUrl(),
				'prevPageUrl' => $this->previousPageUrl()
			]
		];
	}
}
