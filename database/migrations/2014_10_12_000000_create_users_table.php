<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->string('first_name')->nullable();
            $table->string('middle_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->tinyInteger("is_agent")->default(0);
            $table->tinyInteger("is_admin")->default(0);
            $table->tinyInteger("super_admin")->default(0);
            $table->string("phone")->nullable();
            $table->string("whatsapp")->nullable();
            $table->string("state")->nullable();
            $table->string("lga")->nullable();
            $table->string("address")->nullable();
            $table->string("dob")->nullable();
            $table->string("gender")->nullable();
            $table->string("photo")->nullable();
            $table->string("favorite_properties")->default("[]");
            $table->tinyInteger("profile_complete")->default(0);
            $table->tinyInteger("email_verify")->default(0);
            $table->tinyInteger("id_verified")->default(0);
            $table->timestamp("last_seen")->useCurrent();
            $table->tinyInteger("block")->default(0);
            $table->string("activation_code")->nullable();
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
