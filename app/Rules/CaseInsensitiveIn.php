<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class CaseInsensitiveIn implements Rule
{
	protected $values;

	// Constructor accepts the allowed values for the rule
	public function __construct($values)
	{
		$this->values = $values;
	}

	// Define the validation logic
	public function passes($attribute, $value)
	{
		// Return true if the value is found in the list, case-insensitively
		return in_array(strtolower($value), array_map('strtolower', $this->values));
	}

	// Define the error message
	public function message()
	{
		return 'The :attribute must be one of the following values: ' . implode(', ', $this->values);
	}
}
