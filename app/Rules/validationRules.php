<?php

namespace App\Rules;

class ValidationRules
{
  public static function storeProductRules()
  {
    return   [
      'name' => 'required|string|max:255', // Required name
      'address' => 'nullable|string|max:255', // Required address
      'amount' => 'required|numeric|min:0', // Amount should be numeric and positive
      'bedrooms' => 'nullable|integer|min:0', // Bedrooms should be a non-negative integer
      'bathrooms' => 'nullable|integer|min:0', // Bathrooms should be a non-negative integer
      'toilets' => 'nullable|integer|min:0', // Toilets should be a non-negative integer
      'description' => 'nullable|string', // Optional description
      'duration' => ['nullable','string',new CaseInsensitiveIn(['month','day','year','week'])], // Limited options for duration
      'lga' => 'required|string|max:255', // Optional LGA
      'category' => ['required','string','max:255',new CaseInsensitiveIn(['sell','rent','land','shortlet'])], // Limited options for property category
      'property_type' => ['nullable','string','max:255',new CaseInsensitiveIn(['duplex','condo','apartment','bungalow','mansion'])], // Required property type
      'state' => 'required|string|max:255', // Required state
      'other_category' => ['nullable','string','max:255',new CaseInsensitiveIn(['beach','modern','pool','countryside','islands','lake','castle','camping','estate','golfing','mansion','lux'])], // Optional other category
      'amenities' => 'array', // Amenities should be an array
      'amenities.*.amenities' => 'required|string|max:255', // Each amenity should have a required string field
      'property_fact' => 'nullable|array', // Property facts should be an array
      'property_fact.unit' => 'nullable|string|max:50', // Unit should be a string
      'property_fact.property_size' => 'nullable|integer|min:0', // Property size should be a non-negative integer
      'property_fact.upload_time' => 'nullable|string', // Optional upload time
      'property_fact.year_built' => 'nullable|integer', // Year built should be a reasonable year
      'property_fact.flooring' => 'nullable|string|max:255' // Optional flooring type
    ];
  }

  /**
   * Returns validation rules for filter properties
   */
  public static function propertyFiltersRules()
  {
    return [
      'beds' => ["nullable", new AnyOrInteger()],
      'baths' => ["nullable", new AnyOrInteger()],
      'toilets' => 'nullable|integer|min:1|max:10',
      'category' => 'nullable|string|max:255',
      'other_category' => 'nullable|string|max:255|not_in:any',
      'property_type' => 'nullable|string',
      'min_price' => 'nullable|numeric|min:0',
      'max_price' => 'nullable|numeric|min:0',
      'lga' => 'nullable|string|max:255',
      'state' => 'nullable|string|max:255',
      'page' => 'nullable|integer|min:1',
      'limit' => 'nullable|integer|min:1',
    ];
  }
}
