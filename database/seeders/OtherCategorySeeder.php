<?php

namespace Database\Seeders;

use Database\Seeders\SeedData;
use Illuminate\Database\Seeder;

class OtherCategorySeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run() {
		SeedData::multiInsert("other_category", SeedData::other_categories());
	}
}
