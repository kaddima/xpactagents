<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropertyTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('property', function (Blueprint $table) {
            $table->uuid("id")->primary();
            $table->uuid("creator_id");
            $table->string("name")->default("");
            $table->string("title")->nullable();
            $table->string("description")->nullable();
            $table->tinyInteger("bedrooms")->unsigned()->default(0);
            $table->tinyInteger("bathrooms")->unsigned()->default(0);
            $table->tinyInteger("toilets")->unsigned()->default(0);
            $table->string("category");
            $table->decimal("amount",15,2)->default(0.00);
            $table->string("location")->nullable();
            $table->string("lga")->nullable();
            $table->string("state")->nullable();
            $table->string("property_type")->nullable();
            $table->string("size")->nullable();
            $table->tinyInteger("published")->default(0);
            $table->string("duration")->nullable();
            $table->tinyInteger("setup")->default(0);
            $table->text("images")->default("[]");
            $table->string("address")->nullable();
            $table->text("property_fact")->default("{}");
            $table->string("amenities")->default("[]");
            $table->string("other_category")->nullable();
            $table->timestamps();

            $table->foreign("creator_id")
            ->references("id")
            ->on("users")
            ->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('property');
    }
}
