<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class PropertyCollection extends ResourceCollection
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
			'data' => $this->collection->toArray(),
			"meta"=>[
				'total'=>$this->total(),
				'currentPage'=>$this->currentPage(),
				'lastPage'=>$this->lastPage(),
				'perPage'=>$this->perpage(),
				'hasMorePage'=>$this->hasMorePages(),
				'nextPageUrl'=>$this->nextPageUrl(),
				'prevPageUrl'=>$this->previousPageUrl()
			]
		];
	}

}
