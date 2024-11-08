<?php

namespace Database\Seeders;

use Database\Seeders\SeedData;
use Illuminate\Database\Seeder;

class AmenitiesSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		SeedData::multiInsert("amenities", SeedData::amenities());
	}
}
