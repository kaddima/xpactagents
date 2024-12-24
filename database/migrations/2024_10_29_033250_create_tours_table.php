<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateToursTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('tours', function (Blueprint $table) {
			$table->id();
			$table->string('first_name')->nullable();
			$table->string('last_name')->nullable();
			$table->string('email');
			$table->string("phone")->nullable();
			$table->timestamp("date");
			$table->text("notes")->nullable();
			$table->string("best_contact");
			$table->uuid("property_id");
			$table->tinyInteger("resolved")->default(0);
			$table->uuid("agent_id");
			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::dropIfExists('tours');
	}
}
