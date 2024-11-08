<?php

namespace Database\Seeders;

use Database\Seeders\SeedData;
use Illuminate\Database\Seeder;

class PropertyTypeSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		SeedData::multiInsert("property_type", SeedData::property_type());
	}
}
