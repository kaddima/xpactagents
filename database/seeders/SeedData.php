<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;

class SeedData{
  public static function category(){
    return ['sell','rent','land','short_let'];
  }
  public static function other_categories(){
    return ['beach','modern','pool','countryside','islands','lake','castle','camping','estate','golfing','mansion','lux'];
  }
  public static function property_type(){
    return ['duplex','condo','apartment','bungalow','mansion'];
  }
  public static function amenities(){
    return ["Air conditioning", "Dish washer", "furnished", "In-unit water and dryer","Laundry facility","Parking allowed","Pool","Utilities included"];
  }

  public static function multiInsert($tablename, array $datas){
    $column = [];
    foreach($datas as $data){
      $column[]['name'] = $data;
    }

    DB::table($tablename)->insert($column);
  }
}
