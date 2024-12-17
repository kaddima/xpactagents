<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TourResource extends JsonResource
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
            "first_name"=>$this->first_name,
            "last_name"=>$this->last_name,
            "email"=>$this->email,
            "phone"=>$this->phone,
            "date"=>$this->date,
            "notes"=>$this->notes,
            "best_contact"=>$this->best_contact,
            "property_id"=>$this->property_id,
            "resolved"=>$this->resolved,
            "agent_id"=>$this->agent_id,
            "created_at"=>$this->created_at
        ];
    }
}
