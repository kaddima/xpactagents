<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::all();

        echo $users->random()->id;

        Property::factory()
            ->withCreatorId($users->random()->id)
            ->count(4)
            ->create();

    }
}
