<?php
namespace App\Rules;
use Illuminate\Contracts\Validation\Rule;

class AnyOrInteger implements Rule
{
    public function passes($attribute, $value)
    {
        return $value === 'any' || (is_numeric($value) && $value >= 1 && $value <= 10);
    }

    public function message()
    {
        return 'The :attribute must be either "any" or a number between 1 and 10.';
    }
}