<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdatePasswordResetTable extends Migration
{
	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('password_resets', function (Blueprint $table) {
			$table->id();
			$table->string('email')->unique()->change();
			$table->after("token", function ($table) {
				$table->timestamp("token_expires_at")->nullable();
				$table->timestamp("updated_at")->nullable();
			});
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('password_resets', function (Blueprint $table) {
			$table->dropColumn('id');
			$table->string('email')->index()->change();
			$table->dropColumn('token_expires_at');
			$table->dropColumn('updated_at');
		});
	}
}
