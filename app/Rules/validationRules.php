<?php

namespace App\Rules;

class ValidationRules
{
  public static function registrationRules($is_user = null)
  {
    $rules = [
      'email' => 'required|email|unique:users',
      'password' => 'required|min:6',
      'confirm_password' => 'required|same:password',
      'reg_type' => 'required|in:user,agent'
    ];

    if ($is_user) {
      $rules['first_name'] = 'required';
      $rules['last_name'] = 'required';
      $rules['phone'] = 'required|min:11|regex:/^[0-9]+$/';
    }

    return $rules;
  }

  public static function updateUserDetailsRules()
  {
    return [
      'first_name' => 'string|min:3',
      'last_name' => 'string|min:3',
      'gender' => ["string", new CaseInsensitiveIn(["male", "female", "other"])],
      'nationality' => 'string',
      'state' => 'string',
      'whatsapp' => 'regex:/^[\+]?[0-9]{11}$/',
      'city' => 'string',
      'phone' => 'regex:/^[\+]?[0-9]{11}$/',
      'dob' => 'date',
      'address' => 'string',
    ];
  }

  public static function loginRules()
  {
    return [
      'email' => 'required|email',
      'password' => 'required',
    ];
  }

  public static function resetPasswordRules()
  {
    return [
      "email" => "required|email",
      "token" => "required|digits:6",
      "password" => "required|min:6",
      "confirm_password" => "required|same:password"
    ];
  }

  public static function storeProductRules($isUpdate = false)
  {
    return [
      'name' => $isUpdate ? 'nullable|string|max:255' : 'required|string|max:255', // Required name
      'address' => 'nullable|string|max:255', // Required address
      'amount' => $isUpdate ? 'nullable|numeric|min:0' : 'required|numeric|min:0', // Amount should be numeric and positive
      'bedrooms' => 'nullable|integer|min:1', // Bedrooms should be a non-negative integer
      'bathrooms' => 'nullable|integer|min:1', // Bathrooms should be a non-negative integer
      'toilets' => 'nullable|integer|min:1', // Toilets should be a non-negative integer
      'description' => 'nullable|string', // Optional description
      'duration' => ['nullable', 'string', new CaseInsensitiveIn(['month', 'day', 'year', 'week'])], // Limited options for duration
      'lga' => $isUpdate ? 'nullable|string|max:255' : 'required|string|max:255', // Optional LGA
      'category' => $isUpdate ? ['nullable', 'string', 'max:255', new CaseInsensitiveIn(['sell', 'rent', 'land', 'short_let'])] :
        ['required', 'string', 'max:255', new CaseInsensitiveIn(['sell', 'rent', 'land', 'shortlet'])], // Limited options for property category
      'property_type' => ['nullable', 'string', 'max:255', new CaseInsensitiveIn(['duplex', 'condo', 'apartment', 'bungalow', 'mansion'])], // Required property type
      'state' => $isUpdate ? 'nullable|string|max:255' : 'required|string|max:255', // Required state
      'other_category' => ['nullable', 'string', 'max:255', new CaseInsensitiveIn(['beach', 'modern', 'pool', 'countryside', 'islands', 'lake', 'castle', 'camping', 'estate', 'golfing', 'mansion', 'lux'])], // Optional other category
      'amenities' => 'nullable|array', // Amenities should be an array
      'amenities.*' => 'string',
      'property_fact' => 'nullable|array', // Property facts should be an array
      'property_fact.unit' => 'nullable|string|max:50', // Unit should be a string
      'property_fact.property_size' => 'nullable|integer|min:0', // Property size should be a non-negative integer
      'property_fact.upload_time' => 'nullable|integer', // Optional upload time
      'property_fact.year_built' => 'nullable|integer|gte:1900', // Year built should be a reasonable year
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

  public static function uploadPropertyImageRules()
  {
    return [
      'property_id' => "required|uuid",
      'image' => 'required|image|mimes:jpg,jpeg,png|max:700'
    ];
  }

  public static function userImageRule()
  {
    return ['image' => 'required|image|mimes:jpg,jpeg,png|max:700'];
  }

  public static function deletePropertyImageRules($property_id)
  {
    return [
      'property_id' => "required|uuid",
      'image_ids' => 'required|array', // Ensure 'image_ids' is an array
      'image_ids.*' => 'required|numeric|exists:property_images,id,property_id,' . $property_id, // Validate each ID exists in the property_images table and belongs to the given property_id
    ];
  }

  public static function createConversationRules()
  {
    return [
      "property_id" => "required|uuid",
      "message" => "required|string"
    ];
  }

  public static function sendMessageRules()
  {
    return [
      'conversation_id' => "required|uuid",
      'message' => "required|string"
    ];
  }

  public static function propertyValidationRule()
  {
    return ["property_id" => "required|uuid"];
  }
  public static function conversationValidationRule()
  {
    return ["conversation_id" => "required|uuid"];
  }

  public static function changePasswordRules()
  {
    return [
      "old_password" => "required|min:6",
      "new_password" => "required|min:6",
      "confirm_password" => "required|min:6|same:new_password"
    ];
  }

  public static function idVerificationRequestRules()
  {
    return [
      "image" => "required|image|mimes:jpg,jpeg,png|max:700",
      "doc_type" => "required|string",
      "fullname" => "required|string"
    ];
  }

  public static function newTourRules()
  {
    return [
      "first_name" => "required|string|min:3",
      "last_name" => "required|string|min:3",
      "email" => "required|email",
      "phone" => "required",
      "date" => "required|date|after:today",
      "notes" => "nullable",
      "best_contact" => ["required",new CaseInsensitiveIn(['text', 'call',])],
      "property_id" => "required|uuid",
    ];
  }
  public static function toursFilterRules()
  {
    return [
     
      "type" => ["nullable",new CaseInsensitiveIn(['resolved', 'unresolved',])],
      "limit" => "nullable|numeric",
      "page" => "nullable|numeric",
    ];
  }
}
