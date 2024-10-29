<?php

namespace Database\Factories;

use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    protected $model = Property::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "name" => $this->faker->sentence(),
            "description" => $this->faker->word(),
            "category" => $this->faker
                ->randomElement(
                    [
                        "sell",
                        "short_let",
                        "land",
                        "rent"
                    ]
                ),
            "bedrooms" => $this->faker->numberBetween(1,4),
            "bathrooms" => $this->faker->numberBetween(1,4),
            "toilets" => $this->faker->numberBetween(1,4),
            "amount" => $this->faker->numberBetween(100000, 5000000),
            "lga" => $this->faker->city(),
            "address" => $this->faker->address(),
        ];
    }

    public function withCreatorId($userid){
        return $this->state(['creator_id'=>$userid]);
    }
    
}
